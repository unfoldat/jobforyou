// 공고 데이터(정본)는 data/jobs/*.json. 페이지·목록·마크다운은 전부 여기서 만든다.

export type Job = {
  postingId: string;
  no: number;
  organizationId: string;
  organization: string;
  site: string | null;
  sector: string;
  jobTitle: string;
  headcount: string;
  duty: string;
  category: '사무직' | '현장직';
  subcategory: string;
  workMode: string;
  remoteMentioned: boolean;
  employmentType: string;
  contractText: string;
  eligibility: string;
  region: string;
  city: string;
  hours: string;
  pay: string;
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime: string; // HH:MM (24:00 = 그날 끝)
  deadlineNote: string | null;
  applyMethod: string;
  applyUrl: string | null;
  applyEmails: string[];
  applyEmailInSource: boolean;
  phone: string | null;
  submitDocs: string | null;
  requirements: string | null;
  preferences: string | null;
  notes: string | null;
  source: { name: string; url: string; document: string; batch: string; originalNo: number };
  collectedAt: string;
  verifiedAt: string | null;
};

const files = import.meta.glob('../../data/jobs/*.json', { eager: true, import: 'default' }) as Record<string, Job>;

export const SUB_ORDER = ['급식지원', '환경정리', '생산·제조', '물류·운전', '경비·안내', '세탁', '환자이송'];

// 빌드한 시각. 정적 사이트라 이 시각 기준으로 접수중/마감을 정한다.
export const builtAt = new Date();

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

function kst(d: Date) {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)!.value;
  return { y: +g('year'), m: +g('month'), d: +g('day'), hh: g('hour') === '24' ? '00' : g('hour'), mm: g('minute') };
}

export const today = (() => {
  const k = kst(builtAt);
  return { y: k.y, m: k.m, d: k.d, iso: `${k.y}-${String(k.m).padStart(2, '0')}-${String(k.d).padStart(2, '0')}`, hhmm: `${k.hh}:${k.mm}` };
})();

export const todayLabel = `${today.y}년 ${today.m}월 ${today.d}일`;

export function deadlineAt(j: Job): Date {
  if (j.deadlineTime === '24:00') return new Date(`${j.deadlineDate}T23:59:59+09:00`);
  return new Date(`${j.deadlineDate}T${j.deadlineTime}:00+09:00`);
}

export const isOpen = (j: Job) => builtAt.getTime() <= deadlineAt(j).getTime();
export const isToday = (j: Job) => j.deadlineDate === today.iso;

export function dateLabel(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const w = DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}월 ${d}일(${w})`;
}

export function deadlineLabel(j: Job) {
  return `${dateLabel(j.deadlineDate)} ${j.deadlineTime}`;
}

export function shortDeadline(j: Job) {
  const [, m, d] = j.deadlineDate.split('-').map(Number);
  return `${m}월 ${d}일`;
}

export function displayName(j: Job) {
  return j.site ? `${j.organization} ${j.site}` : j.organization;
}

export function place(j: Job) {
  return `${j.region} ${j.city}`;
}

export const allJobs: Job[] = Object.values(files).sort((a, b) => a.no - b.no);

const byDeadline = (a: Job, b: Job) =>
  deadlineAt(a).getTime() - deadlineAt(b).getTime() || a.no - b.no;

export const openJobs = allJobs.filter(isOpen).sort(byDeadline);
export const closedJobs = allJobs.filter((j) => !isOpen(j)).sort((a, b) => byDeadline(b, a));

export function pageTitle(j: Job) {
  const tail = isOpen(j) ? `${shortDeadline(j)} 마감` : `마감됨, ${shortDeadline(j)}`;
  return `${displayName(j)} ${j.jobTitle} 장애인 채용 (${tail})`;
}

// 첫 문단: 누가, 무슨 자리, 어디, 조건, 마감을 한 문단에 (AI·검색·낭독기가 그대로 가져가도 말이 되게)
export function summary(j: Job) {
  const head = `${displayName(j)}에서 ${j.jobTitle} ${j.headcount}을 채용합니다.`;
  const cond = `근무지는 ${place(j)}, 고용형태는 ${j.employmentType}, 급여는 ${j.pay}입니다.`;
  const elig = `${j.eligibility}입니다.`;
  const tail = isOpen(j)
    ? `접수 마감은 ${deadlineLabel(j)}입니다. (${todayLabel} 기준 접수 중)`
    : `이 공고는 ${deadlineLabel(j)}에 마감되었습니다. 재모집 여부는 원문에서 확인하세요.`;
  return `${head} ${cond} ${elig} ${tail}`;
}

// '이번 주' = 일요일 00:00 ~ 토요일 23:59 (한국시간). 접수 중인 공고 중 이번 주 토요일까지 마감인 것.
export const weekStart = (() => {
  const dt = new Date(Date.UTC(today.y, today.m - 1, today.d));
  dt.setUTCDate(dt.getUTCDate() - dt.getUTCDay()); // 0=일 → 이번 주 일요일로
  return dt.toISOString().slice(0, 10);
})();
export const weekEnd = (() => {
  const dt = new Date(`${weekStart}T00:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() + 6);
  return dt.toISOString().slice(0, 10);
})();
export const isThisWeek = (j: Job) => isOpen(j) && j.deadlineDate <= weekEnd;
