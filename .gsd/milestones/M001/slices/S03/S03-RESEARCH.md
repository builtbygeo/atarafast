# S03-RESEARCH: Free AI & Feature Gating

## Overview
This slice implements cost-free AI model integration and feature gating for Atara to prepare the repository for open-source release.

## Requirements
- **R003:** Integration: Free AI Model
- **R004:** Architecture: Feature Flags (Stripe)
- **R005:** Security: Open Source Preparation

## Findings
- **AI Models:** `app/api/ai/analyze/route.ts` currently uses `google/gemini-2.5-flash` and `google/gemini-2.5-flash-lite`. Need to switch these to `nvidia/nemotron-3-super-120b-a12b:free` (primary) and `openrouter/free` (fallback).
- **Feature Gating:** Numerous components in `app/`, `components/`, and `lib/subscription.ts` use Stripe-related environment variables (`NEXT_PUBLIC_STRIPE_PRICE_ID`, `NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID`, `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID`).
- **Implementation Strategy:** Introduce a centralized gating mechanism (e.g., `features.ts` or similar utility) that respects `NEXT_PUBLIC_ENABLE_PREMIUM`.
- **Security:** Need to ensure all sensitive keys are removed from `.env.example`.

## Risks
- **Gating Coverage:** Need to be thorough in identifying all components that expose premium features to avoid leaking paid functionality in the open-source version.
- **Model Performance:** Switching from Gemini models to Nemotron needs verification in the context of the prompt provided in `app/api/ai/analyze/route.ts`.

## Deliverables
- [ ] Update `app/api/ai/analyze/route.ts` to use free models.
- [ ] Create/Update feature gating utility.
- [ ] Apply feature gating to all identified UI components.
- [ ] Clean `.env.example`.
