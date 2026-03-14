# UAT: S02 Notification UX (Anti-Spam)

## Preconditions
- The environment is set up and the application is running in a browser that supports PWA notifications (or has been granted permission).
- The `fasting-tracker-data` in local storage is clean or can be reset.

## Test Cases

### TC01: Normal Fast Completion (Backgrounded)
1. **Goal:** Verify that a normal fast completion (returning shortly after target) works as expected without the late greeting.
2. **Steps:**
   - Start a short fast (e.g., 2 minutes).
   - Wait for it to complete.
   - Observe if a standard notification/completion event fires.
3. **Expected Outcome:** Fast completes normally. No late greeting dialog should appear.

### TC02: Delayed Return Notification Suppression
1. **Goal:** Verify that returning hours after a fast ends suppresses stale notifications and shows the Late Greeting.
2. **Steps:**
   - Use `browser_evaluate` to manually update `fasting-tracker-data` in `localStorage` such that `targetMs` is set to 2 hours ago.
   - Refresh the page to trigger `TimerView` mount.
3. **Expected Outcome:** The "Late Greeting" AlertDialog appears immediately upon page load. No push notification should be sent.

### TC03: Late Greeting "Complete Fast" Action
1. **Goal:** Verify that clicking "Complete Fast" from the Late Greeting dialog correctly finalizes the fast.
2. **Steps:**
   - Perform steps from TC02.
   - Click "Complete Fast" in the AlertDialog.
3. **Expected Outcome:** The fast is marked as completed in the app. The dialog closes. The user is redirected to the dashboard/history view.

### TC04: App Foreground Visibility Suppression
1. **Goal:** Verify that if the user is currently using the app when a fast finishes, no push notification fires.
2. **Steps:**
   - Start a fast that ends in 1 minute.
   - Keep the tab focused.
   - Wait for the fast to end.
3. **Expected Outcome:** Fast completion UI triggers. No push notification appears in the OS.
