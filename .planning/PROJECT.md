# Atara

## What This Is

Atara is a minimalist, open-source intermittent fasting tracker — elegant and mobile-first. Users track fasting windows, view progress with streaks and stats, get AI-powered coaching insights, and participate in challenges and programs. Fully bilingual (EN/BG), privacy-first with localStorage, and PWA-capable.

## Core Value

A user can track, analyze, and improve their fasting practice through an intuitive, minimal interface that gets out of the way.

## Requirements

### Validated

- ✓ Fast tracking with timer UI, preset plans (12:12 through 20:4), and week strip — existing
- ✓ Fasting history/log with calendar heatmap and recent fasts list — existing
- ✓ Stats: streak tracking, weight trends, weekly activity chart, completion rate — existing
- ✓ AI coach insights via OpenRouter (gated behind 5-fast minimum, daily quota) — existing
- ✓ Challenges and badges system (13 challenges across streak, duration, milestone categories) — existing
- ✓ Active programs system (6 programs with progress tracking, start/abandon) — existing
- ✓ Educational content: fasting tips, health info, preset plan descriptions — existing
- ✓ Clerk authentication with free tier — existing
- ✓ Stripe payments (disabled via `NEXT_PUBLIC_ENABLE_PREMIUM=false`) — existing
- ✓ Bilingual support (English / Bulgarian) via React context — existing
- ✓ PWA: service worker, manifest, install prompts — existing
- ✓ Settings management — existing

### Active

- [ ] 3-tab bottom navigation: Today | Log | Progress (redesign from current 4-tab: Log | Info | Today | Plan)
- [ ] Active Programs moved from Info to Today tab (alongside timer)
- [ ] Educational content moved from Plan to Progress tab
- [ ] Challenges and AI coach remain in Progress tab
- [ ] Settings accessible via gear icon in Progress tab header
- [ ] 30-day history limit and "Unlock full history" banner hidden behind `ENABLE_PREMIUM` flag
- [ ] Visual polish: consistent spacing, typography, dark theme refinement, mobile UX

### Out of Scope

- New feature development — only reorganization and polish
- Premium/payment feature activation — code remains but stays behind `ENABLE_PREMIUM=false`
- Plan tab content beyond what's moved to Progress — no new educational content
- Backend/database migration — stays localStorage-only

## Context

- **Codebase:** Next.js 16 App Router, React 19, Tailwind CSS 4, shadcn/ui (new-york style), Clerk auth, Stripe
- **Architecture:** Dual-domain (landing at atarafast.com, app at app.atarafast.com), client-heavy SPA, no server DB
- **Current nav:** 4 tabs in bottom bar — Log (history), Info (stats+programs+challenges), Today (timer), Plan (educational)
- **Known issues:** "Unlock full history" banner shows even when premium is disabled; Info tab is overloaded; content placement doesn't match user mental model

## Constraints

- **Tech stack:** Next.js 16, React 19, Tailwind CSS 4, existing component system — no new dependencies
- **Design:** Elegant, minimalistic, modern, mobile-first — no desktop-only features
- **Scope:** Reorganization + visual polish only — no new functionality
- **Premium:** `ENABLE_PREMIUM=false` — all premium gates must be hidden, not removed (code stays for future use)
- **Language:** Bilingual (EN/BG) must be maintained — all new UI strings need translations

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 3-tab nav over 4-tab | User feedback: Info was overloaded, Plan didn't fit mental model | — Pending |
| Progress as 3rd tab name | Captures stats + challenges + learning — forward-looking | — Pending |
| Active Programs in Today | Naturally pairs with active timer: "what am I doing right now" | — Pending |
| Education in Progress | Learning resources alongside progress data — contextual | — Pending |
| Premium gate: hide, don't delete | Code stays for future monetization, no visible impact on free users | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-13 after initialization*
