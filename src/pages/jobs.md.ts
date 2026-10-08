import type { APIContext } from 'astro';
import {
  openJobs, closedJobs, allJobs, todayLabel, displayName, deadlineLabel, place, summary, type Job,
} from '../lib/jobs';

export function GET({ site }: APIContext) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const url = (j: Job) => new URL(`${base}/jobs/${j.postingId}/`, site).href;

  const item = (j: Job) =>
    [
      `### ${displayName(j)} · ${j.jobTitle}`,
      '',
      summary(j),
      '',
      `- 분류: ${j.category} · ${j.subcategory}`,
      `- 근무지: ${place(j)}`,
      `- 근무시간: ${j.hours}`,
      `- 지원 구분: ${j.eligibility}`,
      `- 상세: ${url(j)}`,
      `- 원문: ${j.source.url}`,
      '',
    ].join('\n');

  const section = (name: string, list: Job[]) =>
    list.length ? [`## ${name} (${list.length}건)`, '', ...list.map(item)].join('\n') : '';

  const md = [
    '# 장애인 채용공고 모아보기',
    '',
    `${todayLabel} 기준 접수 중 ${openJobs.length}건, 마감 ${closedJobs.length}건 (전체 ${allJobs.length}건).`,
    '출처: 한국장애인개발원 「2026년 10월 1차 기업체 장애인 채용 안내」 첨부파일. 옮기는 과정에서 틀린 부분이 있을 수 있으니 지원 전 원문을 확인하세요.',
    '',
    section('사무직', openJobs.filter((j) => j.category === '사무직')),
    section('현장직', openJobs.filter((j) => j.category === '현장직')),
    section('마감된 공고', closedJobs),
  ].join('\n');

  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
