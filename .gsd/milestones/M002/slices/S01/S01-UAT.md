# S01 UAT: AI Quota & Feature Democratization

**Preconditions:**
- Application is running locally (`npm run dev`).
- User is logged in as a "free" user.
- User has 0 fasts completed.

**Test Cases:**

1. **Dashboard Accessibility (Free User, 0 Fasts)**
   - **Step:** Navigate to the Dashboard.
   - **Expect:** Dashboard loads successfully (previously locked).
   - **Step:** Observe AI Coach section.
   - **Expect:** AI Coach is locked with message "You need 5 completed fasts to unlock AI features."

2. **AI Coach Unlocking (Free User, 5 Fasts)**
   - **Step:** Manually simulate completing 5 fasts (via local storage manipulation or testing UI).
   - **Step:** Navigate to the Dashboard/AI Coach.
   - **Expect:** AI Coach is now accessible.

3. **Quota Enforcement (Free User, 5 Fasts, 1 Used)**
   - **Step:** Use AI Coach once (triggering the `usageToday` quota).
   - **Step:** Attempt to use AI Coach a second time.
   - **Expect:** AI Coach is locked with message "Daily limit reached. Upgrade to Premium for more."

4. **Premium User Quota Check**
   - **Step:** Ensure user is flagged as "premium".
   - **Step:** Use AI Coach multiple times.
   - **Expect:** AI Coach remains accessible regardless of usage limit.
