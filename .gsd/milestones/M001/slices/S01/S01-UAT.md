# S01: Fast Attribution Fixes — UAT

**Milestone:** M001
**Written:** 2026-03-14

## UAT Type

- UAT mode: human-experience
- Why this mode is sufficient: The logic changes are exclusively mapping modifications on the client-side UI, which cannot be tested natively via unit tests (since they were not updated in the slice plan) or automated API calls.

## Preconditions

- The Atara application is running on a local development server or staging environment.
- The browser console is open and clear of initial errors.
- Test data includes at least one historical fast that began on Day N at 20:00 and ended on Day N+1 at 12:00.
- Test data includes at least one active (ongoing) fast.

## Smoke Test

Launch the application. Navigate to the main dashboard. The app should load without crashing, and the week status strip should visibly render fast durations for the past 7 days.

## Test Cases

### 1. Verify Midnight-Spanning Fast Attribution

1. Ensure a fast starting on "Yesterday" at 20:00 and ending "Today" at 12:00 exists in the `FastingRecord` test data.
2. View the recent fasts chart.
3. **Expected:** The fast duration explicitly counts as 16 total hours under "Today's" date column, leaving "Yesterday" blank (or attributing only independent fasts that ended yesterday). No false "failed" markers appear for "Yesterday".

### 2. Verify Active Fast Calculation

1. Start a new fast, or load the app with an active (ongoing) fast that is missing an `endTime`.
2. Wait a few seconds for the timer to tick.
3. Check the week status strip.
4. **Expected:** The fast's duration (elapsed time) attributes cleanly to the current calendar day (`isToday` fallback logic functions correctly).

### 3. Verify Stats Aggregation

1. Check the weekly stats view totals for the current week.
2. **Expected:** All hour totals match the End Day Attribution sums seen in the recent fasts chart, aggregating without splitting any hours back to a previous start day.

## Edge Cases

### Multiple Fasts Ending on Same Day

1. Enter two fasts that end on the same calendar day (e.g., an overnight fast ending in the morning, and a daytime fast ending in the evening).
2. **Expected:** Both fasts are aggregated together on the single end day in the charts and strips.

## Failure Signals

- The application throws a React unhandled exception or white screens due to invalid Date creation for an active fast.
- The total fast hours are mathematically split between days, displaying a partial hour total (e.g., 4 hours on Day 1, 12 hours on Day 2).
- The recent fasts chart or stats view shows blank space for an active fast missing an `endTime`.

## Requirements Proved By This UAT

- R001 — The fasting duration accurately avoids midnight splitting and resolves false failures by calculating the duration on the day of completion.

## Not Proven By This UAT

- This UAT does not prove that subsequent system push notifications work or fail upon completion. (Delegated to S02).

## Notes for Tester

Check the "failed" indicator on days preceding a midnight-spanning fast. Because of End Day Attribution, days with no completions will technically show 0 hours and may still look "empty". The core fix here is that the completion day *does* show the correct total hours (e.g., 16 instead of 12) rather than splitting them up.
