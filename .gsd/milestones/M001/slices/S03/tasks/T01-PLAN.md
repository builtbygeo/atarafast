---
why: "To decouple premium features from core application functionality for open-source safety."
files:
  - "components/premium-gate.tsx"
  - "components/checkout-button.tsx"
  - "components/upgrade-dialog.tsx"
  - "lib/subscription.ts"
do:
  - Create a central `lib/features.ts` flag helper reading `NEXT_PUBLIC_ENABLE_PREMIUM`.
  - Update `lib/subscription.ts` to respect this flag.
  - Wrap premium-only UI components with `premium-gate.tsx` or inline conditional rendering.
  - Hide or rename "Upgrade" buttons in navigation and dashboards.
verify:
  - "Verify Stripe buttons are hidden/disabled when `NEXT_PUBLIC_ENABLE_PREMIUM=false`."
done_when: "All premium features are gated and the app functions correctly in 'free' mode."

## Steps
1. Create `lib/features.ts` to export `ENABLE_PREMIUM` boolean.
2. Refactor `lib/subscription.ts` to return `false` if `ENABLE_PREMIUM` is disabled.
3. Build `components/premium-gate.tsx` to handle conditional rendering.
4. Update navigation components to use `premium-gate.tsx` or conditional rendering.
5. Verify in browser with environment variable overrides.

## Observability Impact
- Feature gate state is observable via `process.env.NEXT_PUBLIC_ENABLE_PREMIUM`.
- Component rendering logic can be verified by inspecting the DOM for removed nodes.
- Unauthenticated premium attempts will be handled by UI-level gating.
---

# T01: Feature Gating Utility & UI Cleanup
