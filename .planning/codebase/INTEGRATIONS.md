# External Integrations

**Analysis Date:** 2026-05-12

## APIs & External Services

**Authentication & Identity:**
- Clerk - User authentication, session management, identity
  - SDK/Client: `@clerk/nextjs` ^7.0.1
  - Server: `clerkMiddleware` in `middleware.ts`, `clerkClient` in API routes
  - Client: `ClerkProvider` in `app/layout.tsx`, `useUser()` hook in `lib/subscription.ts`
  - Auth env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
  - Redirect env vars: `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
  - Public metadata used for subscription state: `plan`, `subscriptionStatus`, `stripeCustomerId`

**Payments:**
- Stripe - Subscription management, checkout, webhook-based lifecycle
  - SDK/Client (server): `stripe` ^20.4.0 in API routes
  - SDK/Client (client): `@stripe/stripe-js` ^8.9.0 for client-side Stripe.js
  - API version: `2026-02-25.clover`
  - Server-side env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
  - Client-side env vars: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PRICE_ID`, `NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID`, `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID`
  - API routes:
    - `POST /api/stripe/checkout` (`app/api/stripe/checkout/route.ts`) - Creates Stripe Checkout sessions or Billing Portal sessions
    - `POST /api/stripe/webhook` (`app/api/stripe/webhook/route.ts`) - Handles `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted` events; updates Clerk user metadata
  - Component files:
    - `components/checkout-button.tsx` - Checkout trigger button
    - `components/upgrade-dialog.tsx` - Plan selection dialog with monthly/yearly/lifetime pricing
    - `components/lifetime-offer-link.tsx` - Lifetime plan link

**AI Inference:**
- OpenRouter - LLM API proxy for AI fasting coach analysis
  - SDK/Client: Raw `fetch()` calls (no SDK wrapper)
  - Auth env var: `OPENROUTER_API_KEY` (also falls back to legacy `Open_Router_API`)
  - Primary model: `nvidia/nemotron-3-super-120b-a12b:free`
  - Fallback model: `openrouter/free`
  - API endpoint: `https://openrouter.ai/api/v1/chat/completions`
  - API route: `POST /api/ai/analyze` (`app/api/ai/analyze/route.ts`)
  - AI report persistence: `POST /api/ai/save-report` (`app/api/ai/save-report/route.ts`) - stores reports in Clerk user metadata

**Analytics:**
- Vercel Analytics - Page views and web vitals
  - SDK/Client: `@vercel/analytics` 1.6.1
  - Integration: `<Analytics />` component rendered in root layout `app/layout.tsx`

## Data Storage

**Databases:**
- No dedicated database. All user data stored client-side via `localStorage`.

**File Storage:**
- Local filesystem only. No cloud file storage (S3, etc.) detected.
- PDF files served as static assets: `public/The 4 Free Biohacks.pdf`

**Caching:**
- None detected. No Redis, Memcached, or server-side cache layer.

**Local Storage (Client-Side Only):**
- Storage key: `"fasting-tracker-data"` (defined in `lib/storage.ts`)
- Data persisted: active fast, fasting history, app settings, AI usage counters, active programs, program badges
- Import/Export: `exportData()` and `importData()` functions for JSON data portability
- Language preference stored separately: `"atara-language"` key (in `lib/language-context.tsx`)

**State Management:**
- React Context API for language (`LanguageProvider` in `lib/language-context.tsx`)
- Clerk's `useUser()` hook for auth state
- Component-local state with `useState` / `useEffect` patterns
- No Redux, Zustand, or other external state management library

## Authentication & Identity

**Auth Provider:**
- Clerk (fully managed auth service)
- Implementation: `clerkMiddleware` wraps the Next.js route matcher in `middleware.ts`
- Route protection: All routes except `/sign-in`, `/sign-up`, `/api/stripe/webhook`, `/terms`, `/privacy` require authentication (via `auth.protect()`)
- Multi-domain auth: `ClerkProvider` configured with `domain: 'atarafast.com'` for cross-subdomain auth
- Sign-in page: `app/sign-in/[[...sign-in]]/page.tsx`
- Sign-up page: `app/sign-up/[[...sign-up]]/page.tsx`
- User metadata used for: subscription plan, Stripe customer ID, AI report persistence

## Monitoring & Observability

**Error Tracking:**
- No third-party error tracking service (Sentry, LogRocket, etc.) detected
- Errors logged via `console.error()` in API routes and components

**Logs:**
- Console-based logging (`console.log`, `console.error`) throughout
- Vercel's built-in log drain for production deployments

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from `@vercel/analytics`, domain pattern `atarafast.com`)
- Multi-domain deployment: `atarafast.com` (landing) + `app.atarafast.com` (app)

**CI Pipeline:**
- GitHub Actions workflow: `.github/workflows/ci.yml`
- Trigger: Pull requests to `main`
- Steps: Checkout → Setup Node 20 → `npm install` → `npm run build`
- No test step in CI (build-only verification)

## Environment Configuration

**Required env vars (see `.env.example`):**

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Clerk publishable key |
| `CLERK_SECRET_KEY` | Server | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Client | Clerk sign-in redirect path |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Client | Clerk sign-up redirect path |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Client | Post-sign-in redirect |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Client | Post-sign-up redirect |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Server | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Server | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PRICE_ID` | Client | Default Stripe price ID (monthly) |
| `OPENROUTER_API_KEY` | Server | OpenRouter API key for AI |
| `NEXT_PUBLIC_APP_URL` | Client | Application URL (e.g., `http://localhost:3000`) |

**Optional env vars:**
| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_ENABLE_PREMIUM` | Client | Feature flag: enables Stripe/premium features when `"true"` |
| `NEXT_PUBLIC_APP_PROJECT` | Client | Feature flag: forces app project mode in middleware when `"true"` |
| `NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID` | Client | Yearly plan Stripe price ID |
| `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID` | Client | Lifetime plan Stripe price ID |
| `NEXT_PUBLIC_FREE_USERS` | Client | Comma-separated email list for free premium access |

**Secrets location:**
- Development: `.env.local` (gitignored)
- Production: Vercel environment variables (dashboard or CLI)

## Webhooks & Callbacks

**Incoming:**
- `POST /api/stripe/webhook` - Stripe webhook endpoint (`app/api/stripe/webhook/route.ts`)
  - Handles: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Signature verification: `stripe.webhooks.constructEvent()` with `STRIPE_WEBHOOK_SECRET`
  - Public route: No Clerk auth required (listed in `middleware.ts` public routes)

**Outgoing:**
- Stripe Checkout redirects: `success_url` and `cancel_url` pointing to `NEXT_PUBLIC_APP_URL`
- Stripe Billing Portal: redirects to `NEXT_PUBLIC_APP_URL/` after session
- OpenRouter AI API: outbound `POST https://openrouter.ai/api/v1/chat/completions`

---

*Integration audit: 2026-05-12*
