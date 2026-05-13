# Phase 1: 3-Tab Navigation Restructure - Context

**Gathered:** 2026-05-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Restructure the bottom navigation from 4 tabs (Log | Info | Today | Plan) to 3 tabs (Today | Log | Progress). Move Active Programs to Today tab alongside the timer. Hide the 30-day history limit and "Unlock full history" banner behind the `ENABLE_PREMIUM` flag. Apply visual polish to the tab bar. No new functionality — pure reorganization and visual refinement using the existing stack (Next.js 16, React 19, Tailwind CSS 4, framer-motion, lucide-react).

Files touched: `app/app/page.tsx`, `components/timer-view.tsx`, `components/stats-view.tsx`, `components/plan-view.tsx`, `components/history-view.tsx`, `lib/translations.ts`, `components/programs-grid.tsx` (import only).
</domain>

<decisions>
## Implementation Decisions

### Tab Layout & Visual Style
- Tab order: Today — Log — Progress (action → record → reflect flow)
- Active indicator: pill highlight (rounded-full bg behind active tab label/icon) with smooth spring animation via framer-motion layoutId
- Glass effect: keep current bg-background/95 backdrop-blur-xl, adjusted for 3 equal segments
- Typography: keep existing style, refine spacing for 3-tab layout

### Today Tab Content
- ProgramsGrid placement: below timer circle, scrollable section — timer first (primary action), programs second (context)
- During active fast: always show ProgramsGrid (even during active fast, user sees active program progress)
- Programs card density: keep full 6-card grid, no layout change — just import into TimerView

### Premium Gate Fix
- Guard at both levels: data filter (skip 30-day cutoff when `ENABLE_PREMIUM=false`) AND UI (render upgrade banner only when premium enabled)
- Upgrade button: wrapped in `ENABLE_PREMIUM` check — invisible when premium disabled, code preserved for future
- Translations: keep all keys in translations.ts — just guard UI rendering behind flag

### Deferred to v2
- Tab transition animation (opacity crossfade 150ms)
- Timer state preservation via CSS visibility (still conditional render for now — research flag noted)
- Educational content → Progress tab
- Settings gear in Progress tab header
- Language toggle on all tabs
- Scroll container audit

### the agent's Discretion
- Exact spacing values for 3-tab layout
- Pill indicator sizing and color
- Any minor styling refinements that improve visual consistency
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/app/page.tsx` — Dashboard component: tab state (`activeTab`), displayHistory filter, tab rendering
- `components/timer-view.tsx` — Timer UI with week strip, preset selector, timer circle
- `components/stats-view.tsx` — Stats (streak, weight, charts, AI coach, challenges, currently renders ProgramsGrid)
- `components/programs-grid.tsx` — ProgramsGrid component (6 program cards)
- `components/plan-view.tsx` — Plan view with PresetGrid and educational cards
- `components/history-view.tsx` — History view with calendar, chart, fasts list, premium banner
- `lib/translations.ts` — Bilingual translations (780 lines)
- `lib/features.ts` — `ENABLE_PREMIUM` flag from env
- `components/preset-grid.tsx` — Preset grid (used by both timer and plan views)

### Established Patterns
- Bottom nav: fixed bottom-0, bg-background/95 backdrop-blur-xl, grid-cols-4 → grid-cols-3
- Tab icons: lucide-react (History, Info, Timer, BookOpen)
- State management: useState in Dashboard, props drilling to child views
- CSS: Tailwind CSS 4 utility classes, dark theme via .dark selector, OKLCH color space
- Component pattern: kebab-case file names, named exports, `cn()` for class merging

### Integration Points
- `page.tsx` tab state machine — current Tab type: `"timer" | "history" | "plan" | "stats"` → new: `"today" | "log" | "progress"`
- Timer component preserves its internal state (React setInterval) — conditional render unmounting is an existing concern
- ProgramsGrid currently rendered in stats-view.tsx:542 — needs import relocation
- Premium gate in page.tsx:86-96 (data filter) + history-view.tsx:232-249 (UI banner)
</code_context>

<specifics>
## Specific Ideas

- User explicitly confirmed: 3-tab restructure (Today | Log | Progress), ProgramsGrid → Today, premium gate behind ENABLE_PREMIUM
- User preference: elegant, minimalistic, modern, mobile-first — no clutter, get out of the way
- No new features, no new dependencies — pure reorganization + polish
- Premium code stays (ENABLE_PREMIUM guard, not deletion)
</specifics>

<deferred>
## Deferred Ideas

- Educational content (presets, tips, health info) → Progress tab (v2)
- Settings gear placement in Progress header (v2)
- Tab transition animations — opacity crossfade (v2)
- framer-motion layoutId tab indicator dot (v2)
- Timer state preservation via CSS visibility toggle (v2 — research flag)
- Language toggle on all tabs (v2)
- Scroll container audit after content moves (v2)
</deferred>
