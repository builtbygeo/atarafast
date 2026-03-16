# S03: Weight Trends Visualization — UAT

**Milestone:** M002
**Written:** 2026-03-14

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: The slice implements a pure UI view component that depends on existing data helpers. Given the environment constraints, verification via component-level unit tests and structural code inspection is sufficient to guarantee the contract.

## Preconditions

1. Application is at a state where `FastingRecord` objects exist in local storage.
2. At least some records optionally contain the `weight` property (added in S02).

## Smoke Test

- Navigate to the Info tab and verify the presence of the `WeightTrendsChart` line chart component.

## Test Cases

### 1. Data Presence Rendering
1. Open the Info tab.
2. **Expected:** A line chart is rendered within an `h-[280px]` container.

### 2. Sparse Data Resilience
1. Navigate to Info tab with a dataset where < 20% of records have weight entries.
2. **Expected:** The chart handles the gaps in data gracefully, showing connected line segments or dots for known weight points without breaking the layout.

### 3. Empty Data Graceful State
1. Open the Info tab when no records contain weight data.
2. **Expected:** Component renders "No data available" message instead of an empty or broken SVG.

## Edge Cases

### Missing weight property in records
1. Ensure the `transformWeightData` helper filters out records where `weight` is undefined or null.
2. **Expected:** The chart only plots points for records that have valid weight entries.

## Failure Signals

- Console errors from `transformWeightData` when parsing malformed records.
- Missing chart container in the Info tab.
- Vertical layout overflow if the container exceeds `h-[280px]`.

## Requirements Proved By This UAT

- R009 — Proves that weight data is extracted and visualized correctly in the Info Tab.

## Not Proven By This UAT

- Long-term performance under extreme data volumes (thousands of records).
- Cross-browser rendering consistency on mobile devices (requires live device testing).

## Notes for Tester

- The chart is designed to be compact. If it looks "cramped" on very small screens, this is expected behavior given the `h-[280px]` constraint.
