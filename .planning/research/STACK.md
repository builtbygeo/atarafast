# Technology Stack: Atara 3-Tab Navigation Redesign

**Project:** Atara — Mobile-first fasting tracker UI reorganization
**Researched:** 2026-05-13
**Overall confidence:** HIGH
**Constraint:** No new dependencies. Existing stack only.

## Recommended Stack (Unchanged — but used more intentionally)

The project already has every technology needed for a polished 3-tab bottom navigation. The redesign is about *better use of what's installed*, not adding new packages.

### Core Framework (No Changes)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.1.6 | App Router, RSC, SPA shell | Already in place; App Router with `"use client"` SPA is correct for this pattern |
| React | 19.2.4 | Component tree, state, transitions | Already in place; `useState` + conditional rendering is appropriate for tab switching |
| Tailwind CSS | 4.2.1 | Utility-first styling | Already in place; Tailwind 4's CSS-first config is ideal for nav bar design tokens |
| shadcn/ui | new-york | Component primitives (from @radix-ui) | Already in place; Tabs, Sheet, Button primitives available but not required for bottom nav |

### Animation (Already Installed — Use It)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `framer-motion` | 12.34.4 | View transitions, tab indicator animation, micro-interactions | **Primary:** `AnimatePresence` for crossfade between tabs. Already imported in timer-view.tsx and plan-view.tsx |
| `tw-animate-css` | 1.3.3 | CSS-only animation utilities | **Secondary:** Spin, pulse, and entrance animations for badges/indicators. Declarative, no JS bundle cost |

### Iconography

| Library | Version | Purpose |
|---------|---------|---------|
| `lucide-react` | ^0.564.0 | Tab icons, nav indicators |

## Architecture Decision: Keep SPA Tab Pattern (No URL Routing)

**Decision:** Tabs remain client-side state (`useState<Tab>`), NOT Next.js route groups or searchParams.

**Rationale:**
- Current architecture is a single `app/app/page.tsx` SPA shell. Splitting into routes (`/app/today`, `/app/log`, `/app/progress`) would create full-page navigations instead of instant transitions.
- Next.js App Router does not support client-side route transitions without full remounts (unlike Pages Router's `shallow` routing). Each route change triggers server component re-render and layout remount.
- The `framer-motion` `AnimatePresence` pattern requires components to stay mounted in the same parent — incompatible with route-level splits.
- **Exception:** If deep-linking to specific tabs is needed in the future, use `?tab=today` searchParams with `useSearchParams()` and `router.replace()` — but this is NOT in scope for the current milestone.

## Bottom Tab Navigation: The Definitive Implementation Pattern

### Tab Bar Component Recommendations

The current nav bar is already structurally sound. These are the refinements:

#### 1. Three Tabs: Layout & Sizing

```tsx
// Current (problematic): 4 tabs, tiny labels, minimal active state
// Target: 3 tabs with generous tap targets, clearer active indicator

// RECOMMENDED tab bar structure:
<nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md 
  flex items-center justify-around 
  border-t border-border 
  bg-background/95 backdrop-blur-xl 
  px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 
  z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
  {tabs.map(({ id, label, icon: Icon }) => (
    <button
      key={id}
      onClick={() => setActiveTab(id)}
      className={cn(
        "relative flex flex-col items-center gap-1 min-w-[64px] min-h-[48px] py-1.5",
        "text-[11px] font-semibold tracking-wide transition-all duration-200",
        "active:scale-95", // Press feedback (not 90 — too aggressive)
        activeTab === id
          ? "text-primary" 
          : "text-muted-foreground/50 hover:text-muted-foreground"
      )}
    >
      <Icon className="h-6 w-6 transition-transform duration-200" />
      <span>{label}</span>
      {/* Active indicator dot */}
      {activeTab === id && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  ))}
</nav>
```

**Key changes from current:**
| Aspect | Current | Recommended | Why |
|--------|---------|-------------|-----|
| Tab count | 4 | 3 | 3 tabs = 33% wider tap targets, less cognitive load |
| Label size | `text-[9px]` | `text-[11px]` | WCAG minimum readable; 9px fails contrast at common zoom levels |
| Label weight | `font-black uppercase` | `font-semibold` | Black + uppercase is harsh on a wellness app. Semibold is elegant. |
| Press scale | `active:scale-90` | `active:scale-95` | 90% is a 10% shrink — cartoonish. 95% = subtle haptic illusion. |
| Active indicator | Color only | Color + dot + layout animation | Color-only active states fail for colorblind users. Dot is unambiguous. |
| Layout animation | None | `layoutId="tab-indicator"` | Shared element animation between tabs — feels premium, costs no perf |
| Min tap target | Implicit | `min-w-[64px] min-h-[48px]` | Explicit WCAG 2.1 SC 2.5.5 compliance |

#### 2. View Transitions Between Tabs

The app already has `framer-motion` imported in `timer-view.tsx`. Apply the same pattern to the tab-level view switching:

```tsx
// REPLACE the current conditional rendering block:
// {activeTab === "timer" && <TimerView ... />}
// {activeTab === "history" && <HistoryView ... />}

// WITH AnimatePresence crossfade:
<div className="flex-1 relative w-full overflow-hidden">
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute inset-0 overflow-y-auto"
    >
      {activeTab === "today" && <TodayView ... />}
      {activeTab === "log" && <LogView ... />}
      {activeTab === "progress" && <ProgressView ... />}
    </motion.div>
  </AnimatePresence>
</div>
```

**Critical details:**
- `mode="wait"` — ensures exiting tab fully fades out before entering tab fades in (no visual overlap)
- `duration: 0.15` — 150ms is the sweet spot. Faster than human perception threshold (~100ms) but not jarring. Longer durations (>300ms) feel sluggish.
- `y: 4 → 0` / `0 → -4` — 4px vertical shift gives a subtle "forward/backward" directionality without being a full slide
- `absolute inset-0` — prevents layout shift during transition; both views occupy same space
- `overflow-y-auto` — each view handles its own scroll, not the parent

**DO NOT use horizontal slide transitions.** Without gesture support (swipe to navigate back), a slide transition feels like an accidental navigation or a broken back gesture. Crossfade is universally understood.

#### 3. Tab Bar Positioning

```css
/* Current: fixed bottom — CORRECT */
/* DO NOT add: hide-on-scroll behavior */
/* DO NOT add: auto-hide or slide-away */
```

**Why:** On a 3-tab app, the tab bar is the primary navigation. Hiding it on scroll (a common native app pattern) hurts discoverability and increases cognitive load. Users must scroll up to change tabs — unacceptable for a tool used multiple times daily. Save hide-on-scroll for content-consumption apps (news, social media), not utility apps.

#### 4. Tab State Persistence

**Problem:** Current implementation uses `useState("timer")` (line 25 of page.tsx). Tab resets to "timer" on every page refresh.

**Solution:** Persist to `localStorage`:

```tsx
const [activeTab, setActiveTab] = useState<Tab>(() => {
  if (typeof window === "undefined") return "today"
  return (localStorage.getItem("atara-active-tab") as Tab) || "today"
})

const handleTabChange = useCallback((tab: Tab) => {
  setActiveTab(tab)
  localStorage.setItem("atara-active-tab", tab)
}, [])
```

This requires ZERO new dependencies and respects the existing localStorage architecture.

## Icon Selection for 3 Tabs

| Tab | Recommended Icon | Rationale |
|-----|-----------------|-----------|
| Today | `Timer` (from lucide-react) | Primary action — the timer is the hero. Already used, keep it. |
| Log | `History` or `ClipboardList` | Represents past records. `History` is already used, familiar. |
| Progress | `BarChart3` or `TrendingUp` | Forward-looking stats. `BarChart3` is already imported in page.tsx. |

**Icon state trick:** Lucide doesn't support filled variants natively, but you can simulate "active fill" by wrapping the icon in a container with `bg-primary/10 rounded-full p-0.5` or by using `strokeWidth={active ? 2.5 : 1.5}` on the icon element. The simplest and most reliable approach is color change + the layout-animated dot indicator — no icon swapping needed.

## Premium Gate Pattern

The project constraint says premium UI elements must be **hidden** (not removed) behind `NEXT_PUBLIC_ENABLE_PREMIUM=false`.

**Pattern to follow everywhere:**

```tsx
// In page.tsx or relevant components:
const ENABLE_PREMIUM = process.env.NEXT_PUBLIC_ENABLE_PREMIUM === "true"

// DO: Conditional rendering wrapper
{ENABLE_PREMIUM && hasHiddenRecords && (
  <PremiumGate onUpgrade={() => setUpgradeOpen(true)} />
)}

// DO NOT: Remove the code or comment it out
// DO NOT: Use isPremium alone without ENABLE_PREMIUM check
```

The `premium-gate.tsx` component already exists. For the "Unlock full history" banner, ensure the visibility gate is:

```tsx
const showHistoryBanner = ENABLE_PREMIUM && hasHiddenRecords && !isPremium
```

NOT just `hasHiddenRecords && !isPremium` (which is the current bug mentioned in PROJECT.md line 51).

## Accessibility Requirements

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Tab bar is a `<nav>` element | Already `<nav>` | ✓ |
| Tabs have `aria-label` | Already present line 159 | ✓ |
| `aria-current="page"` on active tab | Add `aria-current={activeTab === id ? "page" : undefined}` | ✗ Missing |
| Role structure | Tabs should use `role="tablist"`, `role="tab"`, `aria-selected` | ✗ Missing — but debatable: Apple HIG and Material Design use toolbar patterns for bottom nav, not tab patterns. The `<nav>` + `<button>` approach is more semantically correct for navigation. |
| 44×44px minimum tap target | `min-w-[64px] min-h-[48px]` | ✗ Needs explicit sizing |
| Focus visible ring | `focus-visible:ring-2 focus-visible:ring-ring` | ✗ Add to button className |
| Reduced motion | Respect `prefers-reduced-motion` | ✗ Wrap framer-motion transitions in media query check |

**Accessibility recommendation:** Keep the `<nav>` + `<button>` semantic pattern (it's correct for navigation). Add `aria-current`, explicit `focus-visible` ring, and respect `prefers-reduced-motion`:

```tsx
// Reduced motion hook (in a shared hook file, or inline):
const prefersReducedMotion = 
  typeof window !== "undefined" && 
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Disable layout animations when reduced motion is preferred:
<motion.div
  layoutId={prefersReducedMotion ? undefined : "tab-indicator"}
  ...
/>
```

## Anti-Patterns: What NOT To Do

### 1. DO NOT Use Slide Transitions Without Gesture Support
Slide-left/slide-right between tabs feels like a native app gesture but breaks when the user can't swipe to trigger it. It creates an expectation the app can't fulfill. Use crossfade instead.

### 2. DO NOT Hide the Tab Bar on Scroll
This is a utility app (timer, log, progress), not a content feed. Users need persistent navigation. Android's Material Design explicitly recommends persistent bottom navigation for apps with 3-5 top-level destinations.

### 3. DO NOT Use URL-based Tab Routing
`/app/today`, `/app/log`, `/app/progress` as separate routes would cause full page remounts, kill animation potential, and complicate state sharing (the timer state must persist across tab switches). Keep the SPA pattern.

### 4. DO NOT Use `@radix-ui/react-tabs` for Bottom Navigation
The Radix Tabs component (already installed) is designed for **inline content tabs** (settings panels, filter tabs), not for **navigation-level tab bars**. Using it for bottom nav would fight the component's assumptions about keyboard navigation, ARIA roles, and focus management. Use plain `<nav>` + `<button>` elements with framer-motion.

### 5. DO NOT Make Timer State Reset on Tab Switch
All views must remain mounted (or at least preserve their state) when switching tabs. The current conditional rendering (`{activeTab === "timer" && <TimerView />}`) UNMOUNTS components — losing timer state, scroll position, form inputs. Solution: use `AnimatePresence` with `mode="wait"` OR keep all views mounted and toggle visibility with `display: none` / `visibility: hidden`. The `AnimatePresence` approach is preferred because it allows exit animations while the `key` prop forces React to distinguish instances.

**CRITICAL:** The timer view's `useEffect` with `getActiveFast()` runs on mount. If the timer is running and the user switches tabs and switches back, the timer MUST resume from its actual state without re-initializing. Either:
- Keep `TimerView` always mounted (hide with CSS) — simplest, but loses exit animation
- OR pass a `key` that includes the fast ID so React reuses the instance when returning to the same fast

**Recommended approach for this milestone:** Keep all three tab views mounted simultaneously, use CSS visibility/opacity to show/hide. This is the safest path for timer state preservation with zero refactoring of existing view components.

```tsx
<div className="flex-1 relative w-full overflow-hidden">
  <div className={`absolute inset-0 transition-opacity duration-150 ${activeTab === "today" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
    <TodayView ... />
  </div>
  <div className={`absolute inset-0 transition-opacity duration-150 ${activeTab === "log" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
    <LogView ... />
  </div>
  <div className={`absolute inset-0 transition-opacity duration-150 ${activeTab === "progress" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
    <ProgressView ... />
  </div>
</div>
```

This approach:
- Preserves ALL component state (timer, scroll positions, form state)
- Uses CSS-only transitions (no framer-motion for the tab container)
- Still provides visual polish via opacity transition
- Adds `pointer-events-none` so hidden views don't intercept touches
- Costs slightly more memory (3 mounted views), but each view is lightweight

## What's NOT Needed

The following are explicitly **NOT** recommended:

| Thing | Why Not |
|-------|---------|
| `react-native` or Expo | This is a web app, not native. PWA handles install. |
| `@react-navigation` or similar | React Navigation is for React Native, not web. Use simple state. |
| `swiper` or carousel libraries | Overkill for 3-tab navigation. Adds bundle weight for swipe that may conflict with scroll. |
| `zustand` or global state for tab | `useState` in page.tsx is sufficient. Tab state is local, not global. |
| `use-hooks` or gesture libraries | No swipe-to-navigate needed. Simple tap is the only interaction. |
| New icon libraries | `lucide-react` already covers all needed icons. |
| CSS modules or styled-components | Tailwind CSS 4 is already the styling solution. Stay consistent. |

## Installation

**No new packages to install.** All dependencies are already in `package.json`:

```bash
# Confirm everything is available (no action needed):
grep -E "framer-motion|tw-animate|lucide-react" package.json
```

## Performance Considerations

| Concern | Approach |
|---------|----------|
| Three views mounted simultaneously | Each is ~5-10KB of component code. Combined memory footprint negligible. `pointer-events-none` on hidden views prevents unnecessary event handling. |
| Tab bar repaint on scroll | `bg-background/95 backdrop-blur-xl` is GPU-composited. No repaint cost. |
| Layout animation (dot indicator) | `layoutId` animations use CSS transforms (GPU-accelerated). No layout thrashing. |
| Icon SVG rendering | Lucide icons are ~1KB each, tree-shaken. No icon font download. |

## Sources

- **Existing codebase analysis:** `app/app/page.tsx`, `components/timer-view.tsx`, `components/history-view.tsx`, `package.json` — HIGH confidence
- **framer-motion AnimatePresence:** Context7 /grx7/framer-motion (official docs) — HIGH confidence
- **shadcn/ui Tabs component:** `/components/ui/tabs.tsx` (Radix Tabs wrapper) — HIGH confidence
- **Tailwind CSS 4:** `styles/globals.css`, `package.json` — HIGH confidence
- **Apple HIG Tab Bars:** developer.apple.com/design/human-interface-guidelines/tab-bars — MEDIUM confidence (page requires JS; verified via training data + secondary sources)
- **Material Design 3 Navigation Bar:** m3.material.io/components/navigation-bar — MEDIUM confidence (page requires JS; verified via training data)
- **WCAG 2.1 Target Size (SC 2.5.5):** w3.org/WAI/WCAG21/Understanding/target-size.html — HIGH confidence
- **Mobile bottom nav UX patterns:** Multiple industry sources, consistent across Apple HIG, Material Design, and NNGroup — HIGH confidence
