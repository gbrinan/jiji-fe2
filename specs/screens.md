# JIJI Screens Specification

> Women's Health Management App (여성 건강 관리 앱)
> Mobile-first, 375px viewport baseline
> Source: Figma file `JD9zM2Pt94zikDn3aCpCNx` node `5071:8488`
> Note: Figma MCP rate limit reached -- specs derived from API contracts, agent definitions, and Figma node references.

---

## 1. Complete Screen List

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 1 | Splash | `/` | App logo + blue gradient background. Auto-redirects based on auth state. |
| 2 | Login | `/login` | Email + password sign-in form. Link to signup. |
| 3 | Signup | `/signup` | Email + password + name registration form. Link to login. |
| 4 | Onboarding / Profile Setup | `/onboarding` | Collect birthDate, height, weight after first signup. |
| 5 | MRS Survey | `/survey/mrs` | 11-question Menopause Rating Scale. 5-point Likert scale (0-4) per question. Grouped by domain: SOMATIC, PSYCHOLOGICAL, UROGENITAL. |
| 6 | MRS Result | `/survey/result` | Displays total score, severity label, domain breakdown (physical/psychological/urinary), percentile, and recommended next action. |
| 7 | HRT Absolute Contraindication Survey | `/survey/hrt/absolute` | YES/NO/DONT_KNOW questions for absolute contraindications to hormone replacement therapy. |
| 8 | HRT Relative Contraindication Survey | `/survey/hrt/relative` | YES/NO/DONT_KNOW questions grouped by category for relative contraindications. |
| 9 | HRT Result | `/survey/result?type=hrt` | HRT survey outcome: safe for therapy, contraindication found, or suspected contraindication. |
| 10 | Chat Session List | `/chat` | List of past and active chat sessions with context labels. |
| 11 | Chat Conversation | `/chat/[sessionId]` | Real-time chat interface with user/assistant bubbles. Context types: result, faq, question, closing. |
| 12 | Chat Closing Summary | `/chat/[sessionId]/closing` | Task summary (completed/total), closing message, next steps list. |
| 13 | FAQ List | `/faq` | Accordion-style FAQ items, optionally filtered by category. Each item can contain a dataBox with title and bullet items. |
| 14 | Profile | `/profile` | View and edit user profile: name, birthDate, height, weight. |
| 15 | Expert Consultation Modal | (overlay) | Displayed when nextAction = EXPERT_CONSULTATION. Provides guidance for seeking professional help. |
| 16 | CBT Guidance Chat | `/chat/[sessionId]?context=cbt` | Cognitive behavioral therapy guidance chat session. |
| 17 | Non-Hormonal Q&A Chat | `/chat/[sessionId]?context=non-hormonal` | Non-hormonal treatment information chat session. |
| 18 | Lifestyle Guidance Chat | `/chat/[sessionId]?context=lifestyle` | Lifestyle improvement guidance chat session. |

---

## 2. Screen Hierarchy

```
App Root (/)
├── (auth) -- No auth required, no bottom nav
│   ├── /login
│   └── /signup
│
├── /onboarding -- Auth required, no bottom nav (one-time flow)
│
├── (main) -- Auth required, bottom nav visible
│   ├── /survey
│   │   ├── /survey/mrs
│   │   ├── /survey/hrt/absolute
│   │   ├── /survey/hrt/relative
│   │   └── /survey/result
│   │
│   ├── /chat
│   │   ├── /chat (session list)
│   │   └── /chat/[sessionId] (conversation)
│   │
│   ├── /faq
│   │
│   └── /profile
│
└── Modals / Overlays
    └── Expert Consultation Modal
```

---

## 3. Navigation Flow Diagram

```
┌──────────┐
│  Splash   │
│    (/)    │
└────┬──────┘
     │ Check auth state
     ├──── No token ──────────────────┐
     │                                │
     │                          ┌─────▼──────┐
     │                          │   Login     │
     │                          │  /login     │◄────────┐
     │                          └─────┬───────┘         │
     │                                │                 │
     │                          ┌─────▼──────┐    ┌─────┴──────┐
     │                          │  Signup     │───►│   Login     │
     │                          │  /signup    │    └────────────┘
     │                          └─────┬───────┘
     │                                │ On signup success
     │                          ┌─────▼───────────┐
     │                          │  Onboarding      │
     │                          │  /onboarding     │
     │                          └─────┬────────────┘
     │                                │
     ├──── Has token ─────────────────┤
     │                                │
     ▼                                ▼
┌─────────────────────────────────────────────┐
│              MRS Survey                      │
│              /survey/mrs                     │
│  (11 questions, 5-point scale per question)  │
└──────────────────┬──────────────────────────┘
                   │ Submit answers
                   │ Response: diagnosis.nextAction
                   │
     ┌─────────────┼─────────────────────────────────┐
     │             │                                   │
     ▼             ▼                                   ▼
┌──────────┐ ┌─────────────────────┐          ┌───────────────────┐
│ MRS      │ │ HRT Absolute Survey │          │ Direct Chat       │
│ Result   │ │ /survey/hrt/absolute│          │ (CBT / NonHorm /  │
│ (Expert/ │ └──────────┬──────────┘          │  Lifestyle)       │
│  CBT/    │            │                     └───────────────────┘
│  NonHorm/│    nextAction
│ Lifestyle│            │
│  paths)  │  ┌─────────┼──────────────┐
└──────────┘  │                        │
              ▼                        ▼
    ┌──────────────────┐    ┌──────────────────┐
    │ Expert Consult   │    │ HRT Relative     │
    │ (Modal)          │    │ /survey/hrt/     │
    └──────────────────┘    │  relative        │
                            └────────┬─────────┘
                                     │ nextAction
                       ┌─────────────┼──────────────┐
                       ▼             ▼              ▼
              ┌──────────────┐ ┌──────────┐ ┌──────────────┐
              │ Hormonal     │ │ Relative │ │ Relative     │
              │ Therapy Info │ │ Contra-  │ │ Suspected    │
              │ (safe)       │ │ indicated│ │ Consult      │
              └──────┬───────┘ └────┬─────┘ └──────┬───────┘
                     │              │               │
                     └──────────────┼───────────────┘
                                    ▼
                           ┌────────────────┐
                           │  Result Screen  │
                           │  /survey/result │
                           └────────┬───────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │  Chat Session         │
                        │  /chat/[sessionId]    │
                        │  (context = result)   │
                        └───────────┬───────────┘
                                    │ Session end
                                    ▼
                        ┌───────────────────────┐
                        │  Closing Summary      │
                        │  taskSummary +        │
                        │  nextSteps            │
                        └───────────────────────┘


Bottom Navigation (always visible in /main):
┌────────────┬────────────┬────────────┬────────────┐
│   Survey   │    Chat    │    FAQ     │  Profile   │
│  /survey   │   /chat    │   /faq    │  /profile  │
└────────────┴────────────┴────────────┴────────────┘
```

---

## 4. Screen Details

### 4.1 Splash Screen (/)

- Full-screen blue gradient background
- Centered app logo/wordmark "JIJI"
- Auto-redirect after ~1.5s: check auth token in cookie
  - Token exists: redirect to `/survey/mrs` (or last visited)
  - No token: redirect to `/login`

### 4.2 Login Screen (/login)

- Blue gradient header (top 30-40% of screen)
- App logo centered in header area
- White card form area (rounded top corners, overlapping gradient)
- Fields: Email input, Password input
- "로그인" primary button (full width)
- "회원가입" text link below
- No bottom navigation

### 4.3 Signup Screen (/signup)

- Same layout as Login
- Fields: Name, Email, Password, Password confirmation
- "회원가입" primary button
- "이미 계정이 있으신가요? 로그인" text link
- On success: auto-login + redirect to `/onboarding`

### 4.4 Onboarding (/onboarding)

- Step indicator at top (e.g., 1/3, 2/3, 3/3)
- Collect: birthDate (date picker), height (number + cm), weight (number + kg)
- "다음" / "완료" button
- On complete: PATCH `/api/v1/users/me` then redirect to `/survey/mrs`

### 4.5 MRS Survey (/survey/mrs)

- Blue gradient header with title "갱년기 증상 평가"
- Progress bar showing current question / total (e.g., 3/11)
- Question card with:
  - Question number and domain badge (신체/심리/비뇨기)
  - Question prompt text
  - 5-option radio group (0=없음, 1=경미, 2=중등, 3=심함, 4=매우 심함)
- Navigation: "이전" / "다음" buttons
- Final question shows "제출" button
- Loading state during submission

### 4.6 MRS Result (/survey/result)

- Blue gradient header "검사 결과"
- Score summary card:
  - Total score / max possible (e.g., 28/44)
  - Severity badge (정상/경도/중등도/중증)
  - Percentile label
- Domain breakdown:
  - Physical (신체): score bar + score/total
  - Psychological (심리): score bar + score/total
  - Urinary (비뇨기): score bar + score/total
- Next action card with CTA button based on `nextAction`:
  - EXPERT_CONSULTATION: "전문의 상담 필요"
  - CBT_GUIDANCE: "인지행동치료 안내"
  - START_HRT_ABSOLUTE: "호르몬 치료 적합성 검사"
  - NON_HORMONAL_QA: "비호르몬 치료 안내"
  - LIFESTYLE_GUIDANCE: "생활습관 개선 안내"

### 4.7 HRT Absolute Survey (/survey/hrt/absolute)

- Blue gradient header "호르몬 치료 금기사항 확인"
- Progress bar
- Question card with YES / NO / 모르겠음 three-button selection
- Submit on final question

### 4.8 HRT Relative Survey (/survey/hrt/relative)

- Same layout as Absolute but questions grouped by category
- Category header dividers between question groups
- YES / NO / 모르겠음 selection

### 4.9 Chat Conversation (/chat/[sessionId])

- Blue gradient header with session context label
- Message list area (scrollable):
  - Assistant bubbles (left-aligned, light gray background)
  - User bubbles (right-aligned, blue background, white text)
  - Timestamps below each bubble
- Input area at bottom:
  - Text input field
  - Send button (blue, right side)
- Auto-scroll to latest message

### 4.10 FAQ List (/faq)

- Blue gradient header "자주 묻는 질문"
- Optional category filter tabs/chips at top
- Accordion items:
  - Question text (tap to expand)
  - Answer text (expanded state)
  - Optional dataBox: titled box with bullet list items
  - Optional footer message

### 4.11 Profile (/profile)

- Blue gradient header with user avatar placeholder
- User info card: name, email
- Editable fields: name, birthDate, height, weight
- "저장" button
- "로그아웃" button (red/danger style)

---

## 5. Route Guard Logic

| Route Group | Auth Required | Bottom Nav | Header Style |
|-------------|--------------|------------|--------------|
| `/login`, `/signup` | No | Hidden | Blue gradient, no back button |
| `/onboarding` | Yes | Hidden | Minimal, step indicator |
| `/survey/*` | Yes | Visible | Blue gradient + back button + title |
| `/chat/*` | Yes | Visible (hidden in conversation) | Blue gradient + back button |
| `/faq` | Yes | Visible | Blue gradient + title |
| `/profile` | Yes | Visible | Blue gradient + avatar |

---

## 6. Loading & Error States

Every screen must handle:
- **Loading**: Skeleton placeholders matching the content layout
- **Error**: Error card with retry button ("다시 시도")
- **Empty**: Contextual empty state illustration + message
- **401 Unauthorized**: Auto-redirect to `/login` with cookie cleanup
