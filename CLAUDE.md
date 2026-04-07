# JIJI — Women's Health Management App

## Project Overview

Mobile-first health management app for women experiencing menopause. Users complete diagnostic surveys (MRS, HRT contraindication checks), receive AI-powered analysis, and get personalized treatment guidance through chat.

- **Stack**: Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript
- **Auth**: Supabase Auth (JWT cookies)
- **Backend**: NestJS on Railway (`https://jiji-production-ee02.up.railway.app`)
- **Deploy**: Vercel (`https://jiji-fe2.vercel.app`)
- **Design**: Figma file `Z0QbepTW9xahclWA7MF0dZ` (team: dd, Professional plan)

## Tech Stack Details

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router (`src/app/`) |
| Styling | Tailwind CSS 4 with `@theme inline` in `globals.css` |
| Font | Pretendard (loaded as Noto Sans KR via `next/font/google`) |
| Icons | `lucide-react` |
| State | React `useState` + Context (`useAuth`) |
| API | Custom fetch wrapper (`src/lib/api.ts`) with named exports |
| Auth | `@supabase/ssr` browser client |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (AuthProvider, font)
│   ├── page.tsx                # Splash → /home or /login
│   ├── globals.css             # Design tokens (@theme inline)
│   ├── login/page.tsx          # Login (SNS + email)
│   ├── signup/page.tsx         # Registration
│   ├── onboarding/page.tsx     # Profile setup (birth, height, weight)
│   └── (main)/                 # Protected routes (auth guard + BottomNav)
│       ├── layout.tsx
│       ├── home/page.tsx       # Dashboard (greeting, action cards, chat input)
│       ├── survey/
│       │   ├── mrs/page.tsx    # MRS questionnaire (11 Likert questions)
│       │   ├── result/page.tsx # Chat-style diagnosis result
│       │   └── hrt/
│       │       ├── absolute/page.tsx  # HRT absolute contraindication
│       │       └── relative/page.tsx  # HRT relative contraindication
│       ├── chat/
│       │   ├── page.tsx              # Session list
│       │   └── [sessionId]/page.tsx  # Conversation
│       ├── faq/page.tsx        # FAQ accordion
│       └── profile/page.tsx    # Read-only profile
├── components/
│   ├── ui/         # Button, Input, Card, ProgressBar, Badge, Skeleton, RadioGroup, Accordion, ResultDomainBar
│   ├── layout/     # Header, BottomNav, ChatLayout
│   └── features/   # SurveyQuestionCard
├── hooks/useAuth.tsx    # Auth context (Supabase session)
└── lib/
    ├── api.ts           # Named API functions: authApi, usersApi, mrsApi, hrtApi, chatApi, faqApi
    ├── types.ts         # All TypeScript interfaces (mirrors backend DTOs)
    └── supabase.ts      # Supabase browser client
```

## Design System (Figma-extracted)

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0486FF` | Buttons, links, active states |
| Secondary | `#2F75F7` | Secondary text, Q. prefix |
| Background | CSS gradient (pink/peach → blue) | `.bg-figma-gradient` class |
| Card | `white`, `rounded-3xl` (24px), `border-[#fafafa]`, `shadow-md` | All cards |
| Input | `bg-[#f5f5f5]`, `rounded-2xl` (16px), `h-14`, `border-[#fafafa]` | Form inputs |
| Button | `bg-primary-500`, `rounded-2xl`, `h-14` (lg) | Primary CTAs |
| Header | Transparent + "JiJi" logo + profile avatar + bell icon | All pages |
| Text | `#1e1e1e` primary, `#334155` secondary | Body text |

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (next build)
npm run lint         # ESLint
npx vercel --prod    # Deploy to Vercel
```

## Key Conventions

- All pages use `bg-figma-gradient` background
- Header: transparent with `showLogo`, `showBackButton`, `showHomeButton`, `showProfileIcons` props
- API layer uses named exports (`mrsApi.submit()`, not `api.post()`)
- MRS result stored in `sessionStorage` key `"mrsResult"` (camelCase)
- Survey routing driven by `nextAction` field from backend response
- Chat-style result display (AI avatar + bubbles), not card-based layout
- FAQ: left blue border for answers (`border-l-2 border-primary-500`), multi-open accordion
- BottomNav: 5 tabs (Home, Survey, Chat, FAQ, Profile)

## API Base URLs

| Endpoint Prefix | Auth | Notes |
|----------------|------|-------|
| `/api/v1/auth/*` | None | Signup, signin |
| `/api/v1/users/me` | JWT | Profile CRUD |
| `/api/v1/survey/mrs` | JWT (POST) | MRS questionnaire + submit |
| `/api/v1/survey/hrt/*` | JWT | HRT absolute + relative |
| `/chats/sessions/*` | JWT | Chat sessions + messages (no /api/v1 prefix) |
| `/api/v1/chats/faq` | JWT | FAQ list |
| `/api/v1/chats/sessions/:id/closing` | JWT | Closing summary |

## Specs Reference

Detailed specifications are in `specs/`:
- `SPEC.md` — Consolidated screens, API endpoints, design tokens, components
- `api-types.ts` — TypeScript interfaces (mirrors `src/lib/types.ts`)
