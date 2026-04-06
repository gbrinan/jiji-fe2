# JIJI Components Specification

> Reusable component library for the JIJI Women's Health Management App
> Stack: React 19 + Tailwind CSS + TypeScript
> Mobile-first, 375px viewport baseline
> Source: Figma file `JD9zM2Pt94zikDn3aCpCNx` node `5071:8488`

---

## 1. Component Inventory

### 1.1 UI Components (`components/ui/`)

| Component | Variants | Used In |
|-----------|----------|---------|
| Button | primary, secondary, danger, ghost, disabled, loading | All screens |
| Input | text, email, password, number, date; with label, error, helper text | Auth, Onboarding, Profile, Chat |
| Card | default, elevated, outlined | Result, FAQ, Profile |
| ProgressBar | determinate (survey progress) | MRS Survey, HRT Surveys |
| RadioGroup | 5-option Likert (MRS), 3-option YES/NO/DONT_KNOW (HRT) | Survey screens |
| Badge | severity (normal/mild/moderate/severe), domain (somatic/psychological/urogenital) | Result screen |
| Skeleton | text, card, circle, bar | Loading states |
| Spinner | sm, md, lg | Button loading, page transitions |
| Accordion | single expand, with dataBox support | FAQ |
| Avatar | image, initials, placeholder | Profile, Chat |

### 1.2 Layout Components (`components/layout/`)

| Component | Description | Used In |
|-----------|-------------|---------|
| MobileLayout | max-w-md mx-auto wrapper, safe area padding | Root layout |
| Header | Blue gradient header with optional back button, title, action | All screens |
| BottomNav | 4-tab navigation (Survey, Chat, FAQ, Profile) | Main layout |
| PageContainer | Content area below header with scroll | All screens |

### 1.3 Feature Components (`components/features/`)

| Component | Description | Used In |
|-----------|-------------|---------|
| SurveyQuestionCard | Question prompt + answer options | MRS, HRT surveys |
| ResultScoreCard | Total score display + severity badge | MRS Result |
| ResultDomainBar | Single domain score bar (label + bar + score) | MRS Result |
| ResultActionCard | Next action CTA based on diagnosis | MRS/HRT Result |
| ChatBubble | Message bubble (user/assistant) | Chat conversation |
| ChatInput | Text input + send button fixed at bottom | Chat conversation |
| FaqItem | Expandable question + answer + optional dataBox | FAQ list |
| ProfileField | Label + value display, tap to edit | Profile |
| StepIndicator | Numbered step dots for onboarding | Onboarding |

---

## 2. Component Props Definitions

### 2.1 Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';       // default: 'md'
  fullWidth?: boolean;               // default: false
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  'data-testid'?: string;
}
```

**Visual specs:**
- Primary: `bg-gradient-to-r from-[#4A90D9] to-[#357ABD]`, white text, rounded-xl
- Secondary: `bg-white border border-[#4A90D9]`, blue text, rounded-xl
- Danger: `bg-red-500`, white text, rounded-xl
- Ghost: transparent, blue text, no border
- Min height: 48px (touch target), min-width: 44px
- Loading: spinner replaces text, button disabled
- Disabled: opacity-50, pointer-events-none

### 2.2 Input

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'date';
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  'data-testid'?: string;
}
```

**Visual specs:**
- Container: flex flex-col gap-1
- Label: text-sm font-medium text-gray-700
- Input field: h-12, px-4, rounded-xl, border border-gray-300, text-base
- Focus: ring-2 ring-[#4A90D9] border-transparent
- Error: border-red-500, ring-red-500
- Error text: text-sm text-red-500 mt-1

### 2.3 Card

```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';    // default: 'md'
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
```

**Visual specs:**
- Default: bg-white rounded-2xl p-4
- Elevated: bg-white rounded-2xl p-4 shadow-lg
- Outlined: bg-white rounded-2xl p-4 border border-gray-200

### 2.4 ProgressBar

```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;             // default: true, shows "3/11"
  color?: string;                  // default: from-[#4A90D9] to-[#357ABD]
}
```

**Visual specs:**
- Track: h-2 bg-gray-200 rounded-full w-full
- Fill: h-2 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#357ABD], transition-all duration-300
- Label: text-sm text-gray-500, right-aligned above bar
- ARIA: role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}

### 2.5 RadioGroup

```typescript
// MRS variant (5-point Likert)
interface LikertRadioGroupProps {
  questionId: number;
  options: Array<{ value: number; label: string }>;
  selectedValue: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

// HRT variant (3-option)
interface HrtRadioGroupProps {
  questionId: number;
  options: Array<{ value: string; label: string }>;  // YES, NO, DONT_KNOW
  selectedValue: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}
```

**Visual specs (Likert):**
- Container: flex flex-col gap-3
- Each option: flex items-center gap-3, min-h-[48px], px-4, py-3, rounded-xl, border
- Unselected: border-gray-200, bg-white
- Selected: border-[#4A90D9], bg-blue-50
- Radio circle: w-5 h-5, rounded-full, border-2
- Selected circle: border-[#4A90D9] with inner fill
- Label text: text-base text-gray-900
- ARIA: role="radiogroup", each option role="radio" aria-checked

**Visual specs (HRT 3-option):**
- Container: flex gap-3 (horizontal layout)
- Each option: flex-1, text-center, py-3, rounded-xl, border
- YES: selected -> bg-blue-50 border-[#4A90D9]
- NO: selected -> bg-blue-50 border-[#4A90D9]
- DONT_KNOW: selected -> bg-gray-50 border-gray-400

### 2.6 Badge

```typescript
interface BadgeProps {
  variant: 'normal' | 'mild' | 'moderate' | 'severe' | 'somatic' | 'psychological' | 'urogenital';
  label: string;
  size?: 'sm' | 'md';
}
```

**Visual specs:**
- normal: text-green-700 bg-green-50 (contrast 4.8:1)
- mild: text-yellow-800 bg-yellow-50 (contrast 5.2:1)
- moderate: text-orange-800 bg-orange-50 (contrast 5.0:1)
- severe: text-red-700 bg-red-50 (contrast 5.6:1)
- somatic: text-[#4A90D9] bg-blue-50
- psychological: text-purple-700 bg-purple-50
- urogenital: text-pink-700 bg-pink-50
- All: rounded-full px-3 py-1 text-sm font-medium

### 2.7 Header

```typescript
interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;            // for splash/login overlay effect
}
```

**Visual specs:**
- Container: w-full, bg-gradient-to-br from-[#4A90D9] to-[#357ABD]
- Height: variable (compact ~56px, extended ~120px for auth screens)
- Back button: w-10 h-10, text-white, chevron-left icon
- Title: text-lg font-semibold text-white, centered
- Safe area: pt-[env(safe-area-inset-top)]
- Bottom edge: rounded-b-3xl for screens where content overlaps

### 2.8 BottomNav

```typescript
interface BottomNavProps {
  activeTab: 'survey' | 'chat' | 'faq' | 'profile';
}
```

**Visual specs:**
- Container: fixed bottom-0 w-full max-w-md, bg-white, border-t border-gray-100, shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
- 4 tabs equally spaced (flex justify-around)
- Each tab: flex flex-col items-center gap-1, py-2, min-w-[64px]
- Icon: 24x24
- Label: text-xs
- Active: text-[#4A90D9], icon filled
- Inactive: text-gray-400, icon outline
- Safe area: pb-[env(safe-area-inset-bottom)]

### 2.9 SurveyQuestionCard

```typescript
interface SurveyQuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  domain?: MrsDomain;               // optional, shown as badge for MRS
  prompt: string;
  children: React.ReactNode;        // RadioGroup slot
}
```

**Visual specs:**
- Outer: bg-white rounded-2xl p-6 shadow-sm
- Question number: text-sm text-gray-400 mb-1
- Domain badge: (if provided) inline badge next to number
- Prompt text: text-lg font-medium text-gray-900, mb-6
- RadioGroup slot below prompt

### 2.10 ChatBubble

```typescript
interface ChatBubbleProps {
  senderType: 'user' | 'assistant';
  content: string;
  timestamp: string;                 // ISO string, formatted to HH:mm
  isLatest?: boolean;
}
```

**Visual specs:**
- User bubble: ml-auto, max-w-[80%], bg-[#4A90D9] text-white, rounded-2xl rounded-br-md, px-4 py-3
- Assistant bubble: mr-auto, max-w-[80%], bg-gray-100 text-gray-900, rounded-2xl rounded-bl-md, px-4 py-3
- Timestamp: text-xs text-gray-400, mt-1, aligned with bubble side
- Content: text-base, whitespace-pre-wrap

### 2.11 ChatInput

```typescript
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;             // default: "메시지를 입력하세요"
}
```

**Visual specs:**
- Container: fixed bottom-0, w-full max-w-md, bg-white, border-t border-gray-100, px-4 py-3
- Input: flex-1, bg-gray-100 rounded-full px-4 py-3, text-base
- Send button: w-10 h-10, bg-[#4A90D9] rounded-full, white arrow-up icon
- Disabled send: opacity-50

### 2.12 FaqItem

```typescript
interface FaqItemProps {
  question: string;
  answer: string;
  dataBox?: { title: string; items: string[] } | null;
  footerType?: string | null;
  footerMessage?: string | null;
  isOpen?: boolean;
  onToggle: () => void;
}
```

**Visual specs:**
- Container: bg-white rounded-xl border border-gray-100, overflow-hidden
- Question row: flex justify-between items-center, px-4 py-4, min-h-[56px]
- Question text: text-base font-medium text-gray-900, flex-1
- Chevron icon: text-gray-400, rotates 180deg when open
- Answer area: px-4 pb-4, text-base text-gray-600, animate slide-down
- DataBox: mt-3, bg-blue-50 rounded-lg p-4
  - Title: text-sm font-semibold text-[#357ABD] mb-2
  - Items: list-disc pl-4, text-sm text-gray-700
- Footer: mt-3, text-sm text-gray-500 italic

### 2.13 ResultDomainBar

```typescript
interface ResultDomainBarProps {
  label: string;                     // e.g., "신체 증상"
  score: number;
  total: number;
  color: string;                     // Tailwind color class
}
```

**Visual specs:**
- Container: flex flex-col gap-2
- Label row: flex justify-between, text-sm
- Label: font-medium text-gray-700
- Score: font-semibold text-gray-900 (e.g., "8/16")
- Bar track: h-3 bg-gray-100 rounded-full
- Bar fill: h-3 rounded-full, width = (score/total)*100%, transition-all duration-500
- Colors: physical=#4A90D9, psychological=#8B5CF6, urinary=#EC4899

### 2.14 MobileLayout

```typescript
interface MobileLayoutProps {
  children: React.ReactNode;
}
```

**Visual specs:**
- Container: min-h-screen bg-gray-50
- Inner: max-w-md mx-auto bg-white min-h-screen relative
- Simulates mobile device boundary on larger screens

### 2.15 Skeleton

```typescript
interface SkeletonProps {
  variant: 'text' | 'card' | 'circle' | 'bar';
  width?: string;
  height?: string;
  className?: string;
}
```

**Visual specs:**
- Base: bg-gray-200 rounded animate-pulse
- text: h-4 rounded w-full
- card: h-32 rounded-2xl w-full
- circle: rounded-full (width=height)
- bar: h-3 rounded-full w-full

---

## 3. Component Hierarchy per Screen

### Login / Signup
```
MobileLayout
└── PageContainer
    ├── Header (extended, transparent overlay mode)
    │   └── App Logo
    └── Card (elevated, negative margin to overlap header)
        ├── Input (email)
        ├── Input (password)
        ├── [Input (name, password confirm -- signup only)]
        ├── Button (primary, fullWidth)
        └── Link text (toggle login/signup)
```

### MRS Survey
```
MobileLayout
└── PageContainer
    ├── Header (title="갱년기 증상 평가", showBackButton)
    ├── ProgressBar (current/11)
    ├── SurveyQuestionCard
    │   ├── Badge (domain)
    │   └── LikertRadioGroup (5 options)
    └── Footer buttons
        ├── Button (secondary, "이전")
        └── Button (primary, "다음" / "제출")
```

### MRS Result
```
MobileLayout
└── PageContainer
    ├── Header (title="검사 결과")
    ├── Card (elevated) -- Score Summary
    │   ├── Score text (28/44)
    │   ├── Badge (severity)
    │   └── Percentile text
    ├── Card -- Domain Breakdown
    │   ├── ResultDomainBar (physical)
    │   ├── ResultDomainBar (psychological)
    │   └── ResultDomainBar (urinary)
    └── ResultActionCard
        ├── Description text
        └── Button (primary, CTA)
```

### HRT Surveys (Absolute / Relative)
```
MobileLayout
└── PageContainer
    ├── Header (title, showBackButton)
    ├── ProgressBar
    ├── [Category header -- relative only]
    ├── SurveyQuestionCard
    │   └── HrtRadioGroup (YES / NO / DONT_KNOW)
    └── Footer buttons
        ├── Button (secondary, "이전")
        └── Button (primary, "다음" / "제출")
```

### Chat Conversation
```
MobileLayout
└── PageContainer (pb-[80px] for input area)
    ├── Header (title=context label, showBackButton)
    ├── Message List (flex flex-col gap-4, overflow-y-auto)
    │   ├── ChatBubble (assistant)
    │   ├── ChatBubble (user)
    │   └── ... (repeating)
    └── ChatInput (fixed bottom)
```

### FAQ List
```
MobileLayout
└── PageContainer
    ├── Header (title="자주 묻는 질문")
    ├── Category filter chips (horizontal scroll)
    └── FAQ list (flex flex-col gap-3)
        ├── FaqItem
        ├── FaqItem
        └── ...
```

### Profile
```
MobileLayout
└── PageContainer
    ├── Header (extended, with Avatar)
    ├── Card -- User Info
    │   ├── ProfileField (name)
    │   └── ProfileField (email, readonly)
    ├── Card -- Health Info
    │   ├── ProfileField (birthDate)
    │   ├── ProfileField (height)
    │   └── ProfileField (weight)
    ├── Button (primary, "저장")
    └── Button (danger, "로그아웃")
```

---

## 4. Shared Patterns

### Error State Component
```
Card (outlined)
├── Error icon (red)
├── Error message text
└── Button (secondary, "다시 시도")
```

### Empty State Component
```
Container (flex flex-col items-center, py-12)
├── Illustration placeholder
├── Title text (text-gray-900)
├── Description text (text-gray-500)
└── Optional CTA Button
```

### Loading Skeleton per Screen
- Survey: ProgressBar skeleton + Card skeleton with 5 bar skeletons
- Result: 1 large card skeleton + 3 bar skeletons
- Chat: 6 alternating bubble skeletons
- FAQ: 5 card skeletons stacked
- Profile: Avatar circle skeleton + 5 text skeletons

---

## 5. Accessibility Requirements

| Component | ARIA Requirement |
|-----------|-----------------|
| Button | `aria-label` when icon-only, `aria-disabled` when disabled, `aria-busy` when loading |
| Input | `aria-invalid` on error, `aria-describedby` linking to error/helper text, associated `<label>` |
| RadioGroup | `role="radiogroup"`, `aria-labelledby` to question prompt, each option `role="radio"` + `aria-checked` |
| ProgressBar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax` |
| Badge | `role="status"` for severity badges |
| Accordion/FaqItem | `aria-expanded`, `aria-controls` linking to answer panel |
| BottomNav | `role="navigation"`, `aria-label="Main navigation"`, `aria-current="page"` on active |
| ChatBubble | `role="log"` on message list, `aria-label` per message with sender + time |
| Skeleton | `aria-hidden="true"`, sr-only text "로딩 중" |

### Touch Target Minimums
- All interactive elements: min 44x44px (min-h-11 min-w-11 in Tailwind)
- Radio options: full-width tap targets, min-h-[48px]
- Bottom nav tabs: min-w-[64px], full height of nav bar
