# Decisions Register

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001/Discuss | arch | Open Source State | Feature Flags | Allows keeping Stripe/premium code in the repo, but hidden/disabled for the public. | No |
| D002 | M001/Discuss | ux | Notifications on Wake | In-App Greeting | System push notifications are delayed by iOS PWA limitations. Preventing "spam" push and showing an in-app alert is a better UX for delayed sessions. | Yes — if native apps are built |
| D003 | M001/Discuss | ai | Open Source AI Model | `nvidia/nemotron-3-super-120b-a12b:free` | Sustainable for an open-source tool without API costs. Fallback: `openrouter/free`. | Yes — if performance degrades |
| D004 | M001/Discuss | logic | Fast Attribution | End Day | A fast spanning midnight (e.g., 20:00 to 12:00) will assign all 16 hours to the end day, preventing false "failed" markers. | No |
| D005 | M001/S03 | arch | Feature Gating | `NEXT_PUBLIC_ENABLE_PREMIUM` | Centralized feature flag environment variable to conditionally gate Stripe and premium features. | No |
