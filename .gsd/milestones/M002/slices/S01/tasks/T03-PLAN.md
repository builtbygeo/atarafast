# T03: E2E Verification of Quota

## Why
Ensures that the UI and backend logic are consistently working.

## Files
- `tests/e2e/quota.spec.ts`

## Steps
1. Create `tests/e2e/quota.spec.ts` to simulate a user session.
2. Implement test case: "Free user with < 5 fasts sees AI Coach gated".
3. Implement test case: "Free user with >= 5 fasts sees AI Coach limit of 1/day".
4. Run tests with `npm run test:e2e` to verify.

## Must-Haves
- Automated test coverage for the 5-fasts gating and 1/day limit.

## Observability Impact
- New E2E test suite provides automated failure signal on quota regression.
- Logs from `usage_log` events during test execution confirm API-side quota enforcement.

## Verification
- `npm run test:e2e`

## Expected Output
- A successful E2E test run.
