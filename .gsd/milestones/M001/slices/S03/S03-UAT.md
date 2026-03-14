# S03: Free AI & Feature Gating — UAT

**Milestone:** M001
**Written:** 2026-03-14

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: The slice relies on environment flag state and conditional API routing logic, which must be verified in the actual running environment to confirm that UI elements are hidden and AI endpoints function correctly with the free model.

## Preconditions

- Atara PWA is built and running locally.
- `NEXT_PUBLIC_ENABLE_PREMIUM=false` is set in the local environment.
- No real Stripe or proprietary API keys are present in `.env`.

## Smoke Test

- Confirm no "Upgrade to Premium" or Stripe-related buttons appear in the UI while `NEXT_PUBLIC_ENABLE_PREMIUM=false`.

## Test Cases

### 1. Feature Gating UI Verification
1. Navigate to Settings page.
2. Observe for the absence of "Upgrade to Premium" or "Manage Subscription" buttons.
3. **Expected:** These UI elements are hidden or rendered as "Coming Soon" placeholders.

### 2. Free AI Analysis Verification
1. Perform an action that triggers AI analysis (e.g., analyze fast).
2. Check the browser network tab for the `/api/ai/analyze` request.
3. **Expected:** The request completes successfully; code inspection verifies the use of free-tier model identifiers.

### 3. Environment Variable Sanitization
1. Inspect the local `.env` file (or ensure `process.env` does not contain sensitive keys).
2. **Expected:** No hardcoded API keys are present in `.env.example`.

## Edge Cases

### Accessing Gated Content via URL
1. Manually navigate to a premium-only route (e.g., `/checkout` or `/upgrade`).
2. **Expected:** User is redirected or presented with a "Not Available" / "Coming Soon" view, not the actual payment flow.

## Failure Signals
- "Upgrade" buttons appear in the UI while the flag is false.
- AI analysis fails with 401/403 or demands a premium key.
- Sensitive API keys are required to run the application locally.

## Requirements Proved By This UAT
- R003 — Free AI Model integration functions without paid keys.
- R004 — Stripe UI components are hidden/gated.
- R005 — Environment setup is clean and secret-free.

## Not Proven By This UAT
- Backend-level enforcement of premium content (only UI is gated).

## Notes for Tester
- If you see any premium-branded buttons, ensure `NEXT_PUBLIC_ENABLE_PREMIUM` is explicitly `false` in your `.env`.
