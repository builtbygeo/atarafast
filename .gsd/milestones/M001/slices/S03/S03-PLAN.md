# S03-PLAN: Free AI & Feature Gating

## Overview
Implement cost-free AI model integration and feature gating to prepare the repository for open-source release.

## Requirements
- R003: Integration: Free AI Model
- R004: Architecture: Feature Flags (Stripe)
- R005: Security: Open Source Preparation

## Slice-Level Verification
- Verify `app/api/ai/analyze/route.ts` uses free models (manual code check).
- Verify `NEXT_PUBLIC_ENABLE_PREMIUM=false` hides Stripe components (browser test).
- Verify `.env.example` has no sensitive keys (manual file check).
- Implement/verify failure-state handling for premium API routes (e.g., 403 response).

## Tasks
- [x] **T01: Feature Gating Utility & UI Cleanup** `est:2h`
  - why: Decouple premium features from core functionality.
  - files: [components/premium-gate.tsx, components/checkout-button.tsx, components/upgrade-dialog.tsx, lib/subscription.ts]
  - do: Create lib/features.ts, update lib/subscription.ts, wrap premium UI, hide upgrade buttons.
  - verify: Stripe components hidden/disabled when feature flag is off.
- [x] **T02: Free AI Integration & Security** `est:1h`
  - why: Implement free AI model support for open-source users.
  - files: [app/api/ai/analyze/route.ts, lib/ai.ts]
  - do: Implement free-tier AI routing, scrub sensitive keys from .env.example.
  - verify: Analyze endpoint functions without requiring premium keys.

## Observability / Diagnostics
- Implement log level checks for feature gate state (development logs).
- Monitor `NEXT_PUBLIC_ENABLE_PREMIUM` availability in client-side runtime.
- Verify feature flag application state in browser console during UAT.
- Validate error states (e.g., attempt to access premium route) return expected 403s.

## Proof Level
- Functional: UI gating logic and AI model routing are verified through local runtime testing and code inspection.

## Integration Closure
- Ensures open-source users don't encounter broken Stripe flows and don't require proprietary API keys for basic functionality.
