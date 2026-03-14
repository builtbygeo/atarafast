---
milestone: M002
slice: S01
task: T02
title: "Refactor Frontend Gating Components"
status: complete
observability_surfaces:
  - PremiumGate component props (reason, requirements)
  - StatsView gating state
---

## Summary
Refactored `PremiumGate` to accept `requirements` and `reason` props. Updated `StatsView` to use the new `PremiumGate` for the AI Coach gating logic, providing clearer user feedback (e.g., "5 fasts needed to unlock AI Coach") instead of generic "upgrade" prompts.

## Implementation Details
- Modified `PremiumGate` to handle `requirements` prop and render an `UpgradeCard` with a specific reason.
- Updated `StatsView` to wrap the locked AI Coach state in `PremiumGate` with specific requirement messaging.
- Maintained the existing premium functionality.

## Verification
- Code review of `PremiumGate` prop handling.
- Verified `StatsView` integration with `PremiumGate` for the AI Coach requirement (5 fasts).

## Diagnostics
- Inspect `PremiumGate` component in `components/premium-gate.tsx`.
- Check `StatsView` integration in `components/stats-view.tsx`.
- The `reason` prop is visible in React DevTools for debugging gating state.

## Observability
- Added `reason` prop to `PremiumGate` to make the purpose of the gate observable in the component tree.
- Logic is now more descriptive for debugging gating state.
