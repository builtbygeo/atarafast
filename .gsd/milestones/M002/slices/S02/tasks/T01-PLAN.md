# T01: Data Model & UI Integration

## Why
Integrate weight tracking into the journal flow as required by R008.

## Files
- `lib/storage.ts`
- `components/journal-dialog.tsx`

## Steps
1. Extend `FastingRecord` in `lib/storage.ts` with `weight?: number`.
2. Update `JournalDialog` state to track `weight`.
3. Implement UI controls: weight label, current weight display, +/- 1kg buttons.
4. Add input validation (30-200kg).
5. Ensure UI layout stability.

## Verification
- Confirm `FastingRecord` includes `weight` property in TS interface.
- Open `JournalDialog` via browser and confirm UI elements (buttons/text) are rendered.
- Perform a manual check: save a fast with weight, reopen dialog to confirm persistence in `localStorage`.

## Observability Impact
- Log validation failures to console.
- Ensure `weight` field is present in `localStorage` JSON dump after save.

## Done when
- Weight is selectable in the Journal dialog.
- Entries successfully save weight to local storage.
- No UI scroll regression occurs.
