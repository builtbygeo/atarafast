# T04: Debug and Restore Stats and Analytics

## Goal
Fix data loading and visualization bugs in the Log and Info tabs, including weight retrieval in the journal, streak calculations, and statistical charts.

## Tasks
- [ ] **T01: Journal Weight Loading** `est:1h`
  > Update `JournalDialog` to fetch and pre-fill the most recently recorded weight from history.
- [ ] **T02: Streak & Weekly Activity Debugging** `est:1.5h`
  > Debug `calculateStreaks` and `weeklyData` logic in `StatsView` to ensure accurate streak counts and activity charts.
- [ ] **T03: Weight Trends & AI Analysis Restoration** `est:1.5h`
  > Fix the data pipeline for `WeightTrendsChart` and re-enable `AI Coach` visibility in the Info tab by ensuring the `PremiumGate` correctly evaluates the new non-premium access conditions.
- [ ] **T04: UAT & Validation** `est:1h`
  > Verify all stats calculate correctly and AI analysis generates with valid history data.

## Observability Surfaces
- `lib/stats.ts`: Streak and chart data transformation logic.
- `lib/storage.ts`: Data fetching and filtering.
- `components/stats-view.tsx`: UI data binding and gating.

## Decisions
- Logic over UI: Prioritize correct data transformation in `lib/stats` before styling.
