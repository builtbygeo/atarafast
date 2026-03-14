# M001: Atara Open Source Transition — Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

## Intent
Stabilize the existing PWA application and prepare it for an open-source release (AtaraFast). The transition will fix critical bugs affecting both open and closed versions, switch the AI models to free alternatives via OpenRouter, and implement feature flags to hide premium/paid components in the open-source version.

## Key Constraints & Risks
- **Platform:** PWA only (no native apps). True background push notifications are inherently unreliable without FCM, as iOS aggressively suspends background JS timers.
- **Security:** Ensure no secrets, API keys, or proprietary billing logic leak into the open-source repository default state.
- **Data Integrity:** Fasting durations crossing midnight must be attributed entirely to the day the fast ends to avoid false "failed" markers and inaccurate averages.

## Implementation Decisions
- **AI Models:** Replace paid Gemini models with `nvidia/nemotron-3-super-120b-a12b:free` (primary) and `openrouter/free` (fallback) to ensure the open-source version is sustainable without API costs.
- **Fasting Attribution:** When calculating daily fasts (e.g., in `recent-fasts-chart.tsx`), a fast that spans multiple calendar days will have its total duration credited to the *end day* of the fast.
- **Notification UX:** Do not fire a delayed system push notification (spam) when the user reopens the app hours after a fast has ended. Instead, if the fast completed while the app was backgrounded/closed, show a graceful in-app greeting/alert ("Fast completed successfully!").
- **Feature Gating:** Introduce a `NEXT_PUBLIC_ENABLE_PREMIUM` environment variable (default `false`) to hide or mark Stripe/billing UI elements as "Coming Soon."

## Required Reading
- `components/recent-fasts-chart.tsx`: Contains the logic for the "Average Fasts" calculation.
- `lib/storage.ts`: Handles local storage of fasts and settings.
- `app/api/ai/analyze/route.ts`: Contains the OpenRouter API call.
- `components/timer-view.tsx` & `hooks/use-notifications.ts` & `public/sw.js`: Contains local notification logic.

## Acceptance Criteria
- [ ] Fasting averages correctly display the last 7 completed fasts without splitting duration across days.
- [ ] Reopening the app after a fast has ended does not trigger a system push notification, but rather an in-app acknowledgment.
- [ ] The AI analysis uses the new free OpenRouter models.
- [ ] Premium features (Stripe) are hidden or marked "Coming Soon" via an environment variable flag.
- [ ] A clean `.env.example` file is generated without actual keys.
