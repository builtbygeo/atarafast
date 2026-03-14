# S02: Weight Tracking Integration Plan

## Goal
Extend `FastingRecord` to include optional `weight`, and add compact +/- 1kg weight controls to `JournalDialog` for local storage.

## Requirements Covered
- **R008:** Weight Tracking Integration

## Slice Verification
- Verify `FastingRecord` schema change in `lib/storage.ts`.
- Verify weight input/display in `JournalDialog`.
- Verify weight saving/retrieval in `localStorage` via a small test script or manual UI check.
- **Observability / Diagnostics:** Confirm new `weight` field is correctly serialized in local storage snapshots. Verify console logs indicate successful weight persistence or validation errors.

## Tasks
- [x] **T01: Data Model & UI Integration** `est:2h`
  > Update `lib/storage.ts` and `components/journal-dialog.tsx`. Implement +/- weight controls.

---
