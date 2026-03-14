# S01: Fast Attribution Fixes

**Goal:** Fasts spanning midnight accurately attribute their full duration to the end day.
**Demo:** Visual UI components (recent fasts chart, week status strip, and stats view) display completed fasts under the day they ended, rather than splitting them or showing them under the start day.

## Must-Haves

- `recent-fasts-chart.tsx` uses end day attribution and correctly assigns ongoing fasts to the current day.
- `week-status-strip.tsx` uses `endTime` for matching days, and falls back to `isToday` for active fasts.
- `stats-view.tsx` groups weekly chart data and aggregates by `endTime`.

## Proof Level

- This slice proves: final-assembly
- Real runtime required: yes
- Human/UAT required: no

## Verification

- `npm run build` succeeds (verifying no TS errors introduced).
- UI assertions: Review components logic to ensure active fasts don't crash date-fns functions.

## Observability / Diagnostics

- Runtime signals: none (pure frontend mapping logic)
- Inspection surfaces: UI visual validation
- Failure visibility: none (runtime crashes prevented by conditional `f.endTime` checks)
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: `FastingRecord` array and `activeFast` from storage context
- New wiring introduced in this slice: none
- What remains before the milestone is truly usable end-to-end: nothing for fast duration logic.

## Tasks

- [x] **T01: Implement End Day Attribution for Fasting Data** `est:45m`
  - Why: The existing splitting logic causes false "failed" markers. All three components must transition to the new End Day Attribution model simultaneously to prevent mismatched numbers.
  - Files: `components/recent-fasts-chart.tsx`, `components/week-status-strip.tsx`, `components/stats-view.tsx`
  - Do: Remove `effectiveStart`/`effectiveEnd` splitting in `recent-fasts-chart.tsx`. Change day filtering to use `endTime` in all 3 components. Handle active fasts gracefully by attributing them to the current day (`isToday`). Ensure date functions receive valid Dates.
  - Verify: Next.js build passes. Code analysis confirms active fasts do not crash on missing `endTime`.
  - Done when: All three components use End Day Attribution, correctly handle active fasts, and typecheck successfully.

## Files Likely Touched

- `components/recent-fasts-chart.tsx`
- `components/week-status-strip.tsx`
- `components/stats-view.tsx`
