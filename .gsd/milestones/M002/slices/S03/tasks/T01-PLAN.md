# T01: Weight Trend Chart Implementation

## Description
Create a compact line chart component to visualize weight trends from `FastingRecord` history and add it to the Info tab.

## Steps
1.  **Helper Logic:** Create `transformWeightData` in `lib/stats.ts` to filter and map `FastingRecord` to `{ date: string, weight: number }` objects.
2.  **Chart Component:** Create `components/weight-trends-chart.tsx`. Follow `WellbeingChart`'s visual pattern (responsive container, line chart, dark mode styling).
3.  **UI Integration:** Update Info tab UI (find the relevant file via `grep` or file structure) to include `WeightTrendsChart` below or above the current wellbeing charts.
4.  **Verification:** Check data flow, ensure chart renders with empty/sparse data, and confirm compact UI height.

## Must-Haves
- Compact UI (`h-[280px]` or similar constraint).
- Recharts implementation consistent with the existing app theme.
- Data handling for missing weight values (i.e., skip them).

## Verification
- Run local dev server (`bg_shell` or standard `npm run dev`) and visually inspect the Info tab.
- Assert weight data appears correctly if at least one entry has weight.
- Assert chart remains compact.

## Expected Output
- `lib/stats.ts` updated.
- `components/weight-trends-chart.tsx` created.
- Info tab shows weight trend line.

## Observability Impact
- Component handles empty data without runtime errors.
