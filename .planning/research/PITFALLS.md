# Domain Pitfalls

**Domain:** Mobile app navigation redesign (fasting tracker, React/SWC, PWA)
**Researched:** 2026-05-13
**Confidence:** HIGH — findings verified against codebase inspection, React official docs, NNGroup mobile UX research, and direct analysis of all premium gate code paths.

---

## Critical Pitfalls

Mistakes that cause rewrites, data loss, or broken UX that requires a full rollback.

---

### Pitfall 1: Tab Content Remounting Causes State Loss

**What goes wrong:** The current code uses conditional rendering for tabs (`{activeTab === "timer" && <TimerView />}`). Every tab switch _unmounts_ the previous view and _mounts_ the new one from scratch. When content is reorganized (ProgramsGrid moving from Stats → Timer, educational cards moving from Plan → Progress), any in-progress user state is destroyed:

- **AI analysis results** — generated in StatsView, lost the moment user switches to another tab and back. User must re-generate (consuming daily quota again).
- **Active program selection state** — when ProgramsGrid moves to the Timer tab, the `useState(activeProg)` and `useState(badges)` inside ProgramsGrid are destroyed on tab switch. Program join/quit state must re-read from localStorage on every mount, adding unnecessary I/O and a flash of stale state.
- **Scroll position** — educational card detail views (PlanView's `renderCardDetail`) use `absolute inset-0` with internal scroll. When moved to Progress tab, scroll position is lost on every tab switch.
- **SettingsSheet** — currently opened via `onOpenSettings` prop drilled into StatsView. Moving settings access to the Progress tab header means the SettingsSheet must be triggerable without needing the Stats tab to be mounted.

**Why it happens:** The React conditional-render pattern for tabs is convenient but fundamentally destroys the component tree on each tab switch. `useState`, `useEffect` caches, and DOM scroll positions are all discarded.

**Consequences:**
- Users lose AI coaching analysis when switching tabs (the most expensive compute in the app)
- Users lose scroll position in educational content and programs list
- ProgramsGrid re-reads from localStorage on every mount, doubling I/O
- "Flash of empty state" visible during re-render cycle

**Prevention strategy:**
- **Primary approach (recommended):** Render all tab content simultaneously, control visibility via CSS (`display: none` on inactive tabs). This preserves all component state and scroll positions. Given the app has only 3 tabs and no heavy DOM, the performance cost is negligible.
  ```tsx
  <div style={{ display: activeTab === "timer" ? "block" : "none" }}>
    <TimerView ... />
  </div>
  ```
- **Alternative approach:** Use React `key` prop on each tab panel with the tab ID, so React knows to preserve/recreate. Less reliable than CSS visibility for scroll position.
- **Loading optimization:** If concerned about mounting all views at once (StatsView has heavy SVG/recharts), lazy-mount on first visit with a `hasBeenMounted` flag per tab.

**Detection:** After implementing tab reorganization, switch rapidly between tabs. If AI analysis disappears, program selection resets, or scroll positions jump to top — this pitfall has been hit.

**Phase to address:** Navigation restructuring phase (first implementation phase).

---

### Pitfall 2: Premium Gate Banner Still Appears on Free Tier (30-Day History Limit)

**What goes wrong:** The "Unlock full history" banner in `history-view.tsx:232-251` and the `hasHiddenRecords` logic in `app/app/page.tsx:86-96` both gate on `isPremium` from the subscription hook — but they do _not_ check `ENABLE_PREMIUM`. When `NEXT_PUBLIC_ENABLE_PREMIUM=false`:

- `useSubscription()` returns `isPremium: false` for all users (line 64 of `lib/subscription.ts`: `const isPremium = ENABLE_PREMIUM && (...)` — when ENABLE_PREMIUM is false, isPremium is always false).
- The `displayHistory` filter limits all users to 30 days (because `isPremium` is false).
- The `hasHiddenRecords` check becomes `true` when there are records older than 30 days.
- The banner renders with an "Upgrade" button that calls `startCheckout()` — which sends the user to Stripe checkout that fails or shows wrong pricing.

**This is a confirmed existing bug** noted in PROJECT.md: "Known issues: 'Unlock full history' banner shows even when premium is disabled."

**Why it happens:** The premium gate has two layers: (1) `ENABLE_PREMIUM` at the feature-flag level, (2) `isPremium` at the user-subscription level. The 30-day history filter gates on (2) but not (1). The banner gates on `hasHiddenRecords` which derives from (2). The `startCheckout()` call in the banner has no guard for (1).

**Consequences:**
- Free-tier users see a dead "Upgrade" button that navigates to broken Stripe checkout
- Banner clutters UI with a non-actionable call-to-action
- Users feel the product is buggy ("Why is it asking me to upgrade if I can't?")
- The 30-day history cutoff still applies (denying users their own data) even though there's no paid tier to unlock it

**Prevention strategy:**
- **At the data level:** When `ENABLE_PREMIUM` is false, bypass the 30-day filter entirely. Add a single guard at the top of `app/app/page.tsx`:
  ```tsx
  const displayHistory = useMemo(() => {
    if (!ENABLE_PREMIUM) return history;  // NEW: bypass limit when premium disabled
    if (isPremium) return history;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return history.filter(r => new Date(r.startTime) >= thirtyDaysAgo);
  }, [history, isPremium]);
  ```
- **At the UI level:** Guard `hasHiddenRecords` with `ENABLE_PREMIUM`:
  ```tsx
  const hasHiddenRecords = ENABLE_PREMIUM && !isPremium && displayHistory.length < history.length;
  ```
- **At the action level:** Guard `startCheckout()` in the banner: wrap in `if (ENABLE_PREMIUM)` or replace the button with an informational message when premium is disabled.

**Detection:** Set `NEXT_PUBLIC_ENABLE_PREMIUM=false`, create test data with 31+ days of history, verify no banner appears and full history is accessible.

**Phase to address:** Navigation restructuring phase (this is a pre-existing bug that must be fixed as part of the redesign since the banner is inside content being reorganized).

---

### Pitfall 3: Translation Key Drift and Type Unsafety During Tab Renames

**What goes wrong:** Tab labels change in this redesign:
- "Timer" → "Today"
- "History" → "Log" (already correct in BG: "Лог")
- "Info" (Stats) → "Progress"
- "Plan" → removed (content redistributed)

In `translations.ts`, tab label keys are `timer`, `history`, `stats`, `plan`. If these keys are reused with new values but old code references them by their semantic meaning (e.g., `t.stats` expecting "Info" but now meaning "Progress"), or if component-internal translation keys like `t.statsTitle` (currently "Info"/"Инфо") are not updated, the UI will show mixed-language or wrong-context strings.

The 780-line monolithic translations file (`lib/translations.ts`) uses TypeScript's structural typing: `en` is typed `typeof bg`, but both are objects with hundreds of keys. When adding new keys for renamed tabs (e.g., `progress` or `todayLabel`), forgetting to add them to `en` will cause _runtime_ `undefined` renders, not TypeScript errors — because the codebase has `typescript.ignoreBuildErrors: true` and uses `any` casts extensively (e.g., `(t.educationalCards as any[])`).

**Why it happens:** Monolithic translation object + disabled TypeScript checking + `any` type assertions = no compile-time protection against missing or misnamed translation keys.

**Consequences:**
- Tab labels render as empty text or show old names
- Section headers (e.g., "Stats" heading inside "Progress" tab) look mislabeled
- Bulgarian translations diverge from English silently
- New Bulgarian strings missing entirely, showing English fallback in BG mode

**Prevention strategy:**
- **Rename translation keys to match new tab semantics:**
  - `t.stats` → `t.progress` (tab label)
  - `t.statsTitle` → `t.progressTitle` (section header)
  - `t.statsSubtitle` → `t.progressSubtitle`
  - `t.timer` → `t.today` (tab label, but keep timer-related keys like `t.elapsed`, `t.remaining` as-is)
  - `t.history` → `t.log` (but keep history-related keys like `t.historyTitle`, `t.recentFasts` as-is — they still make semantic sense)
- **Add all new keys to both `bg` and `en` objects before referencing them in components.** Write a validation script or use a `satisfies` type constraint:
  ```ts
  export type Translation = typeof bg;
  export const en: Translation = { ... }; // will error if keys mismatch
  ```
- **Test the app in both languages immediately after any key rename.** Check every tab header, every section title.

**Detection:** Run the app in Bulgarian, navigate to every tab and open every section. Any English text appearing where Bulgarian should be, or `undefined` strings showing blank UI, indicates missing keys.

**Phase to address:** Navigation restructuring phase — must be done inline with component changes, not deferred.

---

### Pitfall 4: Internal Scroll Containers Break After Content Relocation

**What goes wrong:** Each tab view currently has its own scroll container pattern:

| View | Scroll Pattern |
|------|---------------|
| `StatsView` | `absolute inset-0 overflow-y-auto pb-44 no-scrollbar` |
| `HistoryView` | `absolute inset-0 overflow-y-auto px-5 py-6 pb-44 no-scrollbar` |
| `TimerView` | (needs inspection — likely also has internal scroll) |
| `PlanView` | `absolute inset-0 flex flex-col` with `overflow-y-auto` on inner containers |

When `ProgramsGrid` (currently rendered inside `StatsView` at line 542) moves to the Timer tab, it must inherit the Timer tab's scroll container. If Timer's scroll container has different padding, `pb-44` values, or a different `overflow` strategy, ProgramsGrid will either be cut off at the bottom, have double scrollbars, or be unscrollable.

Similarly, educational cards from `PlanView` moving to the Progress/Stats tab must fit within _that_ view's scroll container.

**Why it happens:** Tab views were built as self-contained pages, each with its own scroll and layout assumptions. Moving content between them breaks those assumptions because the receiving container wasn't designed for the additional content height.

**Consequences:**
- Programs at the bottom of the Today tab are unreachable (content cut off below viewport)
- Educational cards overflow their container with no scroll
- Bottom safe-area padding (`pb-44` accounts for the 4-tab bottom bar) may be wrong after navigation bar changes height/layout
- Double scrollbars if both parent and child have `overflow-y-auto`

**Prevention strategy:**
- **Audit every scroll container** in receiving views before moving content in. Verify that:
  - `pb` padding accounts for the new 3-tab bottom bar (may change from `pb-44` to less if 3 tabs use less vertical space)
  - `overflow-y-auto` is on ONE container only (no nesting)
  - `absolute inset-0` positioning doesn't conflict with newly added sibling elements
- **If Timer tab currently uses `flex-1 relative`** and ProgramsGrid needs its own scroll, add a dedicated scroll wrapper:
  ```tsx
  <div className="flex-1 overflow-y-auto pb-36">
    <TimerDisplay />
    <ProgramsGrid />
  </div>
  ```
- **Test on real mobile viewports** (375×812 iPhone, 360×800 Android) with content that exceeds the viewport.

**Detection:** Load each tab with enough content to scroll. Verify all content is reachable. Check for double scrollbars in Chrome DevTools' Layers panel. Test with notched devices (punch-hole camera, dynamic island) for safe-area conflicts.

**Phase to address:** Navigation restructuring phase.

---

### Pitfall 5: History Data Filtering Duplicated and Diverges

**What goes wrong:** The 30-day history filtering (`displayHistory`) is computed in `app/app/page.tsx:86-91` and passed down as a prop to both `HistoryView` and `StatsView`. Each view also has its own `displayHistory` useMemo (line 75-80 in stats-view.tsx). When content reorganization moves history-dependent components to a new tab, there's a risk that:
- One tab shows filtered data while another shows unfiltered
- The filtering logic drifts between the two useMemo blocks
- A component moved to a new tab receives unfiltered `history` instead of the filtered `displayHistory`

**Why it happens:** The filtering is duplicated in two places (parent page + stats-view) because stats-view can't fully trust what it receives from the parent. When content moves and new prop-drilling paths are created, someone copies the wrong prop name.

**Consequences:**
- Stats tab shows all-time data while History tab shows 30-day data (or vice versa)
- Premium gate inconsistency: one view counts all records, another counts filtered
- Challenge calculations use unfiltered history, showing inflated progress numbers

**Prevention strategy:**
- **Single source of truth:** Compute `displayHistory` once in the page component and pass it everywhere. Remove the duplicate `useMemo` from `StatsView`. Add a comment that it's pre-filtered.
- **Rename the prop for clarity:** Call it `filteredHistory` instead of `history` to make it obvious it's been processed.
- **Add a JSDoc annotation:**
  ```tsx
  /** History filtered by 30-day limit for non-premium users when ENABLE_PREMIUM=false.
   *  When ENABLE_PREMIUM=false, this is the full history. */
  ```
- During refactoring, grep for `history={history}` and ensure every consumer gets `filteredHistory`.

**Detection:** Create test data with 40+ days of history. Set ENABLE_PREMIUM=false. Verify all tabs show the same number of records/challenges/stats.

**Phase to address:** Navigation restructuring phase.

---

## Moderate Pitfalls

---

### Pitfall 6: Settings Access Path Changes Without Alternative Route

**What goes wrong:** Currently, settings is accessible via a gear icon in the StatsView header (line 300-306). The redesign moves settings access to a gear icon in the _Progress_ tab header. This means:
- If user is on the Today tab and wants to change language or data settings, they must first navigate to Progress
- The language switcher (EN/БГ toggle) is also in StatsView's header. Moving it to Progress means users on Today can't switch languages without navigating away
- Power users who frequently access settings from the Timer tab lose their muscle-memory path

**Why it happens:** When consolidating 4 tabs into 3, some secondary entry points (language toggle, settings) that were conveniently accessible from frequently-visited tabs get buried.

**Consequences:**
- Language switching requires two taps instead of one (Tab switch + EN/BG toggle)
- User frustration: "Why can't I change settings from here?"
- Non-obvious: new users on other tabs may never discover settings or language toggle

**Prevention strategy:**
- **Keep language toggle visible on every tab** — move it to the header of each tab view, or to a persistent header above the tab bar.
- **Settings gear:** It's acceptable to be only on Progress if it's the "meta" tab. But ensure it's discoverable. Consider:
  - Adding a persistent settings icon to the global header (where Logo is rendered)
  - Or adding a "..." menu to the tab bar itself for overflow actions
- **Test with real users:** "Change the app language to Bulgarian. Time how long it takes."

**Detection:** Perform the "change language" task starting from the Today tab. If it requires more than 2 taps, accessibility has regressed.

**Phase to address:** Navigation restructuring phase — this is a UX design decision that must be resolved before implementation.

---

### Pitfall 7: Timer Tab Becomes Overloaded (Recreating the "Overloaded Info Tab" Problem)

**What goes wrong:** The redesign explicitly aims to solve: "Info tab is overloaded." But it moves Active Programs from Info (Stats) to Today. Combined with the existing Timer UI (circular progress, timer controls, preset grid, onboarding flow), the Today tab risks becoming what the Info tab was — a catch-all that overwhelms users.

The current Timer tab already contains:
- Active timer with circular/triangular SVG progress
- Start/end controls
- Preset selector (when no active fast)
- Onboarding flow overlay
- Late greeting dialog

Adding ProgramsGrid (which itself contains 6 program cards, each with progress bars, join/quit buttons, completion badges) makes Today the heaviest tab.

**Why it happens:** The "active programs" use case ("what am I doing right now") was placed in Today because it logically pairs with the active timer. But the design didn't account for the _visual weight_ — ProgramsGrid is a heavy, card-heavy component that dominates the screen below the timer.

**Consequences:**
- Users must scroll past ProgramsGrid to see other timer features (presets, controls)
- Today tab feels like "two apps in one view"
- Scrolling lag on low-end devices because both SVG timer rings and Program cards are re-rendering (the 1-second `setInterval` in timer-view.tsx:136 already causes full re-renders)
- Users on returning-timer (already fasting) have no reason to see programs, creating visual noise

**Prevention strategy:**
- **Conditional rendering:** Show ProgramsGrid only when _not_ actively fasting (`activeFast === null`). When fasting is in progress, collapse programs to a minimal indicator ("2 programs available" with an expand button).
- **Collapsible sections:** Use an accordion or collapsed-by-default state for ProgramsGrid on Today.
- **Lightweight program card for Today:** Create a slim "active program cards only" variant that shows only the currently joined program (if any), not all 6 programs.
- **Consider moving programs to Log tab instead** — historically, programs and challenges were together in the overloaded Info tab. Perhaps they belong with history/challenges rather than the live timer.

**Detection:** Screen-record the Today tab on a mid-range Android device (e.g., Pixel 4a). Check for jank during 1-second timer updates. Measure time-to-scroll-to-bottom.

**Phase to address:** Navigation restructuring phase — component design decision.

---

### Pitfall 8: Broken E2E Test After Tab Reorganization

**What goes wrong:** The single E2E test (`tests/e2e/quota.spec.ts`) references UI elements by their current tab structure and `aria-label` values. Tab renaming ("Timer" → "Today", "Info" → "Progress") will break any test that references these labels:
- `button[aria-label="Stats"]` is referenced in the test (CONCERNS.md line 53-54 confirms this is already broken)
- `aria-label={label}` on tab buttons (page.tsx:159) uses `t.stats`, `t.timer`, etc. — these change to `t.progress`, `t.today`, etc.

**Why it happens:** Tests couple to UI text. Tab reorganization changes UI text. The test that was already broken (per CONCERNS.md) will be even more broken.

**Consequences:**
- Only E2E test fails (it was already failing, but this makes it harder to fix later)
- CI pipeline (if added) would block merges
- No safety net for verifying tab navigation works post-refactor

**Prevention strategy:**
- **Fix the E2E test AFTER the redesign**, not before. Trying to fix it for 4-tab nav is wasted work.
- **Use data-testid attributes** instead of aria-labels for test selectors: `data-testid="tab-today"`, `data-testid="tab-log"`, `data-testid="tab-progress"`. This decouples tests from translation strings.
- **Write at least one new smoke test** that verifies: each tab renders without crash, tab switching works, language toggle doesn't break.

**Detection:** Run `npm run test:e2e` after redesign. Expect it to fail — that's fine. Just don't let it block the release. Document in the plan that test fixing is a separate concern.

**Phase to address:** Post-redesign testing phase (not blocking the main implementation).

---

### Pitfall 9: PWA Tab State Lost on App Restart

**What goes wrong:** The `activeTab` state defaults to `"timer"` every time the app mounts (`useState<Tab>("timer")` on line 25 of page.tsx). For a PWA that users treat as a native app, this is poor UX:
- User is on the Log tab, checks their history, switches apps. Comes back — the PWA relaunches and they're on Today.
- After completing a fast and journaling, the journal dialog closes and user wants to see stats. But they're on Today tab instead of where they last were.

**Why it happens:** Tab state is in React `useState` — ephemeral, not persisted. PWA cold starts reset all state. The codebase pattern (services worker for notifications, localStorage for data) already uses persistence for other state — tabs just weren't included.

**Consequences:**
- Frustrating "why am I back on this tab?" moments
- Especially bad after onboarding flow completes (sets `activeTab` to timer, causing a jarring switch from whatever tab the user was exploring)
- Onboarding completion calls `refreshHistory()` but doesn't restore tab state

**Prevention strategy:**
- **Persist activeTab to localStorage:**
  ```tsx
  const [activeTab, setActiveTabState] = useState<Tab>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("atara-active-tab") as Tab) || "timer";
    }
    return "timer";
  });

  const setActiveTab = (id: Tab) => {
    setActiveTabState(id);
    localStorage.setItem("atara-active-tab", id);
  };
  ```
- **Consider NOT switching tabs after onboarding** — let onboarding complete and leave user where they were.

**Detection:** Open the app, switch to Log tab, close the browser tab entirely, reopen the PWA. Verify you land on Log, not Today.

**Phase to address:** Navigation restructuring phase — small code change, big UX win.

---

## Minor Pitfalls

---

### Pitfall 10: Framer Motion Exit Animations Conflict During Tab Switch

**What goes wrong:** `PlanView` uses `AnimatePresence mode="wait"` for transitions between grid view → card detail → preset detail. When educational cards move from PlanView to the Progress tab, these animations will run inside the new tab container. If the progress tab also has its own scroll behavior or positioning (e.g., `absolute inset-0`), the `AnimatePresence` exit animation's `position: absolute` may conflict with the container's layout.

**Why it happens:** Framer Motion's `exit` animation positions elements absolutely within their parent during the exit phase. If the parent is already using `absolute` positioning for scrolling, the stacking context can break.

**Consequences:**
- Educational card detail view flickers or jumps during transition
- Content appears behind other elements during animation
- `will-change: transform` on motion elements creates new stacking contexts unexpectedly

**Prevention strategy:**
- When moving PlanView content, ensure the receiving container has `position: relative` and `overflow: hidden` (for the exit animation phase)
- Test both "open card" and "close card" transitions after relocation
- If conflicts arise, simplify animations: use `opacity` only transitions instead of `x`/`y` transforms

**Detection:** Navigate to the Progress tab, tap an educational card, observe the transition. Close the card. Check for layout shifts, overlapping elements, or content appearing below other sections during animation.

**Phase to address:** Navigation restructuring phase.

---

### Pitfall 11: `console.log` Debug Statements Leak in Refactored Views

**What goes wrong:** Multiple `console.log` statements exist in production code (CONCERNS.md documents them in stats-view.tsx:70, 113, 127, 156-157, 161 and lib/stats.ts:45, 52, 61). During content reorganization, developers will be editing these files extensively. It's easy to accidentally preserve these debug logs or add new ones while testing.

The existing `console.log("HISTORY DEBUG:", history)` in stats-view.tsx:70 will fire every time the Progress tab is now mounted/rendered — which could be more or less frequent depending on the display strategy chosen (Pitfall 1).

**Why it happens:** Debug logs are scattered across files being refactored. During a large reorganization, removing them isn't top-of-mind.

**Consequences:**
- Production console polluted with debug output
- Internal state (history records, streak counts, quota data) leaked to client console
- Perceived quality declines ("Why is this app logging my data?")

**Prevention strategy:**
- **As part of the refactoring commit, strip all `console.log` calls** from files touched. Keep `console.error` for actual error paths.
- **Add a lint rule** after this phase: `no-console: ["error", { allow: ["error"] }]`
- **Pre-commit check:** `grep -r "console.log" components/ lib/` should return empty after refactor.

**Detection:** Open DevTools console in production build. Any `console.log` output is a regression.

**Phase to address:** Navigation restructuring phase — clean up during refactoring.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Tab count reduction (4→3) | Pitfall 6: Settings/language toggle buried | Add persistent header with language toggle; keep settings gear discoverable |
| Content relocation (Programs → Today) | Pitfall 7: Timer tab becomes overloaded | Conditional rendering: hide programs during active fast |
| Content relocation (Education → Progress) | Pitfall 10: Animation conflicts | Test enter/exit transitions in new container |
| Premium gate hiding | Pitfall 2: Banner still shows on free tier | Add `ENABLE_PREMIUM` guard to `hasHiddenRecords` and banner render |
| Tab state management | Pitfall 1: Component remounting destroys state | Use CSS visibility toggling instead of conditional rendering |
| Translation updates | Pitfall 3: Missing keys, language divergence | Add all keys to both en/bg simultaneously; test in both languages |
| Scroll/layout | Pitfall 4: Broken scroll containers | Audit all pb, overflow, and absolute positioning after content moves |
| History data | Pitfall 5: Filtering divergence | Single `filteredHistory` prop, remove duplicate useMemo |
| PWA UX | Pitfall 9: Tab state lost on restart | Persist activeTab to localStorage |
| Test suite | Pitfall 8: Broken E2E test | Don't fix test before refactor; add data-testid attributes; write smoke test after |

---

## Sources

- **React Official Docs** — "You Might Not Need an Effect" (react.dev/learn/you-might-not-need-an-effect) — patterns for avoiding state loss during conditional rendering. HIGH confidence.
- **NNGroup** — "Basic Patterns for Mobile Navigation: A Primer" (nngroup.com/articles/mobile-navigation-patterns/) — tab bar visibility, persistence, and discoverability principles. MEDIUM confidence (from 2015, but UX principles are timeless).
- **Codebase Analysis** — Direct inspection of `app/app/page.tsx` (tabs, history filtering, premium gating), `components/history-view.tsx` (banner), `components/premium-gate.tsx` (ENABLE_PREMIUM guard), `components/stats-view.tsx` (scroll, debug logs, duplicate filtering), `components/plan-view.tsx` (AnimatePresence, educational cards), `components/programs-grid.tsx` (state management), `lib/subscription.ts` (isPremium derivation), `lib/translations.ts` (monolithic structure, any casts), `lib/features.ts` (ENABLE_PREMIUM derivation), `lib/storage.ts` (single key, synchronous reads). HIGH confidence.
- **CONCERNS.md** — Existing known issues (broken E2E test, debug logging, hardcoded emails, no error boundaries, single localStorage key). HIGH confidence.
- **Josh Comeau** — "Common Beginner Mistakes with React" (joshwcomeau.com/react/common-beginner-mistakes/) — state mutation, key generation, effect patterns. MEDIUM confidence (blog post, but authoritative author).

---

*Research completed 2026-05-13. All findings verified against the specific codebase. Pitfalls 1-5 are confirmed by code inspection and could cause production issues if unaddressed. Pitfall 2 is a pre-existing confirmed bug.*
