# T02: Refactor Frontend Gating Components

## Why
`components/premium-gate.tsx` is currently too simplistic.

## Files
- `components/premium-gate.tsx`
- `components/stats-view.tsx`

## Steps
1. Refactor `components/premium-gate.tsx` to accept `{ requirements: { minFasts?: number, maxDaily?: number } }` and display appropriate messages based on state.
2. Update `components/stats-view.tsx` to pass the required props to `PremiumGate`.
3. Verify the changes in a running development environment.
4. Run slice-level verification checks.

## Must-Haves
- No "Upgrade to Premium" wall for free users on Dashboard.
- Clear messages for AI quotas (1/day) and entry requirements (5 fasts).

## Verification
- Run local dev server.
- Click AI Coach. Observe the requirement/quota message.

## Expected Output
- UI reflects the status (quota/requirement) instead of just "upgrade".

## Observability Impact
- Component state will explicitly reflect quota status (e.g., `isQuotaReached`, `isRequirementNotMet`).
- UI will show descriptive messages instead of a generic "upgrade" button.
- Future agents can inspect these components and check props for debugging gating logic.
