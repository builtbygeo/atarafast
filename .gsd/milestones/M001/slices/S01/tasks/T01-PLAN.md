---
estimated_steps: 4
estimated_files: 3
---

# T01: Implement End Day Attribution for Fasting Data

**Slice:** S01 — Fast Attribution Fixes
**Milestone:** M001

## Description

Refactor three key UI components (`recent-fasts-chart.tsx`, `week-status-strip.tsx`, and `stats-view.tsx`) to shift from Start Day Attribution (which incorrectly splits overnight fasts into two failed fasts) to End Day Attribution. A fast that ends on Tuesday morning gets all its hours logged under Tuesday. Active fasts are assigned to "Today" to ensure they still show up in the progress bar.

## Steps

1. In `components/recent-fasts-chart.tsx`:
   - Locate the `last7DaysData = useMemo` block.
   - Remove the existing logic that splits durations at midnight (`effectiveStart`, `effectiveEnd`).
   - For completed fasts, calculate total duration and add it to the calendar day matching `f.endTime`.
   - For active fasts, add the currently accumulated hours to the calendar day matching `isToday` (i.e. `i === 0` in the loop).

2. In `components/week-status-strip.tsx`:
   - Locate the `weekData = useMemo` block.
   - Change `isSameDay(new Date(f.startTime), date)` to `f.endTime && isSameDay(new Date(f.endTime), date)`.
   - Ensure the `isActive` check falls back properly (it should probably just check if it's "Today" `i === 0` to show the active fast progress).

3. In `components/stats-view.tsx`:
   - Locate the weekly chart grouping logic (`daysData.push` loop over `eachDayOfInterval`).
   - Change the grouping from `rStart` to `rEnd` so that the hours count towards the day the fast ends.
   - Update any `history.filter` or `.forEach` that assumes `startTime` determines the day of a completed fast.

4. Typecheck and verify:
   - Run `npm run typecheck` or `npm run build` to catch any `Date` related type errors.
   - Make sure `f.endTime` is always checked for existence before passing it to `new Date()`.

## Must-Haves

- [ ] All three components use `endTime` to assign total fast hours to a calendar day.
- [ ] Active fasts correctly render their elapsed hours on the current day (`isToday`).
- [ ] No `isSameDay` or date functions crash when `f.endTime` is undefined.

## Verification

- Code inspection reveals `f.endTime` checks before `isSameDay`.
- Run `npm run build` to ensure no new TS errors are introduced.

## Observability Impact

- Signals added/changed: None (UI calculation change).
- How a future agent inspects this: Read the output of `npm run build`.
- Failure state exposed: Type errors if `endTime` isn't properly wrapped/checked.

## Inputs

- `components/recent-fasts-chart.tsx`
- `components/week-status-strip.tsx`
- `components/stats-view.tsx`

## Expected Output

- `components/recent-fasts-chart.tsx` — End Day Attribution logic implemented.
- `components/week-status-strip.tsx` — Same.
- `components/stats-view.tsx` — Same.
