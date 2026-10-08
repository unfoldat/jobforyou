import type { APIContext } from 'astro';
import { allJobs, isOpen, builtAt, todayLabel } from '../lib/jobs';

export function GET({ site }: APIContext) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const body = {
    generatedAt: builtAt.toISOString(),
    asOf: todayLabel,
    note: '정본 데이터입니다. status는 빌드 시각 기준으로 계산했습니다. 지원 전 원문(source.url)을 확인하세요.',
    count: allJobs.length,
    postings: allJobs.map((j) => ({
      ...j,
      status: isOpen(j) ? '접수중' : '마감',
      pageUrl: new URL(`${base}/jobs/${j.postingId}/`, site).href,
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
