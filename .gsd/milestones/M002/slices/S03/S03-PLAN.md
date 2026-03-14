# S03: Weight Trends Visualization Plan

## Goal
Implement a compact weight trend visualization in the Info tab, building on existing Recharts patterns.

## Slice-Level Verification
- **UAT:** Navigate to Info tab; verify presence of a line chart showing weight history.
- **Contract:** Verify chart component correctly handles sparse data (records without weight entries).
- **Styling:** Verify container height is `h-[280px]` (or similar compact constraint) to prevent vertical overflow.
- **Diagnostics:** Verify chart fails gracefully with an observable state (e.g., "No data available" message) when weight records are missing.

## Observability / Diagnostics
- **Runtime:** Component logs data-parsing errors (excluding secrets).
- **State:** Component exposes empty/loading/error states observable in browser console or via accessibility tree.
- **Redaction:** No PII logged or exposed in UI debug outputs.

## Tasks
- [x] **T01: Weight Trend Chart Implementation** `est:2h`
  > Create `components/weight-trends-chart.tsx`, data helper in `lib/stats.ts`, and integrate into Info tab.

---
[x] T01: Weight Trend Chart Implementation
