---
id: S01
parent: M001
milestone: M001
provides:
  - End Day Attribution logic for fasting records, preventing duration splitting across midnight.
requires: []
affects:
  - S02
key_files:
  - components/recent-fasts-chart.tsx
  - components/week-status-strip.tsx
  - components/stats-view.tsx
key_decisions:
  - Replaced `effectiveStart`/`effectiveEnd` day-splitting with a unified `endTime` grouping for fast duration attribution.
patterns_established:
  - "End Day Attribution": For any fast spanning multiple days, the total logged hours are aggregated onto the day the fast completes (`endTime`).
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
duration: 45m
verification_result: passed
completed_at: 2026-03-14
---

# S01: Fast Attribution Fixes

**Fasts spanning midnight now attribute their entire duration to the end day across all UI views.**

## What Happened

Refactored the application's core visual components (`recent-fasts-chart.tsx`, `week-status-strip.tsx`, and `stats-view.tsx`) to shift from a split-duration model to "End Day Attribution". Previously, fasts crossing midnight were mathematically chopped at 00:00, leading to inaccurate daily hour totals and false "failed" markers. Now, completed fasts attribute their total tracked hours entirely to their `endTime`. Active (ongoing) fasts attribute their currently elapsed hours to the current day (`isToday`). 

This change was pure UI/mapping logic using the existing `FastingRecord` array and `activeFast` from storage context without introducing new wiring.

## Verification

- `npm run build` executed and passed without TypeScript or compilation errors, confirming the new date parsing syntax handles all properties smoothly.
- Visual inspection of the updated code confirmed that all `isSameDay` comparisons and `new Date(f.endTime)` instantiations are guarded against active fasts missing an `endTime`.

## Requirements Advanced

- R001 — Fully implemented the duration attribution logic. The UI assigns total duration to the completion day.

## Requirements Validated

- R001 — The date logic accurately matches the description to prevent midnight splitting. 

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- none

## Known Limitations

- none

## Follow-ups

- none

## Files Created/Modified

- `components/recent-fasts-chart.tsx` — Replaced `effectiveStart/End` splitting with `endTime` grouping.
- `components/week-status-strip.tsx` — Filter days by `endTime`, falling back to `isToday` for active fasts.
- `components/stats-view.tsx` — Aggregation logic updated to accumulate total hours under `endTime`.

## Forward Intelligence

### What the next slice should know
- The fast calculation logic is now centralized around `endTime`. Any new charts or views added later must follow the End Day Attribution pattern to avoid desynchronization between data displays.

### What's fragile
- Date object instantiation without `endTime` checks. Always guard `new Date(f.endTime)` since active fasts don't have this property yet.

### Authoritative diagnostics
- Since there are no backend endpoints for this UI mapping logic, React DevTools is the authoritative source for verifying that the `FastingRecord` array props fed into the components contain valid `endTime` timestamps.

### What assumptions changed
- We originally split hours to match the exact physical time spent fasting on a given calendar day. We shifted to End Day Attribution because the cognitive model for fasting (e.g., "I finished a 16-hour fast today") aligns better with completion time than literal calendar boundary crossing.
