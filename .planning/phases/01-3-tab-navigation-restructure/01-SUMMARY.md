---
phase: 01-3-tab-navigation-restructure
plan: all
subsystem: ui
tags: [nextjs, react, tailwind-css, framer-motion, lucide-react, shadcn-ui]

# Dependency graph
requires: []
provides:
  - 3-tab bottom navigation (Today | Log | Progress) with CSS visibility toggling
  - localStorage tab persistence across page reloads
  - ProgramsGrid relocated from StatsView to TimerView (Today tab)
  - ENABLE_PREMIUM data guards on displayHistory and hasHiddenRecords in page.tsx, stats-view.tsx, and history-view.tsx
  - Visual tab bar polish: framer-motion layoutId indicator dot, semibold labels, focus-visible rings, aria-current
  - PlanView tab removed from dashboard (file preserved for future use)
affects: [future premium features, future tab content additions]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS visibility toggling: all 3 views mounted simultaneously with opacity-100/z-10 (active) vs opacity-0/z-0/pointer-events-none (inactive)
    - ENABLE_PREMIUM compile-time guard: `if (!ENABLE_PREMIUM) return history/false` as first line before isPremium checks
    - localStorage state initialization: `useState(() => { ... })` pattern for SSR-safe initializer
    - framer-motion layoutId: shared element animation for tab indicator dot with prefersReducedMotion fallback

key-files:
  created: []
  modified:
    - app/app/page.tsx
    - components/timer-view.tsx
    - components/stats-view.tsx
    - components/history-view.tsx

key-decisions:
  - "Tab type: \"today\" | \"log\" | \"progress\" — action→record→reflect flow"
  - "All three views permanently mounted via CSS visibility toggling — preserves timer state, scroll positions, AI analysis"
  - "ENABLE_PREMIUM guard at both data level (skip 30-day filter) and UI level (hide banner) — code preserved, not deleted"
  - "ProgramsGrid in Today tab: visible in both timer and presets sub-views, hidden in detail view"
  - "Tab indicator: 4px framer-motion layoutId dot instead of pill background — accessible (shape+position cues), minimal aesthetic"
  - "Tab labels: font-semibold tracking-wide at 11px instead of font-black uppercase tracking-widest at 9px — more readable, elegant feel"

patterns-established:
  - "CSS visibility toggling: all views occupy absolute inset-0; only active view gets opacity-100 z-10"
  - "ENABLE_PREMIUM guard: early-return at top of useMemo before any isPremium check"
  - "localStorage SSR safety: useState initializer checks typeof window === \"undefined\""

requirements-completed: [NAV-01, NAV-02, CONT-01, FIX-01]

# Metrics
duration: 25min
completed: 2026-05-13
---

# Phase 1: 3-Tab Navigation Restructure Summary

**3-tab bottom navigation restructured from 4 tabs, with CSS visibility toggling for state preservation, ProgramsGrid relocated to Today, and all premium UI gated behind ENABLE_PREMIUM compile-time flag**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-05-13T13:43:11Z
- **Completed:** 2026-05-13T14:08:00Z
- **Tasks:** 4 (across 3 plans)
- **Files modified:** 4

## Accomplishments

- Dashboard shell rewritten from 4-tab conditional rendering to 3-tab CSS visibility-toggled layout — all three views (TimerView, HistoryView, StatsView) permanently mounted
- Tab type: `"today" | "log" | "progress"` with localStorage persistence via key `"atara-active-tab"`, defaulting to `"today"`
- ProgramsGrid relocated from StatsView to TimerView — renders in both timer and presets sub-views, hidden in detail view
- ENABLE_PREMIUM data guards added: `displayHistory` returns full history when premium disabled, `hasHiddenRecords` returns false — no 30-day limit, no premium nags
- Premium banner in HistoryView gated behind `ENABLE_PREMIUM && hasHiddenRecords` — code preserved, banner hidden when premium disabled
- Tab bar visual polish: framer-motion `layoutId` indicator dot, semibold 11px labels with tracking-wide, focus-visible rings, `aria-current`, `prefersReducedMotion` hook

## Task Commits

Each task was committed atomically:

1. **Plan 01-01: Dashboard shell restructure** — `b85a26e` (feat)
   - Tab type, tabs array, localStorage persistence, ENABLE_PREMIUM guards, CSS visibility toggling, tab bar visual polish
2. **Plan 01-02 Task 1: ProgramsGrid in TimerView** — `10a0cdc` (feat)
   - Import and render ProgramsGrid in timer and presets sub-views
3. **Plan 01-02 Task 2: Remove ProgramsGrid from StatsView** — `7da0906` (feat)
   - Remove ProgramsGrid import/render, add ENABLE_PREMIUM guard to displayHistory
4. **Plan 01-03: Premium UI gate in HistoryView** — `91c134a` (feat)
   - Gate premium banner behind `ENABLE_PREMIUM && hasHiddenRecords`

## Files Modified

- `app/app/page.tsx` — Complete dashboard shell restructure: 3-tab type system, tabs config array, localStorage persistence, ENABLE_PREMIUM data guards, CSS visibility toggling for 3 views, tab bar visual polish with framer-motion dot indicator, prefersReducedMotion hook, import cleanup (removed PlanView, BookOpen, Info)
- `components/timer-view.tsx` — Added ProgramsGrid import and render in both `renderTimerContent()` (active fast view) and `renderPresetsContent()` (preset selection view); existing minimal active program card preserved
- `components/stats-view.tsx` — Removed ProgramsGrid import and render block; added `ENABLE_PREMIUM` import and guard to `displayHistory` useMemo; all other stats content intact
- `components/history-view.tsx` — Added `ENABLE_PREMIUM` import; premium banner condition changed from `{hasHiddenRecords &&` to `{ENABLE_PREMIUM && hasHiddenRecords &&`; all non-premium features preserved

## Decisions Made

- Consolidated Plan 01-01's two TDD tasks into a single atomic commit — both tasks modify the same file and Task 1 alone would leave broken tab references in the content area
- Tab bar dot indicator (4px) instead of pill background — follows UI-SPEC accessibility guidance (shape+position cues work for colorblind users)
- Tab label weight downgraded from `font-black uppercase` to `font-semibold` — more elegant feel for a wellness app per UI-SPEC
- ProgramsGrid not rendered in preset detail view — would clutter the focused preset detail screen

## Deviations from Plan

None — all three plans executed as written with verification passing on each task.

## Issues Encountered

None — all changes applied cleanly. Pre-existing TypeScript error in `tests/e2e/quota.spec.ts` is unrelated to this phase.

## User Setup Required

None — no external service configuration required. All changes are client-side component reorganization with existing dependencies.

## Next Phase Readiness

- All tab infrastructure in place — `Tab` type `"today" | "log" | "progress"` is the canonical type for all future tab references
- `ENABLE_PREMIUM` guard pattern established — consistent across page.tsx, stats-view.tsx, and history-view.tsx
- ProgramsGrid correctly positioned in Today tab — ready for future content additions
- CSS visibility toggling pattern established for content area — preserves component state across tab switches
- Premium gate code preserved behind ENABLE_PREMIUM — ready for future premium feature launch

---
*Phase: 01-3-tab-navigation-restructure*
*Completed: 2026-05-13*
