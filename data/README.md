# 공고 데이터 (정본)

공고 1건 = JSON 파일 1개 (`data/jobs/<postingId>.json`). 사이트의 목록, 공고별 페이지, `jobs.md`, `jobs.json`은 전부 이 파일에서 자동으로 만들어진다. 화면에서 고치지 말고 여기를 고친다.

| 칸 | 뜻 |
| --- | --- |
| postingId | 공고 고유 번호. 형식 `<배포회차>-<연번>` (예: `2026-10-1-02`). 페이지 주소가 된다 |
| organizationId / organization / site | 기관 식별자(자동 병합 안 함), 기관명, 근무 사업장명 |
| category | **사무직 / 현장직** (첫 번째 필터) |
| subcategory | 현장직 세부: 급식지원, 환경정리, 생산·제조, 물류·운전, 경비·안내, 세탁, 환자이송 |
| workMode / remoteMentioned | 근무방식. 공고에 재택이 적혀 있을 때만 `remoteMentioned: true`, 아니면 "출근(재택 표기 없음)" |
| employmentType | 고용형태: 정규·무기 / 계약직 / 시간제 (원문은 contractText) |
| eligibility | 장애인 제한경쟁 / 장애인만 채용 / 장애인 병행채용 |
| deadlineDate, deadlineTime | 마감일(YYYY-MM-DD), 시각. `24:00`은 그날 끝. 접수중/마감은 빌드 시각으로 계산 |
| deadlineNote | 원문에 함께 적힌 표기(예: 채용시까지) |
| applyEmails / applyEmailInSource | 공개해도 되는 접수 이메일만 저장. 개인 메일(naver, daum 등)은 저장하지 않고 `applyEmailInSource: true`로 표시 |
| source | 출처 이름, 원문 주소, 첨부파일명, 배포회차, 원본 연번 |
| collectedAt / verifiedAt | 옮겨 적은 날 / 첨부파일과 대조한 날 |

원문과 다르게 적지 않는다. 확실하지 않으면 `null`로 두고 `notes`에 사유를 적는다.
