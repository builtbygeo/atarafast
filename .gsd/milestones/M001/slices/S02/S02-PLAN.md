# S02: Notification UX (Anti-Spam)

**Requirement:** R002: Fix Notification Logic

**Goal:** Prevent delayed system push notifications when the PWA is reopened hours after a fast ends, and provide a graceful in-app greeting instead.
**Demo:** Fast spanning past its target while the app is backgrounded will show a polite in-app "Late Greeting" dialog upon app wake, and no system push notification will fire.

## Must-Haves

- `useNotifications` hook must suppress notifications if the app is currently visible.
- `TimerView` must detect if a fast ended more than 60,000ms ago upon resume/mount.
- `TimerView` must present an in-app greeting (AlertDialog) for late returns instead of calling `sendNotification`.

## Proof Level

- This slice proves: final-assembly
- Real runtime required: yes
- Human/UAT required: yes

## Verification

- `npm run test` (if there's a test runner, else we will verify via browser manually or using a script)
- We will verify manually in the browser by mocking `elapsedMs` logic or running `browser_assert` checks on the UI after fast completion.

## Observability / Diagnostics

- Runtime signals: Late return detected (state transition `showLateGreeting`).
- Inspection surfaces: UI state (AlertDialog visible).
- Failure visibility: None specifically beyond the React error boundary.
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: `hooks/use-notifications.ts`, `components/timer-view.tsx`
- New wiring introduced in this slice: visibility check in notification pipeline.
- What remains before the milestone is truly usable end-to-end: Free AI Model and Premium Feature Flags (S03).

## Tasks

- [x] **T01: Implement Visibility Check and In-App Late Greeting** `est:45m`
  - Why: Prevents PWA push notification spam on wake and improves UX for delayed sessions.
  - Files: `hooks/use-notifications.ts`, `components/timer-view.tsx`
  - Do: Add `visibilityState` check to `sendNotification`. Add `showLateGreeting` state to `TimerView`. Check `(elapsedMs - targetMs) > 60000` on mount and in interval to trigger the dialog. Add AlertDialog UI.
  - Verify: Start a 1-minute fast, wait 2 minutes, verify the late greeting appears and no push is triggered.
  - Done when: The app reliably suppresses notifications when visible and shows the greeting dialog for late returns.

---
estimated_steps: 4
estimated_files: 2
