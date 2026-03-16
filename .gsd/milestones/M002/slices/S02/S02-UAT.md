# S02: Weight Tracking Integration UAT

## Goal
Verify that weight tracking is correctly implemented in the `JournalDialog` and persisted to `localStorage` within `FastingRecord`.

## Preconditions
- The application is running in a dev environment.
- Access to the browser console or the ability to inspect `localStorage`.

## Test Cases

### TC01: UI Interaction
1. Open the journal dialog (e.g., end a fast).
2. Ensure the "Weight (kg)" section with "-" and "+" buttons is visible.
3. Click the "+" button; verify the number increases by 1.
4. Click the "-" button; verify the number decreases by 1.
5. Manually enter a number (e.g., "75"); verify the field updates correctly.
6. Attempt to enter a value below 30 or above 200; verify that the input handles it gracefully or prevents invalid values.

### TC02: Data Persistence
1. Perform the UI interactions in TC01 to set a weight (e.g., 75 kg).
2. Save the journal entry.
3. Refresh the page or navigate to the history view.
4. Open the browser console and run: `JSON.parse(localStorage.getItem('fasting-tracker-data')).history`.
5. Verify the most recent `FastingRecord` object contains a `journalData` property with a `weight` of 75.

### TC03: Edge Cases
1. Create a journal entry *without* entering weight.
2. Verify the saved `FastingRecord` either omits the `weight` property or stores `undefined`/`null` correctly.
3. Create a journal entry *with* a weight.
4. Verify retrieval still works and displays the previously saved weight.

## Expected Outcomes
- All tests pass according to the requirements in `R008`.
- No console errors related to weight serialization.
