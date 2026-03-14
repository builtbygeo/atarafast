---
id: T01
parent: S02
milestone: M001
provides:
  - Visibility-aware push notifications suppression
  - "Late Greeting" dialog for delayed fast completions on wake
key_files:
  - hooks/use-notifications.ts
  - components/timer-view.tsx
key_decisions:
  - Extracted `performEndFast` from `handleEndFast` to skip the double-tap confirmation pattern on the explicit modal.
patterns_established:
  - Time-based gating for late interactions
observability_surfaces:
  - UI state (AlertDialog visible)
duration: 15m
verification_result: passed
completed_at: 2026-03-14T18:24:00Z
blocker_discovered: false
---

# T01: Implement Visibility Check and In-App Late Greeting

**Added visibility-aware notification suppression and an in-app "Late Greeting" modal to prevent spamming iOS PWA users returning to the app hours after their fast ended.**

## What Happened

- Added `document.visibilityState === "visible"` check in `use-notifications.ts` to suppress push notifications if the user is already interacting with the app.
- Added a calculation for `isLateReturn = (elapsedMs - targetMs) > 60000` to both the interval and initial mount `useEffect` in `TimerView`.
- Introduced `showLateGreeting` state and matching `AlertDialog` markup displaying the `lateGreetingDesc` translation.
- Extracted a `performEndFast` helper out of `handleEndFast` to allow completing the fast from the "Late Greeting" modal without triggering the "Tap again to confirm" intermediate UI state.

## Verification

- Spun up the Next.js dev server.
- Intercepted `fasting-tracker-data` in `localStorage` via `browser_evaluate` to simulate an active 16-hour fast that ended exactly 1 hour ago (`isLateReturn > 60000`).
- Reloaded the page and verified the "Fast Complete" modal appeared.
- Checked that clicking "Complete Fast" on the modal bypasses the standard confirmation state and successfully ends the fast.
- Tested normal completion by simulating a fast ending 2 seconds in the future — verified no late greeting dialog fired and only the standard notification pipeline triggered.

## Diagnostics

- Runtime signals: Late return detected (state transition `showLateGreeting`).
- Inspection surfaces: UI state (AlertDialog visible).
- Failure visibility: React error boundary.

## Deviations

- Modified `TimerView` to extract the completion logic (`performEndFast`) from `handleEndFast`. The original plan suggested `handleEndFast()`, but doing so would have resulted in the user having to tap "COMPLETE FAST" inside the modal and then tap it again on the main view due to the two-tap confirmation flag (`confirmEnd`).

## Known Issues

- None

## Files Created/Modified

- `hooks/use-notifications.ts` — Updated notification logic to add a visibility check.
- `components/timer-view.tsx` — Added the "Late Greeting" dialog and time-gating logic for delayed notifications.