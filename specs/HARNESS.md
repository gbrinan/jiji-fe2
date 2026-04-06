# JIJI FE Harness - Agent Team Design Document

> 에이전트 팀 기반 FE 개발 harness 설계서
> 작성일: 2026-04-06
> 프로젝트: JIJI (여성 건강 관리 앱)

---

## 1. 개요

기존 BE API + Figma 디자인을 기반으로, 3개의 전문 에이전트 + 1개의 통합 오케스트레이터로 FE를 자동 생성하는 harness 구조.

### 성공 기준
- 실행 시 Figma 디자인과 동일한 UI
- `npm run build` + `tsc --noEmit` 통과
- Production BE와 API 연동 동작

### 산출물
- GitHub: https://github.com/gbrinan/jiji-fe2
- Vercel: https://jiji-fe2-nsme5rpn9-ananks-projects-378bc31c.vercel.app
- BE: https://jiji-production-ee02.up.railway.app

---

## 2. Agent Architecture

```
┌─────────────────────────────────────────────┐
│              Orchestrator (중앙)              │
│  - Phase 조율, specs 검증, 빌드/시각 검증     │
└─────────┬──────────┬──────────┬─────────────┘
          │          │          │
    ┌─────▼────┐ ┌──▼──────┐ ┌▼──────────┐
    │ Agent 1  │ │ Agent 2 │ │  Agent 3  │
    │ BE분석   │ │ 디자인  │ │  FE구현   │
    │ (읽기)   │ │ (읽기)  │ │  (쓰기)   │
    └──────────┘ └─────────┘ └───────────┘
```

### Agent 1: BE Analyst
| 항목 | 내용 |
|------|------|
| 역할 | BE 코드 분석 → API 타입/스펙 추출 |
| 입력 | BE 소스코드 (NestJS DTO, Controller, Entity) |
| 도구 | Read, Grep, Glob (읽기 전용) |
| 산출물 | `specs/api-types.ts`, `specs/api-endpoints.md` |
| 실행 방식 | Explore subagent |

**프롬프트 패턴:**
```
BE 소스코드(/path/to/backend/src/)를 분석하여:
1. 모든 DTO를 TypeScript interface로 추출
2. 엔드포인트별 HTTP method, path, auth 요구사항, body/response 타입 정리
→ specs/api-types.ts, specs/api-endpoints.md 생성
```

### Agent 2: Design Analyst
| 항목 | 내용 |
|------|------|
| 역할 | Figma 디자인 분석 → 컴포넌트/디자인 토큰 추출 |
| 입력 | Figma URL (fileKey + nodeId) |
| 도구 | Figma MCP (get_screenshot, get_design_context, get_metadata) |
| 산출물 | `specs/screens.md`, `specs/components.md`, `specs/design-tokens.md` |
| 실행 방식 | General-purpose subagent (Figma MCP 접근 필요) |

**프롬프트 패턴:**
```
Figma MCP로 fileKey={key}, nodeId={id}의 각 화면을:
1. get_screenshot으로 시각 확인
2. get_design_context로 코드/스타일 추출
3. 화면 목록, 컴포넌트 계층, 색상/타이포/간격 토큰 정리
→ specs/screens.md, specs/components.md, specs/design-tokens.md 생성
```

### Agent 3: FE Builder
| 항목 | 내용 |
|------|------|
| 역할 | Agent 1+2 산출물 → 실행 가능한 FE 앱 구현 |
| 입력 | specs/ 디렉토리 (5개 파일) |
| 도구 | Write, Edit, Bash (npm 명령) |
| 산출물 | 전체 Next.js 프로젝트 |
| 실행 방식 | Orchestrator가 직접 또는 General-purpose subagent |

**프롬프트 패턴:**
```
specs/ 아티팩트를 기반으로:
1. Next.js 프로젝트 초기화
2. Tailwind 설정 + 디자인 토큰 적용
3. API 클라이언트 구현 (types.ts 기반)
4. 화면별 페이지 & 컴포넌트 구현
5. 인증 플로우 구현
```

### Orchestrator
| 항목 | 내용 |
|------|------|
| 역할 | Phase 조율, 품질 검증, 최종 확인 |
| 검증 #1 | Agent 1+2 산출물 교차 검증 (API 응답 ↔ UI 컴포넌트 매핑) |
| 검증 #2 | `npm run build` + `tsc --noEmit` |
| 검증 #3 | Figma 스크린샷 vs 실행 화면 시각 비교 |

---

## 3. Execution Flow

```
Phase 1 (병렬)
├── Agent 1: BE 코드 → specs/api-types.ts + specs/api-endpoints.md
└── Agent 2: Figma  → specs/screens.md + components.md + design-tokens.md
     ↓
Phase 2 (직렬): Orchestrator
└── specs 교차 검증: API 응답 타입 ↔ 화면 컴포넌트 매핑 일관성
     ↓
Phase 3 (직렬): Agent 3
└── FE 구현: 프로젝트 초기화 → 컴포넌트 → 페이지 → API 연동
     ↓
Phase 4 (직렬): Orchestrator
├── npm run build (빌드 검증)
├── tsc --noEmit (타입 검증)
├── Figma vs 실행 화면 비교 (시각 검증)
└── git commit + GitHub push + Vercel 배포
```

**소요 시간 (실측)**:
- Phase 1: ~8분 (병렬)
- Phase 2: ~1분
- Phase 3: ~15분
- Phase 4: ~3분
- **총계: ~27분**

---

## 4. Specs 인터페이스 (Agent 간 계약)

### specs/ 디렉토리 구조
```
specs/
├── api-types.ts       # Agent 1 → Agent 3: TypeScript interfaces
├── api-endpoints.md   # Agent 1 → Agent 3: REST API 레퍼런스
├── screens.md         # Agent 2 → Agent 3: 화면 목록, 네비게이션 플로우
├── components.md      # Agent 2 → Agent 3: 컴포넌트 계층, props
└── design-tokens.md   # Agent 2 → Agent 3: 색상, 타이포, 간격, Tailwind 설정
```

### 각 파일의 역할
| 파일 | 생산자 | 소비자 | 핵심 내용 |
|------|--------|--------|----------|
| api-types.ts | Agent 1 | Agent 3 | Request/Response interface, enum 타입 |
| api-endpoints.md | Agent 1 | Agent 3 | HTTP method, path, auth, body/response 매핑 |
| screens.md | Agent 2 | Agent 3 | 라우트 목록, 화면 계층, 네비게이션 플로우 |
| components.md | Agent 2 | Agent 3 | 컴포넌트 인벤토리, props 정의, 화면별 조합 |
| design-tokens.md | Agent 2 | Agent 3 | 색상 팔레트, 타이포 스케일, 간격, Tailwind config |

---

## 5. 기술 스택 결정

| 항목 | 선택 | 이유 |
|------|------|------|
| Framework | Next.js 16 (App Router) | Vercel 최적화, SSR/SSG |
| Styling | Tailwind CSS 4 | 디자인 토큰 직접 매핑 |
| State | useState + Context | 최소한 (인증만 Context) |
| API | fetch wrapper | 의존성 최소화 |
| Icons | lucide-react | 트리쉐이킹, 일관된 스타일 |
| Font | Noto Sans KR (Google) | 한국어 최적화, next/font |
| Deploy | Vercel | 요구사항 |
| VCS | GitHub | 요구사항 |

---

## 6. 프로젝트 구조 (결과물)

```
jiji-fe2/
├── specs/                    # Agent 산출물 (문서)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (모바일 뷰포트)
│   │   ├── page.tsx          # Splash
│   │   ├── globals.css       # Tailwind + 디자인 토큰
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── onboarding/page.tsx
│   │   └── (main)/           # Auth guard + BottomNav
│   │       ├── layout.tsx
│   │       ├── survey/mrs/page.tsx
│   │       ├── survey/hrt-absolute/page.tsx
│   │       ├── survey/hrt-relative/page.tsx
│   │       ├── survey/result/page.tsx
│   │       ├── chat/page.tsx
│   │       ├── chat/[sessionId]/page.tsx
│   │       ├── faq/page.tsx
│   │       └── profile/page.tsx
│   ├── components/
│   │   ├── ui/               # Button, Input, Card, Badge, ProgressBar, Skeleton
│   │   └── layout/           # Header, BottomNav
│   ├── hooks/useAuth.tsx     # Auth Context
│   └── lib/
│       ├── api.ts            # fetch wrapper + JWT
│       └── types.ts          # API 타입 (Agent 1 기반)
├── .env.local                # NEXT_PUBLIC_API_URL
└── package.json
```

---

## 7. 재사용 가이드

이 harness를 다른 프로젝트에 적용하려면:

### 입력 변경
1. **Agent 1**: BE 소스 경로를 변경
2. **Agent 2**: Figma fileKey + nodeId를 변경
3. **기술 스택**: 프로젝트 요구에 맞게 조정

### 확장 가능한 부분
- Agent 수 추가 (예: Agent 4 - 테스트 작성)
- specs 포맷 변경 (OpenAPI spec 직접 사용 등)
- Phase 1에서 BE API가 Swagger를 제공하면 Agent 1을 WebFetch로 대체 가능

### 주의사항
- Figma MCP는 rate limit이 있어 한 번에 많은 노드를 요청하면 실패할 수 있음
- BE 코드가 없고 API 문서만 있는 경우, Agent 1을 WebFetch + 문서 파싱으로 대체
- Agent 3는 가장 큰 작업이므로, 큰 프로젝트에서는 화면 단위로 분할 실행 고려

---

## 8. 검증 결과

| 검증 항목 | 결과 | 비고 |
|-----------|------|------|
| npm run build | ✅ 통과 | 14 routes, 0 errors |
| tsc --noEmit | ✅ 통과 | 0 type errors |
| 라우트 수 | 12개 | Splash, Auth(2), Onboarding, Survey(4), Chat(2), FAQ, Profile |
| 컴포넌트 수 | 8개 | Button, Input, Card, Badge, ProgressBar, Skeleton, Header, BottomNav |
| API 타입 수 | 40+ | specs/api-types.ts 기준 |
| GitHub | ✅ 연동 | gbrinan/jiji-fe2 |
| Vercel | ✅ 배포 | Production READY, GitHub 자동 배포 연동 |
