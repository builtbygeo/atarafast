# M001: Atara Open Source Transition

**Vision:** Stabilize the existing PWA application by fixing critical bugs in fast calculation and notification UX, and transition the project to an open-source friendly state by introducing feature flags for premium components and switching to free AI models.

**Success Criteria:**
- Fasts spanning midnight are attributed entirely to their end day in the log panel.
- Opening the app hours after a fast ends does not trigger a delayed system notification.
- AI analysis works using `nvidia/nemotron-3-super-120b-a12b:free` (and `openrouter/free` fallback).
- Stripe/Premium features are completely hidden behind a `NEXT_PUBLIC_ENABLE_PREMIUM=false` flag.
- A clean `.env.example` exists.

---

## Slices

- [x] **S01: Fast Attribution Fixes** `risk:medium` `depends:[]`
  > After this: Fasts spanning midnight (e.g., 20:00 to 12:00) will accurately show 16 hours for the end day instead of splitting the time, fixing the "failed" markers.

- [x] **S02: Notification UX (Anti-Spam)** `risk:high` `depends:[]`
  > After this: The PWA will no longer send a delayed system push notification when reopened hours after a fast ends. Instead, users will receive a graceful in-app greeting acknowledging their success.

- [x] **S03: Free AI & Feature Gating** `risk:low` `depends:[]`
  > After this: The AI analysis will use free OpenRouter models, and all Stripe/Premium UI elements will be hidden by default (or marked "Coming Soon" if visible), making the repository safe for open-source sharing.

---

## Boundary Map

### S01 → S02
Produces:
  `components/recent-fasts-chart.tsx` → Correctly calculated `last7DaysData` attributing hours to the `endDate`.

Consumes: nothing (leaf node)

### S02 → S03
Produces:
  `hooks/use-notifications.ts` → Logic to check if a fast ended *while* the app was backgrounded and suppress system push.
  `components/timer-view.tsx` → In-app toast/alert logic for late-returning users.

Consumes: nothing

### S03 → Done
Produces:
  `app/api/ai/analyze/route.ts` → Updated OpenRouter model configurations.
  `components/*` (e.g., `premium-gate.tsx`, `checkout-button.tsx`, `upgrade-dialog.tsx`) → Conditional rendering based on `NEXT_PUBLIC_ENABLE_PREMIUM`.
  `.env.example` → Clean environment variables.

Consumes from S01 & S02:
  Stable fast calculation and notification UX.
