# Capability Contract

**Project:** Atara (Open Source Transition)
**Scope:** Tracker, notifications, AI analysis, premium feature gating.

## Active

| ID | Title | Class | Status | Owner | Source |
|---|---|---|---|---|---|
| **R001** | Fix: Fasting Duration Calculation | Core | Active | M001/S01 | User |
| **R002** | Fix: Notification Logic | Core | Active | M001/S01 | User |
| **R003** | Integration: Free AI Model | Value-Add | Active | M001/S02 | User |
| **R004** | Architecture: Feature Flags (Stripe) | Platform | Active | M001/S02 | User |
| **R005** | Security: Open Source Preparation | Platform | Active | M001/S02 | User |

## Deferred

| ID | Title | Class | Status | Owner | Source |
|---|---|---|---|---|---|
| **R006** | Server-side Push Notifications (FCM) | Value-Add | Deferred | N/A | Inferred |

## Out of Scope

- Native iOS/Android apps (currently PWA only)
- Paid user management (hidden behind feature flags)

## Traceability

### R001: Fix Fasting Duration Calculation
- **Description:** Fasting times that cross midnight are currently split into two calendar days, causing incorrect average calculation and false "failed" markers.
- **Validation:** Total fast duration is assigned to the day the fast ends. Average is correctly calculated over the last 7 completed fasts.

### R002: Fix Notification Logic
- **Description:** Delayed execution of local notifications when the PWA is inactive. Prevent old/stale notifications from firing upon app resume.
- **Validation:** Notifications do not spam the user when the app is reopened hours after the fast ended.

### R003: Integration Free AI Model
- **Description:** Replace Gemini flash models with `nvidia/nemotron-3-super-120b-a12b:free` and backup `openrouter/free` to reduce operational costs.
- **Validation:** AI analysis returns results without requiring paid credits.

### R004: Architecture Feature Flags
- **Description:** Implement a generic `NEXT_PUBLIC_ENABLE_PREMIUM` (or similar) flag to hide Stripe UI components and payment flows in the open-source version.
- **Validation:** When `false`, Stripe buttons are hidden or disabled with a "Coming Soon" indicator.

### R005: Security Open Source Preparation
- **Description:** Ensure no secrets or API keys are hardcoded. Provide a `.env.example` file.
- **Validation:** The repository is clean of secrets and can be safely cloned and run locally.
