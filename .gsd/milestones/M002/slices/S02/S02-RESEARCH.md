# S02 — Weight Tracking Integration — Research

**Date:** Saturday, March 14, 2026

## Summary

The goal of this slice is to add weight tracking to the journal entry flow. This involves extending the existing `FastingRecord` interface in `lib/storage.ts` to include an optional `weight?: number`, and updating the `JournalDialog` UI to include non-scrolling, compact +/- 1kg controls.

This is a straightforward addition to the data model and UI. The primary challenge is ensuring the compact UI controls for weight input fit into the existing `JournalDialog` without introducing vertical scrolling or clutter.

## Recommendation

Extend `FastingRecord` in `lib/storage.ts` with `weight?: number`.
Update `JournalDialog` to include a new section for weight input.
Use simple icon-based +/- buttons to adjust weight, keeping the UI compact.
Implement validation to ensure reasonable weight ranges (e.g., 30-200kg).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| State Management | React `useState` | Currently used for all journal fields; keeping consistency is easier for maintenance. |
| Data Persistence | `localStorage` + `saveData` | Already used for all app data; this keeps the single source of truth model intact. |

## Existing Code and Patterns

- `lib/storage.ts` — Adding `weight?: number` to `FastingRecord` is the required schema change.
- `components/journal-dialog.tsx` — The place where the new +/- controls will reside. Needs to follow the existing button/slider pattern.

## Constraints

- **Non-scrolling UI:** The current `JournalDialog` has a fixed height/container logic (`max-h-[90vh]`). Adding weight must not force overflow in the `flex-1 overflow-y-auto` content.
- **Data Model:** Need to ensure backward compatibility for old `FastingRecord` entries (which won't have `weight`).

## Common Pitfalls

- **UX/UI Clutter:** Adding too many input controls will make the journal feel heavy. Ensure the weight controls are visually distinct but compact.
- **Input Validation:** Users might enter invalid weight values; handle bounds-checking locally.

## Open Risks

- The user base for weight tracking might have preferences for different units (lbs vs kg), though the requirement specifies `+/- 1kg controls`.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| React | N/A | Standard |
| TypeScript | N/A | Standard |

## Sources

- Atara Internal Knowledge (Project codebase at `lib/storage.ts` and `components/journal-dialog.tsx`)
