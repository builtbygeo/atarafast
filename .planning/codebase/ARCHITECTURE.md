<!-- refreshed: 2026-05-12 -->
# Architecture

**Analysis Date:** 2026-05-12

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│                     (Next.js App Router)                     │
├──────────────────┬──────────────────┬───────────────────────┤
│  Landing Pages   │  Dashboard (PWA) │    API Routes         │
│  `app/page.tsx`  │ `app/app/page.tsx`│ `app/api/`           │
│  `app/blog/`     │                   │                       │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic                          │
│  `lib/storage.ts`  `lib/stats.ts`  `lib/quota.ts`           │
│  `lib/presets.ts`  `lib/challenges.ts`  `lib/programs.ts`   │
│  `lib/subscription.ts`  `lib/features.ts`                   │
└────────┬─────────┴────────┬─────────┴──────────────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Client Storage   │   External APIs    │   Auth Provider    │
│  `localStorage`   │  OpenRouter / Stripe│  Clerk             │
└───────────────────┴────────────────────┴────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| **RootLayout** | Theme provider, Clerk auth, language context, Vercel Analytics | `app/layout.tsx` |
| **LandingPage** | Marketing landing page with feature/price sections | `app/page.tsx` |
| **Dashboard** | Main app shell: tab navigation, state coordination across timer/history/stats/plan views | `app/app/page.tsx` |
| **TimerView** | Active fast timer display, start/end/delete fast, phase progress visualization | `components/timer-view.tsx` |
| **HistoryView** | Past fasts list with edit/delete, calendar view | `components/history-view.tsx` |
| **StatsView** | Streaks, completion rate, weekly activity charts, challenges, AI coach access | `components/stats-view.tsx` |
| **PlanView** | Educational content about fasting protocols | `components/plan-view.tsx` |
| **Storage** | CRUD for fasting records, settings, AI usage, programs — persisted to `localStorage` | `lib/storage.ts` |
| **Subscription** | React hook reading Clerk metadata for plan/status, Stripe checkout redirect | `lib/subscription.ts` |
| **Middleware** | Domain routing (landing vs app subdomain), auth protection, internal rewrites | `middleware.ts` |
| **AI Analyze API** | Proxies fasting data to OpenRouter for AI-generated coaching insights | `app/api/ai/analyze/route.ts` |
| **AI Save Report API** | Persists AI report to Clerk user metadata | `app/api/ai/save-report/route.ts` |
| **Stripe Checkout API** | Creates Stripe Checkout session for subscriptions/one-time payments | `app/api/stripe/checkout/route.ts` |
| **Stripe Webhook API** | Handles Stripe events, updates Clerk user metadata with subscription status | `app/api/stripe/webhook/route.ts` |

## Pattern Overview

**Overall:** Next.js 16 App Router SPA (PWA) — a client-heavy progressive web app with server-rendered landing and blog pages.

**Key Characteristics:**
- **Dual-domain architecture**: landing at `atarafast.com` (server-rendered), app at `app.atarafast.com` (client SPA), with middleware-based routing
- **Client-side state**: all user data in `localStorage` as a single JSON blob — no server-side database
- **Auth-gated with free tier**: Clerk authentication via middleware, 14-day clock trial for premium features
- **AI integration**: OpenRouter-proxied AI coaching with daily quota for free users
- **Stripe payments**: subscription and one-time (lifetime) purchase flows, webhook-synced to Clerk metadata
- **Bi-lingual**: full Bulgarian and English translations via React context
- **PWA-first**: service worker, manifest, install prompts, offline-capable

## Layers

**Presentation Layer:**
- Purpose: Page rendering, routing, user interaction
- Location: `app/` (pages), `components/` (shared components)
- Contains: Next.js pages (server & client), UI components, layout wrappers
- Depends on: Business Logic Layer, Component Layer
- Used by: N/A (top layer)

**Component Layer:**
- Purpose: Reusable UI components — shadcn/ui primitives (Radix-based), domain-specific components
- Location: `components/ui/` (57 shadcn/ui components), `components/` (28 domain components)
- Contains: Button, Dialog, Form, Charts, Timer views, Stats views, Preset grids
- Depends on: Business Logic Layer (via hooks and lib imports)
- Used by: Presentation Layer

**Business Logic Layer:**
- Purpose: Pure logic — fasting math, stats computation, challenge evaluation, program progression, AI quota checking
- Location: `lib/` (13 modules)
- Contains: `storage.ts` (data persistence), `stats.ts` (streak/weight calculations), `challenges.ts` (badge system), `programs.ts` (multi-day programs), `quota.ts` (AI rate limiting), `presets.ts` (fasting protocols), `subscription.ts` (Clerk metadata reader)
- Depends on: None (internal only, uses `date-fns` for date math)
- Used by: Component Layer, API Layer

**API Layer:**
- Purpose: Server-side endpoints for AI analysis, Stripe checkout/webhook, AI report saving
- Location: `app/api/` (2 subdirectories: `ai/`, `stripe/`)
- Contains: 4 route handlers
- Depends on: Clerk SDK, Stripe SDK, OpenRouter HTTP API (direct fetch)
- Used by: Presentation Layer (client components call these endpoints)

**Data Layer:**
- Purpose: Persistent storage
- Location: Browser `localStorage` (single `"fasting-tracker-data"` key)
- Contains: `StoredData` interface: active fast, history array, settings, AI usage, active program, badges
- Used by: Business Logic Layer (`lib/storage.ts`)

## Data Flow

### Primary Request Path (Dashboard App)

1. Request hits middleware (`middleware.ts:14-56`) — determines landing vs app domain, protects app routes with Clerk auth, rewrites `/` → `/app` for the app subdomain
2. RootLayout renders (`app/layout.tsx:45-79`) — wraps children with ClerkProvider, ThemeProvider, LanguageProvider
3. Dashboard page mounts (`app/app/page.tsx:22`) — "use client" component, reads from localStorage, renders tabbed UI
4. Component interaction: state managed via `useState` in the dashboard page; shared state flows through props (e.g., `history`, `refreshHistory` callback)
5. Data mutation: calls to `lib/storage.ts` functions (e.g., `startFast()`, `endFast()`) write to `localStorage`, then `refreshHistory()` re-reads to update React state

### AI Coaching Flow

1. User triggers AI analysis from `StatsView` (`components/stats-view.tsx`)
2. Quota checked via `lib/quota.ts:checkAiQuota()` — free users limited to 1/day
3. Client POSTs fasting history, stats, journals to `POST /api/ai/analyze` (`app/api/ai/analyze/route.ts:3`)
4. Server forwards to OpenRouter API with system prompt and user data (`app/api/ai/analyze/route.ts:30`)
5. Response streamed back to client, displayed as coach insights
6. Client optionally calls `POST /api/ai/save-report` (`app/api/ai/save-report/route.ts:5`) to persist report to Clerk user metadata

### Stripe Payment Flow

1. User clicks upgrade → `startCheckout()` (`lib/subscription.ts:85-95`) calls `POST /api/stripe/checkout`
2. Checkout route (`app/api/stripe/checkout/route.ts:5`) creates Stripe Checkout session with `clerkUserId` in metadata
3. User completes payment on Stripe-hosted page → redirected to `?payment=success`
4. Stripe sends `customer.subscription.created` event to webhook (`app/api/stripe/webhook/route.ts:5`)
5. Webhook updates Clerk user `publicMetadata` with `plan: 'premium'`, `subscriptionStatus`, `stripeCustomerId`
6. `useSubscription()` hook (`lib/subscription.ts:12`) reads updated Clerk metadata on next render

### Domain Routing (Middleware)

1. Host detection: `host.startsWith('app.')` → app subdomain (`middleware.ts:19-23`)
2. Landing domain (`atarafast.com`): `/app` paths redirect externally to `app.atarafast.com` (`middleware.ts:28-30`)
3. App domain (`app.atarafast.com`): `/app` paths redirect to `/` internally, `/` rewrites to `/app` page (`middleware.ts:37-53`)
4. Auth protection: all app routes require Clerk auth except sign-in, sign-up, webhook, terms, privacy (`middleware.ts:43-45`)

**State Management:**
- **Client global state**: React Context for Language (`lib/language-context.tsx`), Theme (next-themes), Auth (ClerkProvider)
- **Persisted state**: `localStorage` under key `"fasting-tracker-data"` — single JSON blob loaded/saved on each operation
- **Server state**: Clerk user metadata (publicMetadata: plan, subscriptionStatus, stripeCustomerId, lastAiReport) — the only server-side user data storage

## Key Abstractions

**FastingRecord:**
- Purpose: Represents a single fast — active or completed
- Examples: `lib/storage.ts:14-25`, used across `components/timer-view.tsx`, `components/history-view.tsx`, `lib/stats.ts`
- Pattern: Discriminated by `completed` boolean and nullable `endTime`; includes optional `journalData` and `weight`

**AppSettings:**
- Purpose: User preferences — timer direction, visual style, notification/journal toggles, onboarding state, dev premium toggle
- Examples: `lib/storage.ts:36-44`
- Pattern: Merged with defaults on load; partial updates via spread

**FastingPreset:**
- Purpose: Predefined fasting protocols (12:12, 14:10, 16:8, 18:6, 20:4 + custom)
- Examples: `lib/presets.ts:1-58`
- Pattern: Static array of objects with id, name, fastHours, eatHours, color; looked up by id

**Translation/LanguageContext:**
- Purpose: Bi-lingual i18n (English/Bulgarian) with auto-detection and localStorage persistence
- Examples: `lib/translations.ts:1-780` (translations), `lib/language-context.tsx:1-50` (context and provider)
- Pattern: Single `Translation` type with all UI strings; consumed via `useLang()` hook returning `{ t, lang, setLang }`

**Challenge System:**
- Purpose: Gamification — streak badges, duration milestones, total fast counts
- Examples: `lib/challenges.ts:1-82`
- Pattern: Static `CHALLENGES` array → `calculateChallenges(history)` computes unlocked/progress state

**FastingProgram:**
- Purpose: Multi-day structured programs (e.g., "7 consecutive days of 16h")
- Examples: `lib/programs.ts:1-105`
- Pattern: Static `PROGRAMS` array → `ActiveProgramState` in localStorage tracks progress → `evaluateProgram()` after each fast end

**Article (Blog):**
- Purpose: Blog post data with bilingual content, SEO metadata, and FAQ
- Examples: `types/blog.ts:1-31`, `lib/blog-data.ts`
- Pattern: Static array of Article objects; rendered via dynamic `[slug]` route

## Entry Points

**Landing Page:**
- Location: `app/page.tsx`
- Triggers: Visit to `atarafast.com` (root domain)
- Responsibilities: Marketing page with hero, features, pricing, FAQ, blog links; launches app via `/app` link or `app.atarafast.com`

**Dashboard (PWA App):**
- Location: `app/app/page.tsx`
- Triggers: Visit to `app.atarafast.com` (or `/app` in dev), middleware rewrites `/` → `/app`
- Responsibilities: Full fasting tracker UI with tabs for timer, history, stats, plan; onboarding flow; journal dialog; settings

**Blog Post:**
- Location: `app/blog/[slug]/page.tsx` (EN), `app/bg/blog/[slug]/page.tsx` (BG)
- Triggers: Direct URL, SEO, links from landing page
- Responsibilities: Server-rendered blog with Markdown content, SEO metadata, FAQ sections

**AI Analyze API:**
- Location: `app/api/ai/analyze/route.ts`
- Triggers: Client POST request from AI coach component
- Responsibilities: Accepts fasting data, forwards to OpenRouter, returns AI-generated coach analysis

**Stripe Checkout API:**
- Location: `app/api/stripe/checkout/route.ts`
- Triggers: Client POST from upgrade/premium prompts
- Responsibilities: Creates Stripe Checkout or Billing Portal session, returns redirect URL

**Stripe Webhook API:**
- Location: `app/api/stripe/webhook/route.ts`
- Triggers: Stripe event delivery
- Responsibilities: Validates webhook signature, syncs subscription status to Clerk user metadata

**AI Save Report API:**
- Location: `app/api/ai/save-report/route.ts`
- Triggers: Client POST after AI analysis
- Responsibilities: Auth-checked save of AI report string to Clerk `publicMetadata.lastAiReport`

## Architectural Constraints

- **Threading:** Single-threaded event loop (Next.js API routes and SSR). No worker threads. Timer accuracy depends on client-side `setInterval`.
- **Global state:** `localStorage` accessed directly by all lib functions — no mutex or lock mechanism. Concurrent React state updates from storage reads.
- **Circular imports:** Not detected
- **Data persistence:** All user data is client-only `localStorage`. No server-side database. Data lost if browser storage is cleared. No cross-device sync. Clerk metadata is the only server-persisted user data (plan, stripe customer ID, last AI report).
- **Build:** TypeScript build errors are ignored (`ignoreBuildErrors: true` in `next.config.mjs`). Image optimization disabled (`unoptimized: true` for static export compatibility).

## Anti-Patterns

### localStorage as Sole Data Store

**What happens:** All fasting records, settings, AI usage stats live exclusively in browser `localStorage` under a single key. `export/import` functions exist for manual backup but no automatic sync.
**Why it's wrong:** Data is fragile — clearing browser data destroys all user history. No cross-device sync despite "Cloud sync across devices" being listed as a premium feature (marked "coming soon").
**Do this instead:** Implement a server-side database (e.g., Supabase, PlanetScale) with client-side cache. Use Clerk `userId` as the foreign key. Keep localStorage as offline cache only.

### TypeScript Build Errors Ignored

**What happens:** `next.config.mjs` sets `typescript.ignoreBuildErrors: true`.
**Why it's wrong:** Type errors slip through to production. The codebase loses TypeScript's safety net.
**Do this instead:** Fix outstanding type errors, then remove the `ignoreBuildErrors` flag.

### Inline Stripe Initialization in Route Handlers

**What happens:** Stripe client is instantiated inside the handler function (`new Stripe(...)` at `app/api/stripe/checkout/route.ts:7` and `app/api/stripe/webhook/route.ts:7`) with a comment "avoids build-time issues."
**Why it's wrong:** No module-level singleton means a new Stripe client per request. Minor inefficiency; worse, it suggests Stripe env vars may be missing at build time.
**Do this instead:** Initialize at module scope with a guard for the build phase, or use Next.js `process.env` with proper build-time handling.

### Dual env var name for AI API key

**What happens:** `app/api/ai/analyze/route.ts:6` checks `process.env.OPENROUTER_API_KEY || process.env.Open_Router_API` — two different naming conventions.
**Why it's wrong:** Inconsistent naming suggests incomplete migration. The second name (`Open_Router_API`) uses an unconventional casing.
**Do this instead:** Standardize on `OPENROUTER_API_KEY` and remove the fallback.

### Ignored Completed Fasts in Program Evaluation

**What happens:** `lib/programs.ts` `evaluateProgram()` returns `{ status: "ignore" }` for non-completed fasts (`programs.ts:44-46`). However, `endFast()` in `storage.ts:148` marks a fast as `completed` only if `hoursElapsed >= targetHours`. If the user ends early, the fast is `completed: false` — the program silently ignores it with no user feedback.
**Why it's wrong:** Users in active programs get no indication that their early-ended fast doesn't count toward program progress.
**Do this instead:** Surface a notification when an in-progress program's fast ends prematurely, explaining the hours requirement.

## Error Handling

**Strategy:** Try/catch with JSON error responses for API routes. Client-side: state guards (mounted flag, conditional renders), safe localStorage access with try/catch returning defaults.

**Patterns:**
- API routes: `try { ... } catch (err: any) { return NextResponse.json({ error: '...', details: err.message }, { status: 500 }) }`
- Storage: `try { JSON.parse(raw) } catch { return DEFAULT_DATA }` — silent fallback to defaults on corruption
- Client components: `if (!mounted) return <LoadingSpinner />` pattern to avoid hydration mismatches
- Subscription: null checks before accessing Clerk metadata fields

## Cross-Cutting Concerns

**Logging:** `console.log` and `console.error` throughout — used for debugging (e.g., `lib/quota.ts:22`, `lib/stats.ts:45`). No structured logging framework.

**Validation:** No input validation library. API routes do manual existence checks (`if (!report) return ...`). Client forms use `react-hook-form` with `zod` for the journal dialog fields.

**Authentication:** Clerk middleware (`middleware.ts`) protects all `/app` routes except sign-in, sign-up, webhook, terms, privacy. API routes check `auth()` / `userId`. Stripe webhook uses signature verification.

**i18n:** English and Bulgarian via `lib/translations.ts` (single file with two large objects). Language detected from browser and persisted to localStorage. Consumed via `useLang()` hook.

---

*Architecture analysis: 2026-05-12*
