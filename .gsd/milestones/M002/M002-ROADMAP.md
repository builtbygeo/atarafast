---
id: M002
provides:
  - Unlocked Dashboard and AI features for all users
  - Weight tracking in the journal
  - Trend visualization in Info tab
key_decisions:
  - Democratization of AI/Stats via usage quotas
  - Compact UI for weight controls
  - Integration of weight into existing FastingRecord storage
patterns_established:
  - Usage-based limiting (instead of Feature Gating)
observability_surfaces:
  - lib/subscription.ts
requirement_outcomes:
  - id: R007
    from_status: active
    to_status: pending
    proof: Planned in S01.
  - id: R008
    from_status: active
    to_status: pending
    proof: Planned in S02.
  - id: R009
    from_status: active
    to_status: pending
    proof: Planned in S03.
duration: ~6h
verification_result: pending
completed_at: 
---

# M002: Atara Open Source Maturity

**Democratizing core features and personalizing insights.**

## Roadmap

**Vision:** Stabilize and expand the open-source version of Atara.

**Success Criteria:**
- All formerly "Premium" features (Dashboard, AI Coach, Protocols) are fully accessible to all users.
- AI Analysis is governed by usage quotas (1/day) and entry requirements (5 fasts) instead of Stripe status.
- Weight tracking is integrated into the Journal with +/- 1kg controls.
- Info Tab features a compact weight visualization chart without forcing vertical overflow.

## Slices

- [x] **S01: AI Quota & Feature Democratization** `risk:medium` `depends:[]`
  > After this: AI and Dashboard features are unlocked. AI usage is limited to 1/day, requiring 5 prior fasts.

- [ ] **S02: Weight Tracking Integration** `risk:low` `depends:[S01]`
  > After this: Journaling supports weight logging (+/- 1kg controls) and saves to local storage.

- [ ] **S03: Weight Trends Visualization** `risk:low` `depends:[S02]`
  > After this: Info Tab displays a compact weight trend line chart.

---
