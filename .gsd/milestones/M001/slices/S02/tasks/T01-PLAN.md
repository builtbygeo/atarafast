# T01: Implement Visibility Check and In-App Late Greeting

**Slice:** S02 — Notification UX (Anti-Spam)
**Milestone:** M001

## Description

To prevent "delayed spam" on iOS PWAs when a user reopens the app hours after a fast ends, we need to make notifications visibility-aware. We'll suppress system push notifications if the app is currently visible. In addition, we'll introduce a "Late Greeting" dialog in `TimerView` that shows up if a fast ended more than 1 minute ago (60,000ms).

## Steps

1. In `hooks/use-notifications.ts`, add a check inside `sendNotification`: if `document.visibilityState === "visible"`, suppress the push and return.
2. In `components/timer-view.tsx`, introduce a new state `showLateGreeting` (default `false`).
3. Update the `useEffect` interval and the initial mount `useEffect` in `TimerView` to calculate `isLateReturn = (elapsedMs - targetMs) > 60000`. If true, set `showLateGreeting(true)`. If false, trigger `sendNotification()` (which will handle visibility itself).
4. Add the `AlertDialog` markup for `showLateGreeting` in `TimerView`, using `t.fastComplete` as the title, `t.lateGreetingDesc` as the description, and a "Complete Fast" button that calls `handleEndFast()`.

## Must-Haves

- [ ] `useNotifications` suppresses when `document.visibilityState === "visible"`.
- [ ] `TimerView` detects late returns (> 60s past target).
- [ ] Late greeting dialog is displayed when returning late.

## Verification

- Modify the state manually (or write a quick test) to simulate a fast that started hours ago, then reload the page and check if the dialog is displayed.
- Test that normal fast completion (watching the timer hit 0) does not show the late greeting dialog.

## Observability Impact

- Signals added/changed: None
- How a future agent inspects this: UI state (AlertDialog)
- Failure state exposed: N/A

## Inputs

- `hooks/use-notifications.ts` — Requires visibility check.
- `components/timer-view.tsx` — Requires state and dialog implementation.
- `lib/translations.ts` — Check if `lateGreetingDesc` exists as mentioned in research.

## Expected Output

- `hooks/use-notifications.ts` — Updated notification logic.
- `components/timer-view.tsx` — Updated with late greeting feature.
