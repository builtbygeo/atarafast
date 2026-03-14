---
id: S02
parent: M001
milestone: M001
completed_at: 2026-03-14T18:30:00Z
provides:
  - Suppression of stale push notifications when app is active
  - In-app "Late Greeting" dialog for delayed fast completions
key_files:
  - hooks/use-notifications.ts
  - components/timer-view.tsx
key_decisions:
  - Added document.visibilityState check to prevent push notification spam.
  - Implemented client-side time-gating (elapsedMs - targetMs > 60000) for late returns.
  - Extracted performEndFast to allow direct fast completion from the late-greeting modal.
---

# S02: Notification UX (Anti-Spam) Summary

We successfully implemented anti-spam notification logic for the PWA. The application now checks the `document.visibilityState` before firing local notifications, ensuring that users already in the app aren't interrupted by backgrounded tasks finishing.

For users returning hours after their fast ends, the system now detects the "late return" and suppresses any stale push notifications, presenting an in-app "Late Greeting" dialog instead. This provides a more graceful experience and prevents the reported notification spam.

The core completion logic was refactored to allow the late-greeting modal to finalize the fast directly without the usual two-step confirmation, maintaining a smooth user flow.
