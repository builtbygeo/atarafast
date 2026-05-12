# Coding Conventions

**Analysis Date:** 2026-05-12

## Naming Patterns

**Files:**
- **Components:** kebab-case (e.g., `timer-view.tsx`, `checkout-button.tsx`, `premium-gate.tsx`)
  - Exception: `MetabolicJourneyChart.tsx` uses PascalCase
- **Library modules:** camelCase (e.g., `storage.ts`, `presets.ts`, `fasting-phases.ts`)
- **Hooks:** `use-` prefix in kebab-case (e.g., `use-toast.ts`, `use-mobile.ts`, `use-notifications.ts`)
- **Types directory:** flat file with descriptive name (`types/blog.ts`)
- **API routes:** `app/api/{domain}/{endpoint}/route.ts`

**Functions:**
- camelCase (e.g., `getActiveFast`, `startFast`, `handleEndFast`, `calculateStreaks`)
- Event handlers prefixed with `handle` (e.g., `handleStartFast`, `handleEndFast`, `handleSelectPreset`)
- Callback props prefixed with `on` (e.g., `onFastEnd`, `onNavigateToHistory`, `onClose`)
- Getter functions prefixed with `get` (e.g., `getSettings`, `getHistory`, `getPresetById`)
- Setter/update functions prefixed with `set`, `update`, or `save` (e.g., `updateSettings`, `saveData`, `setLang`)
- Boolean-returning functions prefixed with `is` or `has` (e.g., `isPremium`)

**Variables:**
- camelCase (e.g., `activeFast`, `isPremium`, `now`, `elapsedMs`)
- Boolean state variables prefixed with `is`/`has`/`show` (e.g., `isPremium`, `hasHiddenRecords`, `showDeleteConfirm`, `mounted`)
- Module-level constants: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`, `DEFAULT_SETTINGS`, `TRIAL_DAYS`, `MOBILE_BREAKPOINT`)
- Config arrays: UPPER_SNAKE_CASE (e.g., `FASTING_PRESETS`, `PROGRAMS`, `CUSTOM_PRESET`)

**Types:**
- Interfaces: PascalCase (e.g., `FastingRecord`, `AppSettings`, `FastingPreset`, `WeightPoint`)
- Type aliases: PascalCase (e.g., `Language`, `Plan`, `SubscriptionStatus`)
- Union types: lowercase string literals (e.g., `"up" | "down"`, `"free" | "premium"`, `"bg" | "en"`)
- Generic type parameters: descriptive (e.g., `Record<string, number>`, not `T`)
- Discriminated unions via string literals in interfaces (e.g., `type: "consecutive" | "single"`)

## Code Style

**Formatting:**
- **No ESLint config file found.** The `package.json` has a `lint` script (`eslint .`) but no `.eslintrc*` or `eslint.config.*` exists.
- **No Prettier config file found.** Formatting appears to be manual/in-editor.
- **Indentation:** 2-space (consistent across codebase)
- **Quotes:** Single quotes preferred for strings (observed in imports, object keys, JSX strings)
- **Semicolons:** Inconsistently used. Files like `lib/quota.ts` and `lib/storage.ts` use them; `lib/features.ts` and `lib/fasting-phases.ts` do not. No enforcement.

**Linting:**
- `eslint` listed in package.json scripts but no config file detected — linting is effectively unenforced.
- `// eslint-disable-next-line react-hooks/exhaustive-deps` used occasionally (e.g., `components/timer-view.tsx:131`).

**TypeScript:**
- Strict mode enabled (`tsconfig.json`: `"strict": true`)
- Build errors ignored (`next.config.mjs`: `ignoreBuildErrors: true`) — type errors do not block deployment.
- `!` non-null assertions used on env vars (`process.env.STRIPE_SECRET_KEY!`)
- `as` type assertions used (e.g., `as Language`, `as Plan`, `as SubscriptionStatus`)
- `any` occasionally used in catch blocks (e.g., `catch (err: any)`)

## Import Organization

**Order (observed convention):**
1. React/core imports (`import * as React from 'react'`)
2. Third-party libraries (`next`, `framer-motion`, `lucide-react`, `date-fns`)
3. Internal `@/` aliased imports (components, hooks, lib)
4. Type-only imports using `type` keyword (e.g., `import type { FastingRecord } from '@/lib/storage'`)

**Path Aliases:**
- `@/*` maps to `./*` (project root)
- Used universally: `@/components/*`, `@/lib/*`, `@/hooks/*`
- Relative imports used for cross-lib imports where aliases work (e.g., `from "./storage"`, `from "./presets"`)

**Example (from `components/timer-view.tsx`):**
```typescript
"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircularProgress } from "@/components/circular-progress"
import { getActiveFast, startFast, endFast, type FastingRecord } from "@/lib/storage"
import { getPresetById, type FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { format, addHours, differenceInCalendarDays } from "date-fns"
```

## Error Handling

**Patterns:**

1. **API Routes (try/catch with JSON response):**
```typescript
// app/api/ai/analyze/route.ts
export async function POST(req: Request) {
    try {
        // ... logic ...
        return NextResponse.json({ analysis: data.choices[0].message.content })
    } catch (err: any) {
        console.error("AI Analysis error:", err);
        return NextResponse.json({ error: 'Failed to analyze', details: err.message }, { status: 500 })
    }
}
```

2. **Storage functions (try/catch with silent fallback):**
```typescript
// lib/storage.ts
function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    // ...
    return { ...DEFAULT_DATA, ...parsed, ... }
  } catch {
    return DEFAULT_DATA  // silent fallback
  }
}
```

3. **Webhook verification (try/catch with 400 response):**
```typescript
// app/api/stripe/webhook/route.ts
try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
} catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
}
```

4. **Subscription hook (try/catch in useEffect):**
```typescript
// lib/subscription.ts
useEffect(() => {
    try {
        setDevForcePremium(!!getSettings().devForcePremium)
    } catch (e) {
        console.error("Failed to load dev settings", e)
    }
}, [])
```

5. **Null/undefined guards:** Functions return `null` for not-found (e.g., `getActiveFast(): FastingRecord | null`) and callers check before use.

6. **SSR safety:** `typeof window === "undefined"` checks for client-only code (e.g., `localStorage` access).

## Logging

**Framework:** `console` only — no logging library.

**Patterns:**
- `console.error(...)` for errors in catch blocks
- `console.log(...)` used freely for debugging — even in production code paths (e.g., `lib/quota.ts:22`, `lib/stats.ts:45`)
- No structured logging, log levels, or log aggregation

## Comments

**When to Comment:**
- JSDoc for public API functions (e.g., `lib/programs.ts:34-37`, `lib/stats.ts:14-17`)
- Inline comments for non-obvious logic (e.g., `lib/quota.ts:24 "let's allow 1 per day instead of 1 per month"`)
- Commented-out code sections exist (e.g., `lib/translations.ts:44-52` — the apath feature)
- `// eslint-disable-next-line` used where lint rules conflict

**JSDoc/TSDoc:**
```typescript
// lib/stats.ts
/**
 * Transforms fasting records into weight trend points.
 * Filters out records without weight data and ensures unique dates (latest entry per day).
 */
export function transformWeightData(history: FastingRecord[]): WeightPoint[] {
```

## Function Design

**Size:** Components can be large — `timer-view.tsx` is 553 lines with nested render functions (`renderTimerContent()`, `renderPresetsContent()`, `renderDetailContent()`).

**Parameters:** Destructured props object in React components (e.g., `{ history, onFastEnd, onNavigateToHistory }: TimerViewProps`).

**Return Values:**
- Functions return explicit types (no reliance on inference for public APIs)
- `null` used for "not found" / "nothing to return"
- `void` for side-effect-only functions
- `boolean` for validation functions (e.g., `importData(jsonString: string): boolean`)

**React Hooks:**
- `useCallback` for callback props and functions passed to effects
- `useMemo` for derived data (e.g., `displayHistory`, `hasHiddenRecords`)
- `useRef` for mutable values that shouldn't trigger re-renders
- `useEffect` for side effects and initialization

## Module Design

**Exports:**
- Named exports preferred (only `export default` used for Next.js page components and `next.config.mjs`)
- Co-located type exports alongside functions (same file)
- Types imported with `type` keyword to avoid runtime imports

**Barrel Files:** Not used. Each module imports directly from its source file.

**Module Boundaries:**
- `lib/` — pure logic, data transformation, storage, domain types. No React.
- `hooks/` — React hooks, client-side state
- `components/` — React components (both shadcn/ui wrappers in `ui/` and app-level components at top level)
- `components/landing/` — landing page sections
- `app/` — Next.js pages and API routes
- `types/` — shared TypeScript interfaces

## Component Patterns

**shadcn/ui Pattern** (from `components/ui/button.tsx`, `dialog.tsx`, etc.):
```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center ...",
  { variants: { variant: { default: '...', destructive: '...' } } }
)

function Button({ className, variant, size, asChild = false, ...props }: ...) {
  const Comp = asChild ? Slot : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
```

**Client Component Pattern:**
```typescript
"use client"  // or 'use client' — both used

import { useState, useEffect } from "react"
// ...

export function MyComponent({ prop }: Props) {
  // state, effects, handlers...
  return (<div>...</div>)
}
```

**Animation Pattern:**
```typescript
import { motion, AnimatePresence } from "framer-motion"

<AnimatePresence initial={false} custom={direction} mode="wait">
  <motion.div
    key={viewState}
    initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {/* content */}
  </motion.div>
</AnimatePresence>
```

## Tailwind / Styling Conventions

- Tailwind CSS v4 with `@import 'tailwindcss'` in `app/globals.css`
- Dark mode as default (`.dark` selector)
- CSS custom properties for theming (OKLCH color space)
- `cn()` utility from `@/lib/utils` for class merging
- Inline styles used selectively alongside Tailwind (e.g., for dynamic color values)
- Border radius: `rounded-[2rem]`, `rounded-[1.25rem]` — large, custom radii
- Typography: heavy use of `font-black`, `tracking-widest`, `tracking-[0.2em]`, `uppercase`

---

*Convention analysis: 2026-05-12*
