# S01: AI Quota & Feature Democratization

**Goal:** Democratize AI and Dashboard features by replacing PremiumGate with usage quotas (1/day) and entry requirements (5 prior fasts), ensuring all users have access.

**Demo:** A free user can access AI Coach and Dashboard features, but is limited to 1 AI usage per day, and the AI Coach is gated until 5 fasts are logged.

## Must-Haves
- `lib/storage.ts`: Implement `getFastCount()` and update `checkAiQuota` with the 1/day and 5-fasts logic.
- `components/premium-gate.tsx`: Remove hard `isPremium` gating for Dashboard/AI, replace with quota checks.
- `lib/subscription.ts`: Ensure `checkAiQuota` logic persists or gracefully degrades for free users.
- `components/premium-gate.tsx`: Update to support a "quota-reached" or "fast-count-insufficient" state instead of simple "upgrade" prompt.

## Verification
- `bash scripts/verify-quota.sh` (custom script checking the quota logic)
- Verify Dashboard loads for a user with 0 fasts (accessible, but AI Coach shows 5-fasts requirement).
- Verify AI Coach loads after 5 fasts, but limit usage to 1/day.

## Observability / Diagnostics
- Runtime signals: `usage_log` events for AI queries.
- Inspection surfaces: `quota_status` field in the user metadata/session.
- Failure visibility: UI error message when quota is reached or requirements not met.

## Tasks

- [x] **T01: Implement Quota and Fast Count Logic** `est:2h`
  - Why: The foundation of the new gating system; `checkAiQuota` needs to be intelligent about fasts and usage.
  - Files: `lib/storage.ts`
  - Do: Implement `getFastCount()`, update `checkAiQuota` to check `1/day` and `5 fasts`, and ensure existing premium status is considered (to not break premium users).
  - Verify: `ts-node scripts/verify-quota-logic.ts` (write this script)
  - Done when: `checkAiQuota` correctly returns `true/false` based on the new logic.

- [x] **T02: Refactor Frontend Gating Components** `est:2h`
  - Why: The UI currently uses `PremiumGate` which strictly requires premium status.
  - Files: `components/premium-gate.tsx`, `components/stats-view.tsx`
  - Do: Update `PremiumGate` to handle "quota" or "requirements" logic. Keep the `PremiumGate` name for compatibility but expand its capabilities.
  - Verify: `npm run dev` and manually check that the "Upgrade" wall is gone for Dashboard for a free user.
  - Done when: Free users can access the dashboard and see the requirement/quota messages for AI.

- [x] **T03: E2E Verification of Quota** `est:2h`
  - Why: Prove the logic works end-to-end for both a new user (0 fasts) and an experienced user.
  - Files: `tests/e2e/quota.spec.ts`
  - Do: Add E2E tests covering the 5-fasts requirement and 1-per-day quota.
  - Verify: Run playwright tests.
  - Done when: E2E tests pass for all quota/requirement scenarios.
