# JIJI Design Tokens

> Women's Health Management App (여성 건강 관리 앱)
> Mobile-first, 375px viewport baseline
> Source: Figma file `JD9zM2Pt94zikDn3aCpCNx` node `5071:8488`
> Note: Figma MCP rate limit reached. Tokens derived from Figma node references, agent design specs, and blue gradient theme definitions.

---

## 1. Color Palette

### 1.1 Primary Blue Gradient (Brand)

The app uses a blue gradient as the primary brand element, appearing in headers, buttons, and active states.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-400` | `#60A5FA` | Hover states, light accents |
| `primary-500` | `#4A90D9` | Primary gradient start, main brand color |
| `primary-600` | `#357ABD` | Primary gradient end, button pressed state |
| `primary-700` | `#1D4ED8` | High-contrast text on light backgrounds |
| `primary-800` | `#1E3A5F` | Darkest blue for critical emphasis |

**Gradient definitions:**
```css
/* Header gradient (top-left to bottom-right) */
--gradient-header: linear-gradient(135deg, #4A90D9 0%, #357ABD 100%);

/* Button gradient (left to right) */
--gradient-button: linear-gradient(90deg, #4A90D9 0%, #357ABD 100%);

/* Subtle background gradient (top to bottom) */
--gradient-bg-subtle: linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%);
```

**Tailwind usage:**
```
Header:  bg-gradient-to-br from-[#4A90D9] to-[#357ABD]
Button:  bg-gradient-to-r from-[#4A90D9] to-[#357ABD]
BG:      bg-gradient-to-b from-blue-50 to-white
```

### 1.2 Neutral / Gray Scale

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `gray-50` | `#F9FAFB` | `gray-50` | Page background, subtle fills |
| `gray-100` | `#F3F4F6` | `gray-100` | Card borders, assistant chat bubble bg, input bg |
| `gray-200` | `#E5E7EB` | `gray-200` | Dividers, skeleton base, progress track |
| `gray-300` | `#D1D5DB` | `gray-300` | Input borders, disabled borders |
| `gray-400` | `#9CA3AF` | `gray-400` | Placeholder text, inactive nav icons |
| `gray-500` | `#6B7280` | `gray-500` | Secondary text, helper text, timestamps |
| `gray-600` | `#4B5563` | `gray-600` | Body text alternate |
| `gray-700` | `#374151` | `gray-700` | Input labels, body text |
| `gray-800` | `#1F2937` | `gray-800` | Emphasis text |
| `gray-900` | `#111827` | `gray-900` | Primary text, headings |

### 1.3 Semantic / Status Colors

| Token | Text Hex | Background Hex | Tailwind | Usage | Contrast Ratio |
|-------|----------|----------------|----------|-------|----------------|
| `success` | `#15803D` | `#F0FDF4` | `text-green-700 bg-green-50` | Normal severity, success states | 4.8:1 |
| `warning-mild` | `#854D0E` | `#FEFCE8` | `text-yellow-800 bg-yellow-50` | Mild severity | 5.2:1 |
| `warning-moderate` | `#9A3412` | `#FFF7ED` | `text-orange-800 bg-orange-50` | Moderate severity | 5.0:1 |
| `danger` | `#B91C1C` | `#FEF2F2` | `text-red-700 bg-red-50` | Severe severity, errors, destructive | 5.6:1 |
| `info` | `#1D4ED8` | `#EFF6FF` | `text-blue-700 bg-blue-50` | Informational, dataBox | 4.6:1 |

### 1.4 Domain Colors (Survey Results)

| Domain | Hex | Tailwind | Usage |
|--------|-----|----------|-------|
| Physical (신체) | `#4A90D9` | `text-[#4A90D9]` | Physical symptom score bar |
| Psychological (심리) | `#8B5CF6` | `text-violet-500` | Psychological symptom score bar |
| Urogenital (비뇨기) | `#EC4899` | `text-pink-500` | Urogenital symptom score bar |

### 1.5 Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-primary` | `#FFFFFF` | Cards, modals, bottom nav, main content |
| `surface-secondary` | `#F9FAFB` | Page background, alternate rows |
| `surface-elevated` | `#FFFFFF` | Elevated cards (with shadow) |
| `surface-overlay` | `rgba(0, 0, 0, 0.5)` | Modal/dialog backdrop |

---

## 2. Typography

### 2.1 Font Family

```css
--font-primary: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

The app targets Korean-speaking users (갱년기 여성). Pretendard is the recommended Korean web font. Fallback to system fonts.

**Next.js configuration:**
```typescript
// Use next/font/local or next/font/google
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});
```

### 2.2 Type Scale

| Token | Size (px) | Size (rem) | Weight | Line Height | Tailwind | Usage |
|-------|-----------|------------|--------|-------------|----------|-------|
| `heading-xl` | 28px | 1.75rem | 700 (bold) | 36px (1.286) | `text-[28px] font-bold leading-9` | Splash title, result score |
| `heading-lg` | 24px | 1.5rem | 700 (bold) | 32px (1.333) | `text-2xl font-bold` | Screen titles in header |
| `heading-md` | 20px | 1.25rem | 600 (semibold) | 28px (1.4) | `text-xl font-semibold` | Card titles, section headers |
| `heading-sm` | 18px | 1.125rem | 600 (semibold) | 24px (1.333) | `text-lg font-semibold` | Header title text, question prompt |
| `body-lg` | 16px | 1rem | 400 (normal) | 24px (1.5) | `text-base` | Primary body text, input text |
| `body-md` | 14px | 0.875rem | 400 (normal) | 20px (1.429) | `text-sm` | Secondary text, labels |
| `body-sm` | 12px | 0.75rem | 400 (normal) | 16px (1.333) | `text-xs` | Captions, timestamps, bottom nav labels |
| `button-lg` | 16px | 1rem | 600 (semibold) | 24px | `text-base font-semibold` | Primary buttons |
| `button-md` | 14px | 0.875rem | 600 (semibold) | 20px | `text-sm font-semibold` | Secondary buttons |

### 2.3 Font Weight Map

| Weight | CSS Value | Tailwind | Usage |
|--------|-----------|----------|-------|
| Regular | 400 | `font-normal` | Body text, descriptions |
| Medium | 500 | `font-medium` | Labels, FAQ questions, emphasis |
| Semibold | 600 | `font-semibold` | Buttons, subheadings, header title |
| Bold | 700 | `font-bold` | Headings, scores, primary actions |

**Note on target users:** The primary audience is women aged 40-60 experiencing menopause. Body text should be minimum 16px for readability. Important information (scores, labels) should be 18px+.

---

## 3. Spacing

### 3.1 Base Unit

The spacing system uses a **4px base grid**.

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `space-0` | 0px | `0` | - |
| `space-0.5` | 2px | `0.5` | Fine adjustments |
| `space-1` | 4px | `1` | Tight gaps (icon-label) |
| `space-2` | 8px | `2` | Inline spacing, small gaps |
| `space-3` | 12px | `3` | Compact card padding, list item gap |
| `space-4` | 16px | `4` | Standard card padding, section gap |
| `space-5` | 20px | `5` | Page horizontal padding |
| `space-6` | 24px | `6` | Large card padding, survey question card |
| `space-8` | 32px | `8` | Section separation |
| `space-10` | 40px | `10` | Header content vertical padding |
| `space-12` | 48px | `12` | Large section separation, empty state padding |
| `space-16` | 64px | `16` | Bottom nav height offset |

### 3.2 Common Layout Spacing

| Context | Value | Notes |
|---------|-------|-------|
| Page horizontal padding | 20px (`px-5`) | Content area left/right margin |
| Card internal padding | 16-24px (`p-4` to `p-6`) | Depends on card complexity |
| Gap between cards/sections | 16px (`gap-4`) | Vertical space between major elements |
| Gap between form fields | 16px (`gap-4`) | Between Input components |
| Gap between radio options | 12px (`gap-3`) | Between RadioGroup items |
| Header height (compact) | 56px | Standard screen header |
| Header height (extended) | 120-160px | Auth screens with logo |
| Bottom nav height | 64px + safe area | Fixed bottom bar |
| FAQ item gap | 12px (`gap-3`) | Between accordion items |
| Chat message gap | 16px (`gap-4`) | Between chat bubbles |

---

## 4. Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `radius-sm` | 8px | `rounded-lg` | Small badges, chips |
| `radius-md` | 12px | `rounded-xl` | Buttons, inputs, radio options |
| `radius-lg` | 16px | `rounded-2xl` | Cards, question cards, modals |
| `radius-xl` | 24px | `rounded-3xl` | Header bottom curve, auth card overlap |
| `radius-full` | 9999px | `rounded-full` | Avatars, progress bars, send button, badges |

### Specific Usage

| Element | Radius | Tailwind |
|---------|--------|----------|
| Button (all variants) | 12px | `rounded-xl` |
| Input field | 12px | `rounded-xl` |
| Card | 16px | `rounded-2xl` |
| Header bottom edge | 24px | `rounded-b-3xl` |
| Chat bubble (user) | 16px, 6px bottom-right | `rounded-2xl rounded-br-md` |
| Chat bubble (assistant) | 16px, 6px bottom-left | `rounded-2xl rounded-bl-md` |
| Progress bar track/fill | 9999px | `rounded-full` |
| Avatar | 9999px | `rounded-full` |
| Badge | 9999px | `rounded-full` |
| Bottom nav | 0 (square bottom) | - |
| Send button | 9999px | `rounded-full` |
| FAQ accordion item | 12px | `rounded-xl` |

---

## 5. Shadows

| Token | CSS Value | Tailwind | Usage |
|-------|-----------|----------|-------|
| `shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | `shadow-sm` | Subtle card elevation |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` | `shadow-md` | Floating elements, auth card |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` | `shadow-lg` | Elevated cards (result card) |
| `shadow-nav` | `0 -2px 10px rgba(0, 0, 0, 0.05)` | `shadow-[0_-2px_10px_rgba(0,0,0,0.05)]` | Bottom navigation upward shadow |
| `shadow-none` | none | `shadow-none` | Flat cards, outlined cards |

---

## 6. Blue Gradient Theme Details

The blue gradient is the defining visual element of the JIJI app, used consistently across all screens.

### 6.1 Header Gradient Pattern

```css
/* Standard header (all main screens) */
.header-gradient {
  background: linear-gradient(135deg, #4A90D9 0%, #357ABD 100%);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

/* Extended header (auth screens) */
.header-gradient-extended {
  background: linear-gradient(135deg, #4A90D9 0%, #357ABD 100%);
  min-height: 200px;
  /* No bottom radius -- content card overlaps */
}
```

**Tailwind implementation:**
```html
<!-- Standard header -->
<header class="bg-gradient-to-br from-[#4A90D9] to-[#357ABD] rounded-b-3xl px-5 pt-[env(safe-area-inset-top)] pb-6">
  <!-- content -->
</header>

<!-- Extended auth header -->
<header class="bg-gradient-to-br from-[#4A90D9] to-[#357ABD] min-h-[200px] px-5 pt-[env(safe-area-inset-top)]">
  <!-- logo, centered -->
</header>
```

### 6.2 Gradient Usage Map

| Element | Gradient | Direction |
|---------|----------|-----------|
| Page headers | `#4A90D9` to `#357ABD` | 135deg (top-left to bottom-right) |
| Primary buttons | `#4A90D9` to `#357ABD` | 90deg (left to right) |
| Progress bar fill | `#4A90D9` to `#357ABD` | 90deg (left to right) |
| Active nav icon | Solid `#4A90D9` | N/A (flat color) |
| Selected radio border | Solid `#4A90D9` | N/A (flat color) |
| User chat bubble | Solid `#4A90D9` | N/A (flat color) |
| Page background | `#EFF6FF` to `#FFFFFF` | 180deg (top to bottom, subtle) |

### 6.3 Button Gradient States

```css
/* Default */
background: linear-gradient(90deg, #4A90D9 0%, #357ABD 100%);

/* Hover / Pressed */
background: linear-gradient(90deg, #357ABD 0%, #2563EB 100%);

/* Disabled */
background: linear-gradient(90deg, #4A90D9 0%, #357ABD 100%);
opacity: 0.5;
```

---

## 7. Animation & Transition Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `transition-fast` | 150ms ease-in-out | Button hover/press, icon rotation |
| `transition-normal` | 300ms ease-in-out | Progress bar fill, accordion expand, page fade |
| `transition-slow` | 500ms ease-in-out | Score bar animation on result load |
| `transition-spring` | 300ms cubic-bezier(0.34, 1.56, 0.64, 1) | Radio selection bounce |

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## 8. Tailwind Config Extension

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#4A90D9',
          600: '#357ABD',
          700: '#1D4ED8',
          800: '#1E3A5F',
          900: '#1E3A8A',
        },
        // Domain colors for survey results
        domain: {
          physical: '#4A90D9',
          psychological: '#8B5CF6',
          urogenital: '#EC4899',
        },
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'nav': '0 -2px 10px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-header': 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)',
        'gradient-button': 'linear-gradient(90deg, #4A90D9 0%, #357ABD 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 9. Responsive Breakpoints

This is a mobile-first app. The primary design target is 375px width (iPhone SE/8).

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile (default) | 0-639px | Primary design target. All styles are mobile-first. |
| Tablet (sm) | 640px+ | max-w-md centered container only. No layout changes. |
| Desktop (md) | 768px+ | Same as tablet. App stays within max-w-md (448px). |

The `MobileLayout` wrapper ensures the app never exceeds `max-w-md` (448px) on larger screens, centered with `mx-auto` and a subtle gray-50 background outside the app boundary.

---

## 10. Icon Specifications

| Icon | Size | Context |
|------|------|---------|
| Bottom nav icons | 24x24px | Survey, Chat, FAQ, Profile tabs |
| Back arrow (header) | 24x24px | Header navigation |
| Chevron (FAQ) | 20x20px | Accordion expand/collapse |
| Send button arrow | 20x20px | Chat input send |
| Radio circle | 20x20px | Survey option selection |
| Close (modal) | 24x24px | Modal dismiss |
| Error/warning | 24x24px | Error states |

Recommended icon library: `lucide-react` (tree-shakeable, consistent stroke width).
