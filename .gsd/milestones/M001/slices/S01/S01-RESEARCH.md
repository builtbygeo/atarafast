# S01: Fast Attribution Fixes — Research

**Date:** 2026-03-14

## Summary

The current implementation splits fast durations across midnight. If a user fasts from 20:00 on Monday to 12:00 on Tuesday (16 hours total), `recent-fasts-chart.tsx` calculates the duration strictly within calendar day boundaries (4 hours on Monday, 12 hours on Tuesday). Because both durations fall short of the 16-hour target, both days are marked with orange "failed" indicators, despite the user successfully completing a 16-hour fast.

To fix this, we will transition to an **"End Day Attribution"** model. Any completed fast will have its entire duration (e.g., all 16 hours) credited to the calendar day on which it ended (`endTime`). For an active, uncompleted fast, its currently accumulated duration should be attributed to the *current day* (today) as a placeholder for its eventual end day.

## Recommendation

We will update three core components to use End Day Attribution:
1. `components/recent-fasts-chart.tsx`
2. `components/week-status-strip.tsx`
3. `components/stats-view.tsx`

We must replace `startTime`-based day matching and boundary-splitting math with simple `endTime` matching, and calculate the full duration (`endTime - startTime`) for the day the fast ends. For active fasts, we will bind their display logic to `isToday` rather than the `startTime` of the active fast, so that ongoing fasts always show up on the current day's progress bar.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Date Math | `date-fns` (`isSameDay`, `startOfDay`) | Already heavily used throughout the application. Reliable and prevents timezone bugs. |

## Existing Code and Patterns

- `components/recent-fasts-chart.tsx` — Contains the most complex splitting logic inside `last7DaysData = useMemo(...)`. We need to rip out the `effectiveStart` / `effectiveEnd` logic entirely.
- `components/week-status-strip.tsx` — Filters by `isSameDay(new Date(f.startTime), date)`. Needs to change to `f.endTime`.
- `components/stats-view.tsx` — Weekly chart also groups by `rStart`. Needs to change to `rEnd`.

## Constraints

- PWA environments have limited local state persistence guarantees. Ensure we correctly check `f.endTime` existence before applying date math, as active fasts (`endTime: null` or `undefined`) will crash `date-fns` functions if passed blindly.
- Legacy records might have string-based timestamps; all date calculations must wrap `f.endTime` or `f.startTime` in a `new Date()` call.

## Common Pitfalls

- **Crashing on active fasts** — Active fasts have no `endTime`. If we map `f.endTime` directly to `isSameDay`, it will fail. *Avoid by:* Always filtering `if (!f.endTime) return false` before checking the end day, and handling active fasts via an explicit `isToday` check.
- **Inconsistent charting** — If we fix `recent-fasts-chart.tsx` but leave `stats-view.tsx` on the `startTime` model, the user's dashboard will show mismatched numbers. *Avoid by:* Migrating all three identified components together.

## Open Risks

- For fasts that last longer than 24 hours, attributing all hours to the end day might make the bar chart scale awkwardly (e.g., a 48-hour bar). However, since the chart sets `maxHours = Math.max(..., 24)`, it handles overflow visually.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| React | `frontend-design` | **Available** (`~/.gsd/agent/skills/frontend-design/SKILL.md`) |

## Sources

- PWA local chart rendering logic (source: `components/recent-fasts-chart.tsx`)
- Active component date associations (source: `components/week-status-strip.tsx` and `components/stats-view.tsx`)
