# S03 — Weight Trends Visualization — Research

**Date:** Saturday, March 14, 2026

## Summary
The goal is to implement a compact weight trend visualization in the Info tab, leveraging existing Recharts implementation patterns within the project. The work builds upon the `FastingRecord` data model, which now includes `weight`.

Primary recommendation is to create a dedicated, lightweight `WeightTrendsChart` component that consumes the user's `FastingRecord` history, mapping it to a time-series line chart format compatible with the project's existing Recharts implementation.

## Recommendation
- Create `components/weight-trends-chart.tsx`.
- Reuse the visual styling and Recharts wrappers found in `components/wellbeing-chart.tsx` to ensure visual consistency.
- Implement data transformation logic (likely in a new helper or within `lib/stats.ts`) that filters records with `weight` entries and sorts them by date for the chart.

## Don't Hand-Roll
| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Charting | `recharts` | Already integrated; consistent visual language established in `WellbeingChart`. |
| Data Persistence | `lib/storage.ts` | Source of truth for `FastingRecord` with weight history. |

## Existing Code and Patterns
- `lib/storage.ts` — Defines `FastingRecord` including the new optional `weight`.
- `components/wellbeing-chart.tsx` — Shows the current pattern for `ResponsiveContainer` and `LineChart` usage with custom styling for dark mode UI.

## Constraints
- The UI must remain compact to prevent vertical overflow (as specified in M002 requirements).
- Data source must be the local storage managed via `lib/storage.ts`.

## Common Pitfalls
- **Vertical Overflow:** Ensure the `ResponsiveContainer` is constrained appropriately, similar to `WellbeingChart`'s `h-[280px]` container.
- **Data Sparsity:** Many records may not have weight entries; ensure the chart component handles empty or sparse data gracefully without breaking the layout.

## Open Risks
- Performance on long history: If the history grows large, mapping data on every render might get expensive, though unlikely given local-only constraints for this PWA.

## Skills Discovered
| Technology | Skill | Status |
|------------|-------|--------|
| Recharts | none found | - |

## Sources
- Implementation patterns for Recharts (source: [Wellbeing Chart UI](components/wellbeing-chart.tsx))
