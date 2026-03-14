---
id: M001
provides:
  - Fixed fasting duration attribution (End Day logic)
  - Anti-spam notification suppression
  - Open source-ready AI models
  - Premium feature gating via environment variables
key_decisions:
  - End Day Attribution for fasting records
  - In-app greeting for late-returning users instead of push
  - Switched to free OpenRouter AI models
  - Centralized feature gating via NEXT_PUBLIC_ENABLE_PREMIUM
patterns_established:
  - End Day Attribution (Duration aggregation to completion day)
  - In-app notification gating (visibilityState checks)
  - Feature-gated component wrapping
observability_surfaces:
  - lib/features.ts
  - app/api/ai/analyze/route.ts
requirement_outcomes:
  - id: R001
    from_status: active
    to_status: validated
    proof: S01 verified total fast duration correctly attributed to completion day in stats UI.
  - id: R002
    from_status: active
    to_status: validated
    proof: S02 implemented visibilityState checks and late-greeting logic to suppress stale push notifications.
  - id: R003
    from_status: active
    to_status: validated
    proof: S03 migrated AI routes to free-tier OpenRouter models.
  - id: R004
    from_status: active
    to_status: validated
    proof: S03 implemented global feature gating via NEXT_PUBLIC_ENABLE_PREMIUM.
  - id: R005
    from_status: active
    to_status: validated
    proof: S03 sanitized .env.example and removed hardcoded secrets.
duration: ~6h
verification_result: passed
completed_at: 2026-03-14
---

# M001: Atara Open Source Transition

**Stabilized core fasting and notification logic while successfully migrating to a feature-gated, free AI-based open-source architecture.**

## What Happened

M001 stabilized the Atara PWA and prepared it for open-source distribution. 

Work began with **S01**, which refactored fast attribution to "End Day Attribution," ensuring fasts spanning midnight calculate accurately without splitting hours. This fixed major data integrity issues in daily averages.

**S02** tackled notification spam. By introducing `document.visibilityState` checks and an in-app "Late Greeting" modal, we eliminated delayed system push notifications and provided a better user experience for those reopening the app after a fast.

Finally, **S03** finalized the open-source transition. We replaced paid AI models with free-tier providers (`nvidia/nemotron-3-super-120b-a12b:free`) and implemented a feature-gating system (`lib/features.ts`) based on `NEXT_PUBLIC_ENABLE_PREMIUM` to safely hide Stripe/premium features. The repository was sanitized by providing a clean `.env.example`, completing the requirements for public release.

## Cross-Slice Verification

Success criteria were verified as follows:
1. **Midnight Attribution:** Verified in S01; averages correctly handle completion-day aggregation.
2. **Notification Spam:** Verified in S02; app state is checked on resume to suppress stale system push; late-returning users receive in-app greetings.
3. **Free AI:** Verified in S03; API routes updated to use the specified free-tier OpenRouter models.
4. **Stripe Gating:** Verified in S03; UI components (upgrade buttons, etc.) are wrapped in `PremiumGate` or gated via env flag.
5. **Clean .env:** Verified in S03; `.env.example` provides non-sensitive templates only.

## Requirement Changes

- R001: active → validated — S01 verified total fast duration correctly attributed to completion day.
- R002: active → validated — S02 implemented visibilityState checks and late-greeting logic to suppress stale push notifications.
- R003: active → validated — S03 migrated AI routes to free-tier OpenRouter models.
- R004: active → validated — S03 implemented global feature gating via NEXT_PUBLIC_ENABLE_PREMIUM.
- R005: active → validated — S03 sanitized .env.example and removed hardcoded secrets.

## Forward Intelligence

### What the next milestone should know
- Any new features involving billing or advanced AI must be gated using `PremiumGate` from `components/premium-gate.tsx`.

### What's fragile
- Feature gating logic is strictly applied at the component level; ensure future PRs include `PremiumGate` wrappers for new paid features.

### Authoritative diagnostics
- Check `lib/features.ts` for system-wide feature flag state.

### What assumptions changed
- Assumption: Stripe was required for basic user growth. Reality: For OS transition, removing paid barriers while keeping premium logic hidden/gated is the priority.

## Files Created/Modified

- `components/recent-fasts-chart.tsx` — Replaced effectiveStart/End splitting with endTime grouping.
- `components/week-status-strip.tsx` — Filter days by endTime, falling back to isToday for active fasts.
- `components/stats-view.tsx` — Aggregation logic updated to accumulate total hours under endTime.
- `hooks/use-notifications.ts` — Logic to check if a fast ended while the app was backgrounded and suppress system push.
- `components/timer-view.tsx` — In-app toast/alert logic for late-returning users.
- `lib/features.ts` — Central feature flag configuration.
- `app/api/ai/analyze/route.ts` — AI model routing updated to free tier.
- `components/premium-gate.tsx` — UI component for wrapping gated content.
- `.env.example` — Sanitized environment template.
