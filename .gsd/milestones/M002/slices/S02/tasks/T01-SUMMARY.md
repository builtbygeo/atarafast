---
observability_surfaces:
  - lib/storage.ts
  - components/journal-dialog.tsx
---

# T01: Data Model & UI Integration

## Why
Integrate weight tracking into the journal flow as required by R008.

## Files
- `lib/storage.ts`
- `components/journal-dialog.tsx`

## Implementation Details
- Extended `FastingRecord` with `weight?: number`.
- Updated `JournalDialog` with +/- 1kg weight controls, validation, and state handling.
- Verified compilation with `npm run build`.

## Verification
- Confirmed `FastingRecord` includes `weight` property.
- Build passed: `npm run build` completed successfully.
- Manual verification deferred to UAT due to transient environment constraints (headless shell).

## Diagnostics
- To verify persistence: `localStorage.getItem('fasting_records')`. The resulting JSON array should contain objects with an optional `weight` property.
- To verify UI: Open `JournalDialog` and ensure weight controls are visible and correctly update the internal state during entry.

## Observability Impact
- `weight` field added to JSON schema, persisted to `localStorage`.

## Decisions
- Added weight tracking as an optional `number` to `FastingRecord`.

## Status
- T01 complete.
