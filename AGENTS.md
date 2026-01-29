1) 사용자/역할(RBAC) 및 워크플로우

권한(Role)

Admin: 조직/기준 라이브러리/템플릿 관리, 전사 권한

PM(보고서 총괄): 프로젝트 생성, 구조 설계, 승인 라우팅

Author(작성자): 섹션 서술 작성, KPI 입력, 증빙 첨부

Reviewer(검토자): 코멘트/수정요청, 근거 적정성 확인

Approver(승인자): 최종 승인, 산출물 잠금

Auditor(뷰어): 읽기/다운로드(옵션)

워크플로우(State Machine)

Draft → In Review → Revision Requested ↔ In Review → Approved → Published/Exported

섹션 단위 상태 + 보고서 전체 상태를 분리(부분 승인/부분 수정 가능)

2) 핵심 기능 모듈(화면/기능 단위)

프로젝트/보고서 생성

연도, 기준(예: GRI 2021, TCFD, ISSB S1/S2, ESRS 등), 적용 범위(연결/종속회사/사업장) 설정

보고서 템플릿(목차) 적용: 예) 일반/환경/사회/지배구조 + 중대성/전략/성과 등

보고서 편집기(섹션 기반)

섹션별 WYSIWYG 또는 MDX 기반 편집

“고정 서식 블록” 지원: 정책/조직/프로세스/성과/사례/향후계획 등

변경이력(누가/언제/무엇을) 추적

정량 KPI 관리

KPI 카탈로그(정의/단위/산식/경계/데이터 소스/담당자)

연도별 값 입력 + 사업장/사업부 breakdown + 증빙 연결

검증 규칙(단위 일치, 합계 검증, YoY 급변 알림)

기준/요구사항 라이브러리 + 매핑

기준(Framework) → 요구사항(Requirement) → 데이터포인트(DataPoint)

섹션/문단/표/KPI가 어떤 요구사항을 충족하는지 “증빙 가능한 링크”로 연결

Coverage(충족도) 대시보드: 미매핑/미증빙/검토미완료 자동 집계

증빙(근거 문서) 관리

파일 저장(S3/R2) + 메타데이터(문서명/유효기간/발행기관/버전)

섹션/KPI/요구사항에 각각 연결 가능

감사 대응용 “Evidence Pack” 자동 묶기(다운로드 zip)

검토/코멘트/태스크

섹션 단위 스레드형 코멘트(멘션/상태/할당)

체크리스트(필수 항목) 기반 검토(예: 경계, 산식, 출처, 주석)

산출(Export)

PDF: 보고서 템플릿 + 표/차트 렌더링

Word(docx): 편집 가능한 최종본 생성(권장: docx 템플릿 + merge)

공시 대응표(Requirement × 섹션/근거 링크) 자동 생성

3) PostgreSQL 데이터 모델(권장 ERD 요약)

아래는 “혼용 방지”를 위한 최소 핵심 테이블 묶음임.

A. 조직/사용자

org(조직)

user

org_member(org_id, user_id, role, permissions_json)

audit_log(행위 로그)

B. 프로젝트/보고서/버전

project(org_id, year, frameworks_selected[])

report(project_id, title, status)

report_version(report_id, version_no, frozen_at, created_by)

section(report_id, parent_section_id, order, title, type)

section_content(section_id, version_id, content_richtext, content_md, status)

포인트: 콘텐츠는 version_id로 스냅샷을 남겨 “승인된 보고서”를 고정 가능함.

C. KPI/데이터포인트

kpi_catalog(org_id, code, name, definition, unit, formula, boundary, data_owner)

kpi_value(kpi_id, project_id, period, org_unit_id, value, note, source_ref)

org_unit(사업장/사업부 트리)

D. 기준/요구사항/매핑

framework(GRI/TCFD/ISSB/ESRS…)

requirement(framework_id, code, title, text, version, tags)

datapoint(requirement_id, datapoint_code, description, mandatory_level)

mapping(target_type: SECTION|KPI|TABLE, target_id, requirement_id, datapoint_id, coverage_status)

E. 증빙/첨부

evidence_file(org_id, storage_key, filename, mime, uploaded_by, issued_by, valid_from/to)

evidence_link(evidence_id, link_type: SECTION|KPI|REQUIREMENT, link_id, note, page_range)

F. 검토/업무

comment_thread(target_type, target_id)

comment(thread_id, author_id, body, resolved_at)

task(assignee_id, target_type, target_id, priority, due_date, status)

4) Next.js 설계(권장 스택)

프론트

Next.js App Router

인증: NextAuth(Auth.js) + RBAC

UI: shadcn/ui 또는 MUI, 에디터: TipTap/Slate/Quill 중 택1

테이블/그리드: TanStack Table

백엔드

API Route 또는 tRPC(타입 안정성)

ORM: Prisma(PostgreSQL)

파일: S3/R2 + presigned URL 업로드

백그라운드 작업(내부 큐): BullMQ(+Redis) 또는 서버리스 큐(환경에 따라)

산출

PDF: React-PDF 또는 Headless Chromium(print) (레이아웃 중요 시 후자)

docx: docx 템플릿 + merge 라이브러리(서버에서 생성)

5) 최소 기능(MVP) → 확장 로드맵

MVP(4~6주 기준의 범위 예시)

프로젝트/보고서 생성(템플릿 목차)

섹션 편집 + 버전 스냅샷

KPI 카탈로그 + 값 입력(기본)

증빙 업로드 + 섹션/KPI 링크

요구사항 라이브러리(기본) + 매핑(수동)

Coverage 대시보드(미매핑/미증빙 카운트)

PDF 1종 출력

확장(Phase 2~3)

요구사항 자동 추천(태그/유사도 기반)

KPI 급변/불일치 탐지(검증 규칙 확장)

다국어(국/영) 보고서 동시 관리

감사 대응 패키지 자동 생성(요구사항별 evidence pack)

다중 조직/자회사 Consolidation(연결 범위)