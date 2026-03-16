# S01 Research: AI Quota & Feature Democratization

## Research Scope
- Democratize AI and Dashboard features by replacing PremiumGate with usage quotas.
- AI usage quota: 1/day, requires 5 prior fasts.
- Features: Dashboard, AI Coach, Protocols.

## Findings
- **Implementation Status:** `lib/storage.ts` already contains `checkAiQuota(isPremium: boolean)`. It uses a monthly/weekly count.
- **Requirement Gap:** The roadmap specifies \"1/day\" (for everyone) and \"requiring 5 prior fasts\" (for AI). The current `checkAiQuota` does not factor in fast counts.
- **Subscription Logic:** `lib/subscription.ts` handles premium status via Clerk metadata/stripe status.
- **Frontend Gating:** `components/premium-gate.tsx` and `components/upgrade-dialog.tsx` seem to be the primary UI entry points for gating.
- **Dependencies:**
  - `lib/storage.ts` (data layer)
  - `lib/subscription.ts` (subscription state)
  - `components/stats-view.tsx` (AI Coach gating)
  - `components/premium-gate.tsx` (general feature gating)

## Risks
- Modifying `checkAiQuota` will affect existing logic. Need to carefully extend it to track fast counts.
- Need to ensure we don't accidentally lock out existing free users who should now have access (the goal is democratization, so access should increase).
- UI changes for removing \"Premium\" branding while keeping quota checks.

## Skill Discovery
- React: Standard in project.
- Next.js: Standard in project.
- Clerk: Standard for auth/metadata.
- Stripe: Used for premium status (to be replaced).

## Next Steps
- Implement `getFastCount()` in `lib/storage.ts` (or reuse existing logic).
- Update `checkAiQuota` to signature `checkAiQuota(isPremium: boolean, fastCount: number)`.
- Refactor frontend components to stop enforcing `isPremium` for everything, and start enforcing the new quota logic.
