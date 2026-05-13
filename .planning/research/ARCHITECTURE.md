# Architecture: 3-Tab Navigation Restructure

**Domain:** React component reorganization for tabbed fasting-tracker PWA
**Researched:** 2026-05-13
**Overall confidence:** HIGH (verified against live codebase + React official patterns)

## Executive Summary

The Atara app currently uses a 4-tab bottom navigation (Log | Info | Today | Plan) with content scattered across tabs in ways that don't match user mental models. The restructure to 3 tabs (Today | Log | Progress) is a pure reorganization — no new functionality, no backend changes, no route changes. The architecture challenge is about moving content blocks between component boundaries while preserving data flow, scroll behavior, and the existing `localStorage`-based state management.

The current architecture already follows React best practices: history state is lifted to the Dashboard page (`app/app/page.tsx`) and passed as props to child views. Each view independently reads `localStorage` for its own domain state (active fast, settings, programs). This architecture **should be preserved** because it works well and changing it would constitute new functionality.

The key restructuring pattern is **section-level composition within existing view components** — moving JSX blocks (not state ownership) between files. No new component files are required; the reorganization modifies 3 existing files and removes 1 that becomes unnecessary.

## Component Boundaries: The 3 Tabs

### Tab 1: Today (Timer + Active Programs)

**What moves here:**
- Timer view (currently `timer-view.tsx`, in Today tab — stays)
- Preset grid / week strip (already part of `timer-view.tsx` — stays)
- Active Programs grid (currently `programs-grid.tsx`, rendered inside `stats-view.tsx` line 542 — moves)

**Architecture:**
```
┌─ Today tab (page.tsx conditional block) ──────────────────────┐
│  <div className="flex-1 relative w-full">                     │
│    <TimerView history={displayHistory} onFastEnd={...} />     │
│    {/* ProgramsGrid is rendered as a section INSIDE           │
│        TimerView's scrollable area, after timer/progress */}  │
│  </div>                                                       │
└────────────────────────────────────────────────────────────────┘
```

**Data flow:**
- `TimerView` already imports `getActiveProgram` from `@/lib/storage` (line 33 of timer-view.tsx)
- `ProgramsGrid` independently reads `getActiveProgram()` and `getProgramBadges()` from localStorage
- Both components are self-sufficient — no prop threading needed between them
- History prop is already passed to TimerView (used for week status strip calculations)

**Decision:** ProgramsGrid should be rendered as a child element inside TimerView's scrollable container (not as a sibling in page.tsx). Rationale: TimerView already owns the scrollable `div` with `overflow-y-auto` and the bottom padding (`pb-44`). Placing ProgramsGrid as a sibling in page.tsx would require extracting the scroll container, which is a larger structural change than scope allows. This is the minimal-diff approach.

### Tab 2: Log (Fasting History)

**What moves here:**
- History view (currently `history-view.tsx`, in current Log tab — stays)
- 30-day limit logic already exists in page.tsx via `displayHistory` / `hasHiddenRecords`

**Architecture:**
```
┌─ Log tab (page.tsx conditional block) ────────────────────────┐
│  <div className="flex-1 relative w-full">                     │
│    <HistoryView                                               │
│      history={displayHistory}                                 │
│      hasHiddenRecords={hasHiddenRecords}                      │
│      onHistoryChange={refreshHistory}                         │
│    />                                                         │
│  </div>                                                       │
└────────────────────────────────────────────────────────────────┘
```

**No structural changes needed.** The history view already receives filtered data and works correctly. Premium gate hiding (`ENABLE_PREMIUM=false`) is handled via the existing `displayHistory`/`hasHiddenRecords` logic in page.tsx.

### Tab 3: Progress (Stats + Challenges + AI Coach + Education + Settings)

**What moves here:**
- Stats: streaks, weekly charts, completion rate (currently in `stats-view.tsx` — stays)
- Challenges & badges (currently in `stats-view.tsx` — stays)
- AI Coach card (currently in `stats-view.tsx` — stays)
- Active Programs grid (currently in `stats-view.tsx` — **removes**)
- Educational content cards + preset detail (currently in `plan-view.tsx` — **moves**)
- Settings gear icon (currently in `stats-view.tsx` header — stays)

**Architecture:**
```
┌─ Progress tab (page.tsx conditional block) ───────────────────┐
│  <div className="flex-1 relative w-full">                     │
│    <StatsView                                                 │
│      history={displayHistory}                                 │
│      settings={getSettings()}                                 │
│      onOpenSettings={...}                                     │
│      onOpenUpgrade={...}                                      │
│    />                                                         │
│    {/* Educational content section appended below stats */}   │
│  </div>                                                       │
└────────────────────────────────────────────────────────────────┘
```

**What changes inside `stats-view.tsx`:**
1. Remove `<ProgramsGrid />` from the JSX (line 542 — moves to Today/timer-view)
2. Add educational content section extracted from `plan-view.tsx` (the `educationalCards` loop + `planNote` footer, lines 63-113 of plan-view.tsx)
3. Keep everything else: streak circle, weight chart, weekly activity, weekly stats, AI coach, challenges grid

**What happens to `plan-view.tsx`:**
The file becomes dead code after content is moved. The preset detail view (lines 117-190) and card detail view (lines 192-231) are complex sub-views navigated from the educational cards. These should be preserved and accessible from the Progress tab — users should still be able to tap an educational card to read the full content. This means the `selectedCard` / `selectedPlan` detail views need to be moved into stats-view.tsx as well, or plan-view.tsx needs to be refactored into a reusable detail component.

**Simplest approach for minimal disruption:** Keep `plan-view.tsx` file but refactor it to export `EducationalSection` (cards list + note footer) and `EducationalCardDetail` (full-screen detail view). Import these into stats-view.tsx. The PresetGrid/PlanDetail parts of plan-view.tsx stay on the file but are unused (they can be cleaned up in a future phase).

## State Management Approach

### Current pattern (PRESERVE THIS)

The app uses a pragmatic mixed-state architecture that works well:

```
┌──────────────────────────────────────────────────────┐
│  page.tsx (Dashboard)                                │
│  ┌────────────────────────────────────────────────┐  │
│  │ useState<FastingRecord[]> history   ← lifted   │  │
│  │ useState<Tab> activeTab                        │  │
│  │ refreshHistory() callback                      │  │
│  └──────────────┬─────────────────────────────────┘  │
│                 │ props (history, callbacks)          │
│     ┌───────────┼───────────┬────────────────┐       │
│     ▼           ▼           ▼                ▼       │
│  TimerView  HistoryView  StatsView      PlanView     │
│  ┌───────┐  ┌─────────┐  ┌────────┐   ┌────────┐   │
│  │local  │  │(pure    │  │local   │   │local   │   │
│  │state: │  │ props)  │  │state:  │   │state:  │   │
│  │active │  │         │  │aiReport│   │selected│   │
│  │Fast   │  │         │  │        │   │Card    │   │
│  └───────┘  └─────────┘  └────────┘   └────────┘   │
└──────────────────────────────────────────────────────┘
```

### Why this pattern is correct for the restructure

1. **History state lifted to Dashboard** — This is the single source of truth. All views consume it as a prop. This follows React's "lift state up" pattern and must NOT change.

2. **Local state in each view** — Timer state (active fast, countdown), AI report display, scroll position, selected cards — all remain local to their view. These are view-specific and don't need coordination.

3. **Direct localStorage reads** — Components like ProgramsGrid and TimerView read `getActiveProgram()` / `getActiveFast()` directly from localStorage on mount. This is acceptable for localStorage-based apps and avoids prop-drilling across unrelated view boundaries.

### What does NOT need to change

- No new Context providers needed
- No new state management library
- No lifting of local view state (timer, AI report, selected cards)
- No changes to how `refreshHistory()` works

### Tab switching behavior

The current pattern uses conditional rendering:
```tsx
{activeTab === "timer" && <TimerView .../>}
{activeTab === "history" && <HistoryView .../>}
{activeTab === "stats" && <StatsView .../>}
```

This unmounts inactive tabs, which resets their local state. For this restructure:
- **Today tab (timer):** Must NOT lose timer state when switching tabs and back. The timer tracks elapsed time — unmounting would kill the interval. **Solution:** Do NOT unmount the timer during active fasts. Use CSS `display: none` for the timer container when an active fast exists, or keep the timer mounted but hidden.
- **Log tab (history):** No state to preserve — data recomputes from `history` prop on mount.
- **Progress tab (stats):** Scroll position lost on unmount. Acceptable for MVP reorganization. Future enhancement: preserve scroll position.

### Timer preservation during tab switches (CRITICAL)

The timer must continue running when the user switches to Log or Progress. Currently, `TimerView` uses `setInterval` for the countdown (timer-view.tsx line ~93-107). If the component unmounts, the interval stops and the timer appears frozen.

**Required approach:** Keep TimerView mounted (but visually hidden via CSS) when `activeTab !== "timer"` AND an active fast exists:

```tsx
{/* Timer always mounted when active fast exists */}
<div className={activeTab === "timer" ? "block" : "hidden"}>
  <TimerView .../>
</div>
```

Alternatively, use `visibility: hidden` with `position: absolute` to keep the timer mounted but invisible. The component's `useEffect` cleanup won't fire, so the interval continues.

**Verification check:** The existing code doesn't do this — it unmounts TimerView on tab switch. This bug exists in the current 4-tab app too. The restructure provides an opportunity to fix it, and failing to fix it would be a regression for the Today tab (users frequently switch between Today and Log).

## Component File Changes Summary

| File | Action | What Changes |
|------|--------|-------------|
| `app/app/page.tsx` | MODIFY | Update `Tab` type to `"today" \| "log" \| "progress"`; update tabs array with new icons/labels; add `hidden`/`visible` CSS for timer preservation; rewire conditional blocks |
| `components/timer-view.tsx` | MODIFY | Add `<ProgramsGrid />` as a section in scrollable area (after week strip, before the end of scroll container) |
| `components/stats-view.tsx` | MODIFY | Remove `<ProgramsGrid />` import and JSX; add educational cards section + note footer; keep settings gear in header |
| `components/plan-view.tsx` | MODIFY or DELETE | Extract educational cards + card detail into exported sub-components; import them into stats-view.tsx. File kept for preset grid (used by timer-view). |
| `components/history-view.tsx` | NO CHANGE | Works as-is |
| `components/programs-grid.tsx` | NO CHANGE | Simply re-imported into timer-view.tsx instead of stats-view.tsx |

**No new files needed.** Six existing files touched, two untouched.

## Build Order Implications

The restructure has a natural dependency chain:

### Wave 1: Bottom bar + Tab wiring (page.tsx)
- Update `Tab` type: `"timer" | "history" | "stats" | "plan"` → `"today" | "log" | "progress"`
- Update tabs array with new labels and icons: Today (`Timer` icon), Log (`History` icon), Progress (`BarChart3` icon)
- Keep existing conditional blocks, just rename the tab IDs
- At this point, the app works with 3 tabs but content is in wrong places
- **Risk:** Low — just renaming. Can validate immediately.

### Wave 2: Content moves (component files)
- Move `<ProgramsGrid />` from `stats-view.tsx` into `timer-view.tsx`
- Move educational cards + detail from `plan-view.tsx` into `stats-view.tsx`
- **Risk:** Medium — content shifts affect scroll behavior. Validate on mobile.

### Wave 3: Timer preservation fix
- Implement CSS visibility toggle so timer keeps running during tab switches
- **Risk:** Medium — interval lifecycle. Test by starting a fast, switching to Log, switching back — timer must show correct elapsed time.

### Wave 4: Cleanup
- Remove unused imports, dead code in `plan-view.tsx`
- Verify `settings-sheet.tsx` still accessible (gear icon already in stats-view header)
- **Risk:** Low — dead code removal.

### Parallelization note
Waves 1 and 2 can partially overlap: the page.tsx rewire and timer-view.tsx modification are independent files. stats-view.tsx modification depends on Wave 1 (tab wiring confirms what stays/goes). Wave 3 is safest after Wave 2 is complete (timer-view.tsx structure is final).

## Patterns to Follow

### Pattern 1: Section-level composition
**What:** Instead of creating a new wrapper component for Today tab, render ProgramsGrid as a section inside TimerView's existing scroll container.
**Why:** Minimal diff, reuses existing scroll behavior, no new component boundaries to test.
**When:** Content that naturally sits below/above another component's primary content.

### Pattern 2: CSS visibility for lifecycle-critical components
**What:** Keep TimerView mounted (but hidden) when an active fast exists and user switches away.
**Why:** Prevents timer interval from being cleaned up on unmount. The timer must keep running.
**Implementation:**
```tsx
const hasActiveFast = /* check localStorage or pass as prop */;
<div className={activeTab === "today" || hasActiveFast ? "" : "hidden"}>
  <TimerView .../>
</div>
```

### Pattern 3: Avoid new component definitions for moves
**What:** Don't create a new `ProgressView.tsx` or `TodayView.tsx` file.
**Why:** These would be thin wrappers that add indirection without benefit. The existing view files (`stats-view.tsx`, `timer-view.tsx`) are already the right granularity — just adjust their content.
**Anti-pattern to avoid:** Creating wrapper files like `today-view.tsx` that just compose Timer+Programs. This adds a layer of indirection that makes future diffs harder to trace.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Breaking the scroll container
**What:** Extracting the `overflow-y-auto` div from TimerView into page.tsx to compose Timer + Programs as siblings.
**Why bad:** Changes the scrolling architecture for all tabs, increases diff surface, introduces scroll bugs on mobile.
**Instead:** Keep TimerView owning its scroll container. Append ProgramsGrid inside it.

### Anti-Pattern 2: Lifting local state unnecessarily
**What:** Moving `activeFast`, `aiAnalysis`, or `selectedCard` state up to page.tsx.
**Why bad:** These are view-specific states. Lifting them adds prop drilling and couples unrelated views. The existing local state pattern is correct.
**Instead:** Keep local state where it is. Only history (consumed by multiple views) belongs at the Dashboard level.

### Anti-Pattern 3: Deleting plan-view.tsx content entirely
**What:** Removing the educational card detail views when moving content to Progress.
**Why bad:** Users tap educational cards to read full content. The detail views (full-screen overlay with back button) must still work. Removing them breaks the education feature.
**Instead:** Extract educational cards and their detail views as exported sub-components. Import them into stats-view.tsx with the same tap-to-expand behavior.

## Scalability Considerations

| Concern | Current (4-tab) | After Restructure (3-tab) |
|---------|-----------------|---------------------------|
| Tab count | 4 icons in bottom bar | 3 icons — more space per icon, better tap targets |
| Scroll length per tab | Varies: Info was overloaded | More balanced: Today (timer+programs), Log (history), Progress (stats+challenges+AI+education) |
| Component file count | 4 view files | 3 active view files (plan-view.tsx becomes mostly unused) |
| localStorage reads | Each component reads independently | No change — same pattern |
| Re-render on tab switch | Unmount + remount | Same pattern, except timer preserves mount when active |

## Sources

- React official docs: Preserving and Resetting State — confirmed that conditional rendering unmounts components (HIGH confidence)
- React official docs: Sharing State Between Components — confirmed "lift state up" pattern for shared data (HIGH confidence)
- Kent C. Dodds: "One simple trick to optimize React re-renders" — confirmed that passing pre-created elements as props prevents re-renders (HIGH confidence)
- Live codebase analysis: `app/app/page.tsx`, `components/timer-view.tsx`, `components/stats-view.tsx`, `components/plan-view.tsx`, `components/programs-grid.tsx` — verified current state management and component boundaries (HIGH confidence)
- `.planning/PROJECT.md` — confirmed scope constraints: reorganization only, no new functionality, no new dependencies (HIGH confidence)
