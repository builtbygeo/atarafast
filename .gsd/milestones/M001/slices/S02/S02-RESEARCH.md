# S02: Notification UX (Anti-Spam) — Research

## Context

**Goal:** Prevent the PWA from sending a delayed system push notification when reopened hours after a fast ends. Instead, users should receive a graceful in-app greeting.

**Requirements Targeted:**
- **R002: Fix Notification Logic** (Active) - Delayed execution of local notifications when the PWA is inactive. Prevent old/stale notifications from firing upon app resume.

## Findings

### 1. The Root Cause of "Delayed Spam"
The PWA uses a `setInterval` in `TimerView` that runs every 1000ms. When `elapsedMs >= targetMs`, it fires `sendNotification()` to show the completion system push. 
**On iOS PWAs**, JavaScript execution is entirely suspended when the app is backgrounded. When the user reopens the app hours later:
- The JS thread resumes exactly where it left off.
- The `setInterval` fires immediately.
- It sees `elapsedMs >= targetMs` is true and `hasCelebratedRef.current` is still false.
- It immediately calls `sendNotification()`, resulting in a push notification arriving exactly as the user is staring at the app. This feels like delayed spam.

### 2. The Native Notification Solution (`hooks/use-notifications.ts`)
To fix this, `sendNotification` must be aware of the app's current visibility state.
- **The Fix:** In `useNotifications()`, we can check `document.visibilityState === "visible"`. If the app is actively visible when the notification fires, we **suppress** the system push notification (returning `{ suppressed: true }`).
- **Why this works:** When the user reopens the iOS PWA, the app is visible when the suspended JS resumes. Thus, the push is suppressed, eliminating the spam. Furthermore, if a desktop user is actively watching the timer hit zero, they won't get an unnecessary system push, which is better UX anyway.

### 3. The In-App Greeting Solution (`components/timer-view.tsx`)
We need to present a graceful in-app greeting to users returning after a fast has ended. We must handle two resume scenarios:
- **Scenario A (Warm Resume):** The app was suspended in the background. The JS `setInterval` fires. `elapsedMs` is way past `targetMs`. We calculate `isLateReturn = (elapsedMs - targetMs) > 60000ms`. If true, we show an in-app greeting dialog (`showLateGreeting` state).
- **Scenario B (Cold Boot):** The app was fully closed and is now mounting freshly. In the `useEffect` on mount, `hasCelebratedRef.current` is immediately set to `true` if `elapsedMs >= targetMs`. We must also check `isLateReturn` here, and if true, show the greeting dialog so they don't miss the celebration.

## Forward Intelligence

- **Translations:** I preemptively added `lateGreetingDesc` to `lib/translations.ts` in English and Bulgarian to support the new dialog text.
- **Visuals:** The in-app greeting will use the existing `AlertDialog` component to stay consistent with the "Delete Fast" and "Quit Fast" dialogs. It will have a "Complete Fast" primary button that maps to `handleEndFast()`.
- **False Positives:** By setting the `isLateReturn` threshold to 60,000ms (1 minute), we ensure that a user actively watching the timer hit 0 won't get interrupted by a big dialog (they just see the regular completion animation). The greeting only appears if they missed the actual moment by at least a minute.
- **Service Worker:** The SW postMessage strategy in `use-notifications.ts` remains the preferred path for push, but the visibility check cleanly guards it.

## Next Steps
The research is complete. We can proceed to S02 Planning to implement the `useNotifications` visibility check and the `TimerView` late greeting dialog.