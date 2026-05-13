# Project Research Summary

**Project:** Atara — Mobile-first intermittent fasting tracker PWA
**Domain:** UI reorganization (3-tab bottom navigation redesign)
**Researched:** 2026-05-13
**Confidence:** HIGH

## Executive Summary

Atara is a React/Next.js SPA that needs to consolidate its 4-tab bottom navigation (Log | Info | Today | Plan) into a cleaner 3-tab structure (Today | Log | Progress). This is a **pure reorganization** — no new features, no backend changes, no new dependencies. All four parallel researchers converged on the same core findings: the existing stack (Next.js 16 + React 19 + Tailwind CSS 4 + framer-motion) has everything needed, the 3-tab structure is a defensible differentiator against 4-tab competitors (Zero, Fastic, BodyFast), and the primary architectural challenge is preserving component state across tab switches.

The single most important architectural decision is **CSS visibility toggling over conditional rendering**. The current `{activeTab === "x" && <View />}` pattern unmounts components on every tab switch, destroying timer state, AI analysis results, scroll positions, and program selections. All three technical research streams (STACK, ARCHITECTURE, PITFALLS) independently arrived at the same solution: mount all three views simultaneously and toggle visibility with CSS. This costs negligible memory, prevents state loss, and enables smooth animations without the complexity of state-hoisting refactors.

The highest-risk challenge is the **timer preservation during tab switches** — the running fast timer uses `setInterval` that dies on unmount. If not handled, users will see a frozen timer after switching to Log and back. The solution (CSS `hidden`/`visible` toggling) is simple but must be implemented correctly. The second-highest risk is the **premium gate banner bug** — a confirmed existing issue where `ENABLE_PREMIUM=false` still shows a broken "Upgrade" button. The content reorganization is the right moment to fix this at the data level (bypass the 30-day filter), the UI level (guard banner visibility), and the action level (guard the Stripe checkout call).

## Key Findings

### Recommended Stack (STACK.md — HIGH confidence)

**No new dependencies required.** The project already has every technology needed. The redesign is about better use of what's installed.

| Technology | Purpose | Why Recommended |
|------------|---------|-----------------|
| React `useState` + CSS toggling | Tab switching | Preserves component state; `AnimatePresence` would unmount views, killing the timer |
| `framer-motion` 12.34.4 | Layout animations for tab indicator dot | `layoutId` shared-element animation for the active tab indicator — premium feel, zero perf cost |
| `tw-animate-css` 1.3.3 | CSS-only entrance animations | Spin/pulse for badges and indicators; declarative, no JS bundle cost |
| Tailwind CSS 4.2.1 | Styling | CSS-first config for nav bar design tokens; consistent with existing codebase |
| `lucide-react` ^0.564.0 | Tab icons | `Timer`, `History`, `BarChart3` — all already imported in page.tsx |

**Critical anti-patterns rejected:**
- **No URL routing for tabs** — would cause full page remounts and kill animation potential
- **No `@radix-ui/react-tabs` for bottom nav** — designed for inline content tabs, not app-level navigation
- **No slide transitions without gesture support** — crossfade with 4px vertical shift is the correct pattern
- **No hide-on-scroll for tab bar** — persistent navigation is required for a utility app

### Expected Features (FEATURES.md — HIGH confidence)

**Must have (table stakes):**
- **Fasting Timer as Today tab** — primary action, center-stage. Every competitor opens to the timer
- **Fasting History as Log tab** — chronological fast records. Universal expectation across all competitors
- **Progress tab** — streaks, stats, challenges, AI coach, and education merged into one coherent destination
- **Settings accessible from nav** — gear icon in Progress header (not consuming a tab slot)
- **Streak tracking** — the single most motivating feature per competitor user reviews

**Differentiators:**
- **3-tab over 4-tab navigation** — fewer tabs = less cognitive load. Simple (historical) proved this works. Zero/Fastic/BodyFast all use 4 tabs
- **Contextual education in Progress** — not a siloed "Learn" tab (low engagement) but content alongside user's data
- **Minimal timer screen** — timer + active programs only. No nutrition tracking, water logging, or upsells

**Defer (v2+):**
- Nutrition/water tracking (out of scope — competitors adding it, but Atara deliberately chooses minimalism)
- Social features (fasting buddies, sharing)
- Wearable integrations (Oura sync, step counter)

### Architecture Approach (ARCHITECTURE.md — HIGH confidence)

This is a section-level composition across existing files — 6 files touched, **zero new files**, zero backend changes.

**Component-level content moves:**

| Content Block | From | To | How |
|---------------|------|----|-----|
| Active Programs grid | `stats-view.tsx` (Info tab) | `timer-view.tsx` (Today tab) | Rendered as section inside TimerView's scroll container |
| Educational cards + details | `plan-view.tsx` (Plan tab) | `stats-view.tsx` (Progress tab) | Extracted as exported sub-components, imported into StatsView |
| Timer view | Already in Today | Stays in Today | Keep mounted always (CSS toggle), not conditional render |
| History view | Already in Log | Stays in Log | No structural changes needed |
| `plan-view.tsx` | Active (Plan tab) | Mostly unused | Content extracted; file kept for potential future use |

**State management: PRESERVE THE EXISTING PATTERN.** History state stays lifted to Dashboard (`page.tsx`), local state stays in each view, direct `localStorage` reads remain for self-sufficient components (ProgramsGrid, TimerView). No Context providers, no state libraries, no prop threading across view boundaries.

**Build order (4 waves):**
1. **Tab wiring** — rename Tab types, update icons/labels, rewire conditional blocks
2. **Content moves** — ProgramsGrid → timer-view.tsx, education → stats-view.tsx
3. **Timer preservation fix** — CSS visibility toggling so interval continues across tab switches
4. **Cleanup** — remove dead code, verify settings access

### Critical Pitfalls (PITFALLS.md — HIGH confidence)

**Top 5 pitfalls ranked by severity:**

1. **Tab remounting destroys state** (CRITICAL) — Conditional rendering unmounts views, killing timer intervals, AI analysis, scroll positions, and program selections. **Fix:** Render all three views simultaneously, toggle visibility with CSS. Lazy-mount heavy views on first visit.

2. **Premium gate banner shows on free tier** (CRITICAL, confirmed existing bug) — When `ENABLE_PREMIUM=false`, the 30-day history limit still applies and a broken "Upgrade" button appears. **Fix:** Add `ENABLE_PREMIUM` guard at three levels: data (bypass 30-day filter), UI (hide banner), action (guard Stripe checkout).

3. **Translation key drift during tab renames** (HIGH) — Renaming "Timer"→"Today", "Info"→"Progress" across a 780-line monolithic translations file with `any` casts and disabled type checking. **Fix:** Rename keys semantically, add all new keys to both `en` and `bg` simultaneously, use `satisfies` type constraint, test in both languages after every rename.

4. **Scroll containers break after content moves** (HIGH) — Each view has its own scroll pattern (`overflow-y-auto`, `pb-44`, `absolute inset-0`). Moving content between them can cause cutoff content, double scrollbars, or incorrect safe-area padding. **Fix:** Audit all scroll containers before moving content; verify on real mobile viewports.

5. **Today tab becomes overloaded** (MODERATE) — Moving ProgramsGrid to Today alongside the existing timer UI risks recreating the "overloaded Info tab" problem. **Fix:** Conditional rendering — show ProgramsGrid only when not actively fasting; collapse to a minimal indicator during active fasts.

## Implications for Roadmap

Based on combined research, this can be executed as a single well-scoped phase (the navigation reorganization IS a discrete unit of work) with clear internal waves. The research is thorough enough that no pre-implementation spike phases are needed.

### Suggested Phase Structure

### Phase 1: 3-Tab Navigation Restructure

**Rationale:** All four research streams confirm this is a bounded, low-risk reorganization — the codebase already has the right architecture patterns, the correct dependencies are installed, and the content mapping is clear. The premium gate bug fix and timer preservation fix are naturally coupled with the restructure (touching the same files). Deferring either would create tech debt that's harder to fix after content moves.

**What it delivers:**
- 3-tab bottom navigation: Today | Log | Progress
- Content properly organized per user mental model (Timer+Programs, History, Stats+Challenges+Education)
- Timer runs continuously across tab switches (no state loss)
- Premium gate hidden when `ENABLE_PREMIUM=false` (full history available, no broken banner)
- Translation keys updated for both English and Bulgarian
- Tab state persisted to localStorage (correct PWA cold-start behavior)

**Implements features from FEATURES.md:**
- Timer as Today tab (table stakes)
- History as Log tab (table stakes)
- Progress as merged Stats+Challenges+AI+Education (differentiator)
- Settings via gear icon in Progress header
- 3-tab minimalism (differentiator)

**Uses stack elements from STACK.md:**
- CSS visibility toggling for all three views (no new deps)
- framer-motion `layoutId` for tab indicator dot animation
- Tailwind CSS 4 for tab bar design tokens (backdrop blur, safe-area padding, shadow)
- localStorage persistence for active tab state

**Avoids pitfalls from PITFALLS.md:**
- **Pitfall 1**: CSS visibility toggling prevents state loss (not conditional rendering)
- **Pitfall 2**: ENABLE_PREMIUM guard at data/UI/action levels prevents banner bug
- **Pitfall 3**: Translation key semantic renaming + dual-language testing
- **Pitfall 4**: Scroll container audit before content moves
- **Pitfall 5**: Single `filteredHistory` prop, remove duplicate useMemo
- **Pitfall 6**: Language toggle kept visible on every tab (add to header or persistent bar)
- **Pitfall 7**: ProgramsGrid conditional rendering — collapsed during active fast
- **Pitfall 9**: localStorage persistence for activeTab

**Internal wave structure:**
1. Tab wiring (page.tsx: Tab type, icons, labels, localStorage persistence)
2. Content moves (ProgramsGrid → timer-view, education → stats-view)
3. Timer preservation (CSS visibility toggling, keep mounted when active fast exists)
4. Premium gate fix (ENABLE_PREMIUM guards)
5. Translation updates (rename keys, add new keys, dual-language test)
6. Cleanup (dead code removal, console.log stripping, data-testid attributes)

### Phase Ordering Rationale

- **No multi-phase structure needed.** The content moves and critical fixes are tightly coupled — touching the same files in the same areas. Splitting into separate phases would create merge conflicts and require temporary code that must be rewritten. This is a classic "do it once, do it right" situation.

- **The premium gate fix MUST ship with the restructure.** The banner is inside the history view being reorganized. Fixing it after content moves means touching the same file twice.

- **Timer preservation MUST ship with the restructure.** The current code already has this bug (timer unmounts on tab switch). The 3-tab redesign changes which tab the timer lives on. Fixing after the restructure means shipping a known regression.

- **Post-restructure follow-up (future phase):** Fix broken E2E test, add smoke tests for tab navigation, strip remaining `console.log` calls, consider lightweight program cards for Today tab.

### Research Flags

**Phases needing deeper research during planning:**
- **None for the current milestone.** All four research streams have HIGH confidence. The codebase has been inspected, the competitors have been analyzed, the architecture patterns are well-documented, and the pitfalls are identified with specific prevention strategies. This is ready for immediate planning and execution.

**Standard patterns (no additional research needed):**
- Tab bar CSS: Apple HIG + Material Design 3 both documented. Stack research provides concrete Tailwind classes.
- framer-motion AnimatePresence: Official docs provide the exact pattern (used for tab indicator dot only).
- React state preservation: Official React docs + community patterns confirm CSS visibility approach.
- PWA localStorage persistence: Already the app's architecture pattern; extending to tab state is trivial.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies already installed and verified against `package.json`. Codebase inspection confirms framer-motion imports, Tailwind config, lucide-react usage. No unknowns. |
| Features | HIGH | Competitor analysis from live App Store listings (2026-05-13). Atara source code verified against PROJECT.md decisions. 3-tab structure validated against market positioning. |
| Architecture | HIGH | Live codebase analysis of all 6 affected files. React patterns (lift state up, conditional rendering, useEffect) documented in official React docs. Component boundaries and data flow verified. |
| Pitfalls | HIGH | All 11 pitfalls verified via direct code inspection. Pitfall #2 (premium gate bug) confirmed existing in PROJECT.md. Scroll patterns, state management, translation structure, and premium gate logic all traced through actual code paths. |

**Overall confidence: HIGH**

### Gaps to Address

- **ProgramsGrid visual design for Today tab**: The research flags Today overload as a risk (Pitfall #7) and recommends conditional rendering during active fasts. The exact visual design (collapsed state, expand animation, "active program only" variant) should be refined during UI specification — not research. This is a design decision, not a research gap.

- **Settings/language toggle discoverability**: Pitfall #6 notes that moving settings access to Progress tab buries it from other tabs. The recommendation is a persistent header or language toggle on every tab. The exact placement should be resolved during UI specification. Low risk, but needs a decision.

- **E2E test state**: The single E2E test (`quota.spec.ts`) is already broken (per CONCERNS.md) and will be more broken after tab reorganization. Fixing it is out of scope for this milestone — documented as a known gap that should be addressed in a dedicated testing phase.

## Sources

### Primary (HIGH confidence)
- **Atara source code** — `app/app/page.tsx`, `components/timer-view.tsx`, `components/history-view.tsx`, `components/stats-view.tsx`, `components/plan-view.tsx`, `components/programs-grid.tsx`, `components/premium-gate.tsx`, `lib/translations.ts`, `lib/subscription.ts`, `lib/storage.ts`, `lib/features.ts`, `package.json` — verified current architecture, tab structure, state management, premium gate logic, translation keys
- **framer-motion official docs** (Context7 /grx7/framer-motion) — AnimatePresence mode="wait", layoutId shared-element animations, exit animation patterns
- **React official docs** — Preserving and Resetting State, Sharing State Between Components, You Might Not Need an Effect — confirmed conditional rendering behavior and state preservation patterns
- **WCAG 2.1 SC 2.5.5 Target Size** — 44×44px minimum touch target requirement
- **Apple HIG Tab Bars** — bottom navigation design guidelines, persistent navigation recommendations

### Secondary (MEDIUM confidence)
- **Zero, Fastic, BodyFast App Store listings** (fetched 2026-05-13) — feature lists, version histories, user review themes. Navigation patterns reconstructed from feature groupings (App Store listings don't explicitly describe tab structure)
- **Material Design 3 Navigation Bar** — bottom bar visibility, persistence, and tap target guidelines
- **NNGroup mobile navigation research** — tab bar visibility and discoverability principles
- **Josh Comeau blog** — Common Beginner Mistakes with React (state mutation, keys, effects)

### Tertiary (LOW confidence)
- **Simple fasting app** — 3-tab structure reference. Training data only; App Store URL not found (may be delisted/rebranded). Included as historical context.

---

*Research completed: 2026-05-13*
*Ready for roadmap: YES*
*Next step: Requirements definition (orchestrator → requirements agent)*
