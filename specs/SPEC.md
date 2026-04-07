# JIJI Consolidated Specification

> Women's Health Management App — Mobile-first (375px baseline)
> Figma: file `Z0QbepTW9xahclWA7MF0dZ`, team "dd" (Professional)

---

## 1. Screens

### Screen List

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | Splash | `/` | Logo + gradient bg. Auto-redirect: auth → `/home`, no auth → `/login` |
| 2 | Login | `/login` | Gradient bg, JiJi logo, email/password card, SNS login (Naver/Kakao/Apple) |
| 3 | Signup | `/signup` | Same bg, email/password/confirm, privacy consent, page dots |
| 4 | Onboarding | `/onboarding` | 3-step: birthDate, height, weight. PATCH `/api/v1/users/me` |
| 5 | Home | `/home` | Greeting, date, action cards (diagnosis + sleep), report link, chat input |
| 6 | MRS Survey | `/survey/mrs` | 11 Likert questions (0-4), 1 at a time, domain badges |
| 7 | MRS Result | `/survey/result` | Chat-style: JIJI AI avatar + score card + domain bars + CTA |
| 8 | HRT Absolute | `/survey/hrt/absolute` | YES/NO/DONT_KNOW questions for absolute contraindications |
| 9 | HRT Relative | `/survey/hrt/relative` | Same format, grouped by category |
| 10 | Chat List | `/chat` | Session list with context labels, "new session" button |
| 11 | Chat Conversation | `/chat/[sessionId]` | User/assistant bubbles, timestamps, send input |
| 12 | FAQ | `/faq` | Accordion with Q. prefix, left blue border answers, multi-open |
| 13 | Profile | `/profile` | Read-only card (email, birthDate, language), edit button, logout |
| 14 | Closing | `/chat/[sessionId]/closing` | Task completion cards, AI closing message (TODO) |
| 15 | Expert Modal | overlay | Expert consultation guidance (TODO) |

### Route Guards

| Route Group | Auth | BottomNav | Header |
|-------------|------|-----------|--------|
| `/login`, `/signup` | No | Hidden | Gradient bg, JiJi logo |
| `/onboarding` | Yes | Hidden | Step indicator |
| `/home`, `/survey/*`, `/chat/*`, `/faq`, `/profile` | Yes | Visible (5 tabs) | Transparent + back/home/profile/bell |

### Navigation Flow

```
Splash → (auth?) → /home or /login
Login ↔ Signup → Onboarding → /home
Home → /survey/mrs → MRS Result → (nextAction routing)
  ├── EXPERT_CONSULTATION → Expert modal / chat
  ├── CBT_GUIDANCE → Chat session (context: result)
  ├── START_HRT_ABSOLUTE → /survey/hrt/absolute
  │     ├── EXPERT_CONSULTATION → chat
  │     └── START_HRT_RELATIVE → /survey/hrt/relative
  │           ├── HORMONAL_THERAPY → Chat session
  │           ├── RELATIVE_CONTRAINDICATION → chat
  │           └── RELATIVE_CONTRAINDICATION_SUSPECTED → chat
  ├── NON_HORMONAL_QA → Chat session
  └── LIFESTYLE_GUIDANCE → Chat session
```

---

## 2. API Endpoints

**Base URL**: env `NEXT_PUBLIC_API_URL` or `https://jiji-production-ee02.up.railway.app`
**Auth**: JWT Bearer via Supabase Auth

### Auth

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | `/api/v1/auth/signup` | None | `{ email, password, name }` | `{ accessToken, user }` |
| POST | `/api/v1/auth/signin` | None | `{ email, password }` | `{ accessToken, user }` |

### Users

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| GET | `/api/v1/users/me` | JWT | — | `ProfileResponse` |
| PATCH | `/api/v1/users/me` | JWT | `{ name?, birthDate?, height?, weight? }` | `ProfileResponse` |

### MRS Survey

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| GET | `/api/v1/survey/mrs` | None | — | `MrsQuestionnaire` (11 questions, domains: SOMATIC/PSYCHOLOGICAL/UROGENITAL) |
| POST | `/api/v1/survey/mrs` | JWT | `{ answers: [{ questionId, answer: 0-4 }] }` | `MrsResult` (diagnosis + symptoms breakdown) |

**MrsResult.diagnosis.nextAction**: `EXPERT_CONSULTATION` | `CBT_GUIDANCE` | `START_HRT_ABSOLUTE` | `NON_HORMONAL_QA` | `LIFESTYLE_GUIDANCE`

### HRT Surveys

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| GET | `/api/v1/survey/hrt/absolute` | JWT | — | `HrtAbsoluteQuestionnaire` |
| POST | `/api/v1/survey/hrt/absolute` | JWT | `{ answers: [{ questionId, answer: YES/NO/DONT_KNOW }] }` | `{ diagnosis: { nextAction } }` |
| GET | `/api/v1/survey/hrt/relative` | JWT | — | `HrtRelativeQuestionnaire` (questions grouped by category) |
| POST | `/api/v1/survey/hrt/relative` | JWT | `{ answers: [...] }` | `{ diagnosis: { nextAction } }` |

**HRT Absolute nextAction**: `START_HRT_RELATIVE` | `EXPERT_CONSULTATION`
**HRT Relative nextAction**: `HORMONAL_THERAPY` | `RELATIVE_CONTRAINDICATION` | `RELATIVE_CONTRAINDICATION_SUSPECTED`

### Chat

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | `/chats/sessions` | JWT | `{ context, surveyResultId? }` | `ChatSessionResponse` |
| GET | `/chats/sessions` | JWT | — | `ChatSessionResponse[]` |
| GET | `/chats/sessions/:id` | JWT | — | `ChatSessionResponse` |
| POST | `/chats/sessions/:id/end` | JWT | — | `ChatSessionResponse` |
| GET | `/chats/sessions/:sid/messages` | JWT | — | `MessageResponse[]` |
| POST | `/chats/sessions/:sid/messages` | JWT | `{ senderType, content, metadata? }` | `MessageResponse` |

**Chat contexts**: `result` | `faq` | `question` | `closing`

### FAQ & Closing

| Method | Path | Auth | Response |
|--------|------|------|----------|
| GET | `/api/v1/chats/faq` | JWT | `FaqResponse[]` (optional `?category=` filter) |
| GET | `/api/v1/chats/faq/:id` | JWT | `FaqResponse` |
| GET | `/api/v1/chats/sessions/:id/closing` | JWT | `ClosingResponse` (taskSummary, closingMessage, nextSteps) |

---

## 3. Design Tokens (Figma-extracted)

### Colors

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| primary-500 | `#0486FF` | `primary-500` | Buttons, active states, links |
| primary-600 | `#2F75F7` | `primary-600` | Secondary foreground, Q. prefix |
| primary-300 | `#93C5FD` | `primary-300` | Outlined button borders |
| foreground | `#1E1E1E` | — | Primary text |
| foreground-alt | `#334155` | `slate-700` | Secondary text, FAQ answers |
| input bg | `#F5F5F5` | — | Input backgrounds |
| border | `#FAFAFA` | — | Card/input borders |
| card bg | `#FFFFFF` | `white` | Card surfaces |
| domain-physical | `#0486FF` | `domain-physical` | Physical symptom scores |
| domain-psychological | `#8B5CF6` | `domain-psychological` | Psychological scores |
| domain-urogenital | `#EC4899` | `domain-urogenital` | Urogenital scores |

**Background gradient** (`.bg-figma-gradient`):
```css
linear-gradient(180deg, #F5E6D8 0%, #E8D5C4 15%, #D4C4D8 30%, #B8C4E8 50%, #A0B8E8 70%, #8BAEE8 85%, #7BA4E8 100%)
```

**Severity badges**: normal=green-700/50, mild=yellow-800/50, moderate=orange-800/50, severe=red-700/50

### Typography

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| heading-xl | 28-30px | Bold (700) | 34px | Logo, scores |
| heading-lg | 24px | Bold | 32px | Screen titles |
| heading-md | 20px | Semibold (600) | 28px | Card titles |
| heading-sm | 18px | Semibold | 28px | FAQ questions, buttons |
| body-lg | 16px | Regular (400) | 25px | Body text, inputs |
| body-md | 14px | Medium (500) | 20px | Labels, secondary |
| body-sm | 12px | Regular | 16px | Timestamps, captions |

**Font**: Pretendard (Regular, Medium, Semibold, Bold)

### Spacing & Layout

- Base grid: 4px
- Page padding: `px-4` (16px) or `px-5` (20px)
- Card padding: `px-[9px] py-[13px]` (FAQ) or `p-5` (general)
- Card gap: 16px (`gap-4`)
- Bottom nav height: 64px + safe area

### Border Radius

| Element | Radius | Tailwind |
|---------|--------|----------|
| Card | 24px | `rounded-3xl` |
| Button / Input | 16px | `rounded-2xl` |
| Badge / Pill | 9999px | `rounded-full` |
| Chat bubble (user) | 16px + 6px bottom-right | `rounded-2xl rounded-br-md` |
| Chat bubble (assistant) | 16px + 6px bottom-left | `rounded-2xl rounded-bl-md` |

### Shadows

| Token | CSS | Usage |
|-------|-----|-------|
| shadow-sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle cards, pills |
| shadow-md | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Cards, forms |

---

## 4. Components

### UI Components

| Component | Key Props | Visual |
|-----------|-----------|--------|
| Button | variant: primary/secondary/danger/ghost, size: sm/md/lg, fullWidth, loading | Solid `#0486FF`, rounded-2xl, h-14 (lg) |
| Input | type, label, value, onChange, error, helperText | bg-[#f5f5f5], rounded-2xl, h-14, inner shadow |
| Card | variant: default/elevated/outlined, padding: sm/md/lg | white, rounded-3xl, border-[#fafafa] |
| ProgressBar | current, total, showLabel | Gradient fill, rounded-full |
| Badge | variant: normal/mild/moderate/severe/somatic/psychological/urogenital | rounded-full, colored bg+text |
| RadioGroup | LikertRadioGroup (numeric 0-4) / HrtRadioGroup (YES/NO/DONT_KNOW) | Vertical / horizontal layout |
| Accordion | question, answer, dataBox, isOpen | Left blue border for answers |
| Skeleton | variant: text/card/circle/bar | animate-pulse |
| ResultDomainBar | label, score, total, color | Score bar with label |

### Layout Components

| Component | Key Props | Visual |
|-----------|-----------|--------|
| Header | showLogo, showBackButton, showHomeButton, showProfileIcons, transparent, title | Transparent, JiJi logo, avatar+bell |
| BottomNav | (auto-detects active tab from pathname) | 5 tabs: Home/Survey/Chat/FAQ/Profile |
| ChatLayout | title, messages, inputValue, onInputChange, onSend | Chat bubbles + sticky input |

### Feature Components

| Component | Props | Usage |
|-----------|-------|-------|
| SurveyQuestionCard | questionNumber, totalQuestions, domain?, prompt, children | MRS/HRT survey question display |

### Accessibility Requirements

- All interactive elements: min 44x44px touch target
- RadioGroup: `role="radiogroup"`, `role="radio"`, `aria-checked`
- ProgressBar: `role="progressbar"`, `aria-valuenow/min/max`
- Input: `aria-invalid`, `aria-describedby` for errors
- BottomNav: `role="navigation"`, `aria-current="page"`
- Skeleton: `aria-hidden="true"`

---

## 5. Figma Reference

- **File**: `Z0QbepTW9xahclWA7MF0dZ` (team: dd, Professional plan)
- **Main section**: `result_mobile` (node `3510:11035`) — 44 frames
- **Prototype section**: `prototype` (node `3604:29416`) — login/signup flows
- **Design system**: `system` page — Button, Input, Icons, Nav, Alert, Checkbox, etc.

### Key Screen Node IDs

| Screen | Node ID |
|--------|---------|
| Login | `3583:14849` |
| Signup | `3510:11053` |
| Home (morning) | `3510:11491` |
| Home (night) | `3510:11585` |
| MRS Result | `3510:11827` |
| HRT Absolute → Treatment | `3510:11965` |
| Closing | `3510:12069` |
| FAQ (Hormone) | `3604:19216` |
| FAQ (Non-hormone) | `3577:13107` |
| Profile | `3510:12276` |
| Report | `3510:12140` |

### Figma MCP Access

```
get_screenshot(fileKey, nodeId) — Visual reference
get_design_context(fileKey, nodeId) — Code + screenshot + metadata
use_figma(fileKey, code) — Plugin API execution
```

Rate limit: Professional plan required. File must be in "dd" team.
