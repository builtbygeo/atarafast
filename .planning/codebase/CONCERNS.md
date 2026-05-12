# Codebase Concerns

**Analysis Date:** 2026-05-12

## Tech Debt

**TypeScript type safety disabled:**
- Issue: `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, suppressing all TypeScript errors during build
- Files: `next.config.mjs`
- Impact: Type errors slip into production; `any` types proliferate unchecked; refactoring becomes dangerous
- Fix approach: Remove the override, fix existing errors incrementally by file, then re-enable strict checking

**Debug logging in production:**
- Issue: Extensive `console.log` statements remain in production code paths across multiple files
- Files: `components/stats-view.tsx` (lines 70, 113, 127, 156-157, 161), `lib/stats.ts` (lines 45, 52, 61), `lib/quota.ts` (line 22)
- Impact: Logs fill client console in production, leak internal state details, degrade perceived quality
- Fix approach: Remove all debug `console.log` statements; keep only `console.error` for actual errors; consider a structured logger with level-based filtering

**`any` type usage in API routes:**
- Issue: Catch blocks and metadata casting use `any` instead of properly typed interfaces
- Files: `app/api/ai/analyze/route.ts:69` (`catch (err: any)`), `app/api/ai/save-report/route.ts:26` (`catch (err: any)`), `app/api/stripe/checkout/route.ts:20` (`Record<string, any>`)
- Impact: Lost type safety in error handling and Stripe integration; potential runtime crashes from unchecked property access
- Fix approach: Type catch blocks as `unknown` with type guards; define proper interfaces for Clerk session claims metadata

**Local-storage-only data persistence:**
- Issue: All user data (fasting records, AI reports, settings, program progress) stored in a single `localStorage` key
- Files: `lib/storage.ts` (single key `STORAGE_KEY = "fasting-tracker-data"`)
- Impact: Data lost when user clears browser data; no cross-device sync; no backup; single key contains all data risking total loss on corruption
- Fix approach: Implement Supabase/PostgreSQL backend as noted in `STATE.md`; add periodic export prompts; perform incremental migration

**Giant translation file:**
- Issue: `lib/translations.ts` is 780 lines with inline translation objects; adding new strings requires editing this monolithic file
- Files: `lib/translations.ts`
- Impact: Merge conflicts on any localization change; hard to find and update specific strings; no separation between languages
- Fix approach: Split into `lib/translations/en.ts` and `lib/translations/bg.ts`; consider JSON-based i18n files

**Hardcoded fake data in UI:**
- Issue: Static percentage deltas displayed in weekly stats that don't reflect actual data
- Files: `components/stats-view.tsx:400` (`▲ +12%`), `components/stats-view.tsx:405` (`▲ +5%`)
- Impact: Misleading users with fabricated metrics; undermines trust in analytics
- Fix approach: Calculate actual deltas from historical data or remove the indicators until they can be computed

**Ad-hoc quota comments:**
- Issue: Comments in quota logic indicate iterative "for now" decisions without final design resolution
- Files: `lib/quota.ts:24` ("let's allow 1 per day instead of 1 per month as requested"), `lib/quota.ts:39-40` ("User said 'one per day for everyone'. Let's unify to 1 per day for everyone for now.")
- Impact: Ambiguous business rules; premium users don't actually get better AI quota
- Fix approach: Finalize quota design with distinct free/premium tiers, document in a spec, implement cleanly

## Known Bugs

**Broken/mismatched E2E test:**
- Symptoms: Test references UI elements that don't exist in the actual codebase
- Files: `tests/e2e/quota.spec.ts` — references `textarea`, `.response`, `.quota-error` selectors not present in `components/stats-view.tsx`; uses `button[aria-label="Stats"]` but actual tab has `aria-label` for history tab ("Stats" tab has `aria-label` set from translation key)
- Trigger: Running `npm run test:e2e` — test will fail to find elements
- Workaround: None; test is non-functional as written

**Stripe lifetime price fallback:**
- Symptoms: If `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID` env var is not set, the checkout route defaults to subscription pricing with `NEXT_PUBLIC_STRIPE_PRICE_ID`
- Files: `app/api/stripe/checkout/route.ts:18` (`body.priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!`)
- Trigger: User clicks lifetime purchase when env var is missing — gets charged subscription instead
- Workaround: Ensure both env vars are set in all environments

**AI report save race condition:**
- Symptoms: AI report is saved to localStorage immediately but Clerk metadata update is fire-and-forget (`fetch().catch(...)`)
- Files: `components/stats-view.tsx:207-211`
- Trigger: User generates AI report, then clears localStorage — report may be lost if Clerk update hasn't completed
- Workaround: None; report is only recoverable if Clerk update succeeded before clear

**Free user emails hardcoded in source:**
- Symptoms: Two personal email addresses hardcoded for free premium access
- Files: `lib/subscription.ts:60` — `["gag1000x@icloud.com", "atara.app.team@gmail.com"]`
- Trigger: These emails always get premium access regardless of Stripe status
- Workaround: Use env var `NEXT_PUBLIC_FREE_USERS` instead, which is also supported

## Security Considerations

**No rate limiting on API routes:**
- Risk: AI analysis endpoint can be called arbitrarily often (client-side quota is easily bypassed)
- Files: `app/api/ai/analyze/route.ts`, `app/api/stripe/checkout/route.ts`
- Current mitigation: Client-side quota counter in localStorage (trivially bypassed); Stripe checkout requires Clerk auth
- Recommendations: Add server-side rate limiting (e.g., Vercel KV or Upstash); validate client quota server-side; add CAPTCHA for AI endpoint

**No input validation on API routes:**
- Risk: AI analyze endpoint accepts arbitrary JSON body without schema validation — potential for prompt injection, oversized payloads
- Files: `app/api/ai/analyze/route.ts:5` (destructures `req.json()` without validation), `app/api/ai/save-report/route.ts:12`
- Current mitigation: None — all input is trusted
- Recommendations: Add Zod schemas for all API route inputs; validate `report` size limit; sanitize user-provided prompts

**No CSRF protection:**
- Risk: State-changing API routes (save-report) have no CSRF token verification
- Files: `app/api/ai/save-report/route.ts`
- Current mitigation: Clerk authentication cookie provides some protection
- Recommendations: Add CSRF token headers or use SameSite cookie attributes

**Non-null assertions on secrets:**
- Risk: `process.env.STRIPE_SECRET_KEY!` and `process.env.STRIPE_WEBHOOK_SECRET!` use non-null assertion — crash at runtime if missing
- Files: `app/api/stripe/webhook/route.ts:7,20`, `app/api/stripe/checkout/route.ts:7`
- Current mitigation: Webhook route catches errors, but checkout route doesn't validate
- Recommendations: Add explicit env var checks at module load; throw descriptive errors instead of undefined crashes

**Hardcoded personal emails in source code:**
- Risk: PII exposure for two individuals; anyone reading the source can identify privileged users
- Files: `lib/subscription.ts:60`
- Current mitigation: Also supports `NEXT_PUBLIC_FREE_USERS` env var
- Recommendations: Remove hardcoded emails entirely; use env var exclusively; consider admin panel instead

**Service worker with no update strategy:**
- Risk: `public/sw.js` has no versioning or cache-busting; stale SW can cause broken push notifications
- Files: `public/sw.js`
- Current mitigation: SW is minimal (just notifications), so risk is low
- Recommendations: Add version constant; implement skipWaiting + clientsClaim pattern; add SW update detection in app

## Performance Bottlenecks

**localStorage reads on every render:**
- Problem: `getSettings()`, `getHistory()`, `getActiveFast()` read and parse localStorage JSON synchronously on each render cycle
- Files: `components/stats-view.tsx:139` (`getSettings()` passed as prop), `components/timer-view.tsx` (multiple inline calls in render), `lib/storage.ts:84-99` (parses full JSON every read)
- Cause: Storage functions re-parse localStorage from string on every call instead of caching in memory
- Improvement path: Add in-memory cache layer with dirty flag; use `useMemo`/`useCallback` with storage as dependency; consider IndexedDB for large datasets

**Image optimization disabled:**
- Problem: `next.config.mjs` sets `images.unoptimized: true`, bypassing Next.js image optimization entirely
- Files: `next.config.mjs:6-8`
- Cause: Likely due to PWA/static export requirements
- Improvement path: Re-enable image optimization; use `next/image` with proper `loader` config; optimize hero images (`atarahero.webp`)

**1-second interval timer causing full re-renders:**
- Problem: `setInterval` at 1000ms in `components/timer-view.tsx:136-157` triggers `setNow` which cascades through timer display, progress circles, and all child components
- Files: `components/timer-view.tsx:136-157`
- Cause: `now` state updates every second, recomputing elapsed/remaining times and re-rendering SVG circles
- Improvement path: Use `requestAnimationFrame` for smooth animation; memoize time computations; use CSS animations for ring progress instead of JS-driven SVG

**Monolithic stats computation:**
- Problem: `components/stats-view.tsx` recalculates all statistics, challenges, and chart data in separate `useMemo` blocks each with `history` dependency
- Files: `components/stats-view.tsx:112-171` (stats), `components/stats-view.tsx:219-270` (weekly data), `components/stats-view.tsx:272` (challenges)
- Cause: All derived data recomputed even when only one section changes
- Improvement path: Split into separate components with their own memo boundaries; move stats calculation to a web worker for large histories

**`react-markdown` and `remark-gfm` in client bundle:**
- Problem: Markdown parsing libraries are bundled client-side and transpiled at build time
- Files: `next.config.mjs:9` (`transpilePackages` includes `react-markdown`, `remark-gfm`, `micromark-extension-gfm`)
- Cause: AI analysis formatting done client-side in `components/stats-view.tsx:96-109`
- Improvement path: Format AI output server-side at generation time; remove markdown libraries from client bundle

## Fragile Areas

**Entire app state in single localStorage key:**
- Files: `lib/storage.ts` — all data in one `"fasting-tracker-data"` key
- Why fragile: Single point of failure — one corrupted write loses all user data; no transaction safety; no migration path between data schema versions
- Safe modification: Add version tag to stored data; implement migration functions; always write to a staging key first, then swap atomically
- Test coverage: No unit tests for storage functions

**No error boundaries:**
- Files: No `error.tsx` or `global-error.tsx` in `app/` directory; no React error boundary components
- Why fragile: Any unhandled React error crashes the entire page to a blank screen
- Safe modification: Add `app/error.tsx` and `app/global-error.tsx` with user-friendly recovery UI; wrap data-dependent sections in error boundaries
- Test coverage: Not testable without error boundary in place

**Onboarding flow with magic strings:**
- Files: `components/onboarding-flow.tsx` — experience and goal options are hardcoded strings; plan recommendations use hardcoded string matching
- Why fragile: Adding new options or plans requires editing multiple switch/if blocks; typos in string matching silently default to wrong plan
- Safe modification: Extract options to a typed config object; use enum or union types instead of string matching; add unit tests for recommendation logic
- Test coverage: None

**Stripe API version `2026-02-25.clover`:**
- Files: `app/api/stripe/checkout/route.ts:8`, `app/api/stripe/webhook/route.ts:8`
- Why fragile: This appears to be a Stripe preview/beta API version; may be unstable or deprecated without notice
- Safe modification: Pin to a stable Stripe API version (e.g., `2025-03-31.basil`); test webhook signature verification with current version

**AI model fallback chain:**
- Files: `app/api/ai/analyze/route.ts:27-61`
- Why fragile: Hardcoded primary model (`nvidia/nemotron-3-super-120b-a12b:free`) and fallback (`openrouter/free`) — both are free-tier models on OpenRouter that may change or be rate-limited
- Safe modification: Make model names configurable via env vars; add timeout to each model request; implement proper retry with exponential backoff

**Single Playwright test with no CI integration:**
- Files: `tests/e2e/quota.spec.ts` (only test), `playwright.config.ts` (uses placeholder cookie)
- Why fragile: Only E2E test is broken (see Known Bugs); no unit or integration test coverage; impossible to refactor safely
- Safe modification: Fix existing E2E test first; add unit tests for `lib/storage.ts`, `lib/quota.ts`, `lib/stats.ts`; add CI workflow
- Test coverage: ~0% — one broken E2E test

## Scaling Limits

**localStorage quota:**
- Current capacity: ~5-10MB per origin (browser-dependent)
- Limit: With extensive fasting history, journal entries, and AI reports, localStorage can fill up
- Scaling path: Migrate to IndexedDB for large datasets as intermediate step; Supabase for cloud sync

**Single-user, single-device architecture:**
- Current capacity: One user per browser instance
- Limit: No multi-device sync; no family/group plans; no coach/client sharing
- Scaling path: Supabase backend with real-time subscriptions; Clerk organization support for groups

**AI analysis latency:**
- Current capacity: Sequential requests to OpenRouter with 3+ second onboarding animation
- Limit: No request queuing; no caching of AI responses; each analysis is a full round trip
- Scaling path: Cache AI responses by user+stats hash; add request deduplication; provide streaming responses

## Dependencies at Risk

**Next.js 16.1.6:**
- Risk: Very new major version (released 2026); potential instability in middleware, routing, or React 19 integration
- Impact: Production crashes from framework bugs; limited community support for troubleshooting
- Migration plan: Pin to minor version; test thoroughly on staging before upgrading; monitor Next.js GitHub issues

**Stripe API version `2026-02-25.clover`:**
- Risk: Preview/beta API version; may have breaking changes or be removed
- Impact: Stripe checkout and webhook handling could break silently
- Migration plan: Migrate to stable `2025-03-31.basil` API version; test all webhook events in Stripe test mode

**OpenRouter free-tier models:**
- Risk: Free models can be removed, rate-limited, or changed without notice
- Impact: AI coaching feature stops working entirely
- Migration plan: Add paid model fallback; monitor OpenRouter status; consider direct OpenAI/Anthropic integration as alternative

**`@clerk/nextjs` v7:**
- Risk: Major version change; middleware API and `clerkClient()` patterns may evolve
- Impact: Authentication breaks; user metadata updates fail
- Migration plan: Review Clerk changelog before upgrades; test auth flows and webhook handling after each update

## Missing Critical Features

**Data backup/export scheduling:**
- Problem: Users can manually export JSON but have no automatic backup
- Blocks: Users risk losing all data on browser clear or device switch

**Offline resilience:**
- Problem: Service worker exists for notifications but not for offline data access
- Blocks: App is non-functional without internet for auth; no offline-fast capability

**Automated test suite:**
- Problem: No unit tests, no CI pipeline, one broken E2E test
- Blocks: Safe refactoring; confident deployments; catching regressions

**Input validation layer:**
- Problem: API routes accept unvalidated JSON; no request size limits; no schema enforcement
- Blocks: Security hardening; preventing malformed data from corrupting storage

## Test Coverage Gaps

**Storage layer (untested):**
- What's not tested: All `lib/storage.ts` functions — data loading, saving, migrations, edge cases with corrupted JSON
- Files: `lib/storage.ts`
- Risk: Data corruption bugs go undetected; users lose fasting history
- Priority: High

**Quota logic (untested):**
- What's not tested: `lib/quota.ts` — daily reset, month boundary, premium vs free paths
- Files: `lib/quota.ts`
- Risk: Users incorrectly blocked from AI features; premium users treated as free
- Priority: High

**Streak calculation (untested):**
- What's not tested: `lib/stats.ts` `calculateStreaks()` — timezone edge cases, leap days, gaps in fasting
- Files: `lib/stats.ts`
- Risk: Incorrect streak counts displayed; challenges incorrectly locked/unlocked
- Priority: High

**Program/challenge evaluation (untested):**
- What's not tested: `lib/programs.ts` `evaluateProgram()`, `lib/challenges.ts` `calculateChallenges()`
- Files: `lib/programs.ts`, `lib/challenges.ts`
- Risk: Program progress tracking bugs; badges awarded incorrectly
- Priority: Medium

**API routes (untested):**
- What's not tested: All three API routes — auth checks, error handling, Edge cases
- Files: `app/api/ai/analyze/route.ts`, `app/api/ai/save-report/route.ts`, `app/api/stripe/checkout/route.ts`, `app/api/stripe/webhook/route.ts`
- Risk: API errors surface as poor UX; Stripe integration failures go unnoticed until production
- Priority: High

---

*Concerns audit: 2026-05-12*
