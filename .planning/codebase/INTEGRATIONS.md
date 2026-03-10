# External Integrations

**Analysis Date:** 2026-03-10

## APIs & External Services

**Authentication:**
- Clerk - User authentication and management
  - SDK: `@clerk/nextjs`
  - Env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

**Payments:**
- Stripe - Payment processing
  - SDK: `stripe` (backend), `@stripe/stripe-js` (frontend)
  - Plans: Monthly, Yearly, Lifetime
  - Env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

## Data Storage

**Database:**
- Local storage (IndexedDB via localStorage) - All data stored client-side
- No external database - PWA with local-first architecture

**File Storage:**
- Local filesystem only (PWA)
- Static assets in `/public` folder

**Caching:**
- Next.js built-in caching
- Service worker for offline support

## Authentication & Identity

**Auth Provider:**
- Clerk (Clerk.com)
  - Email/password authentication
  - OAuth support (via Clerk dashboard)
  - User metadata for subscription status

## Monitoring & Observability

**Analytics:**
- @vercel/analytics - Vercel web analytics

**Error Tracking:**
- Not currently integrated (potential improvement)

## CI/CD & Deployment

**Hosting:**
- Vercel (recommended)
- Can deploy to any Node.js hosting

**CI Pipeline:**
- Vercel automatic deployments from GitHub

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Secrets location:**
- `.env.local` (local)
- Vercel project settings (production)

## Webhooks & Callbacks

**Incoming:**
- `/api/stripe/webhook` - Stripe subscription events

**Outgoing:**
- Stripe checkout redirect
- Clerk authentication callbacks

---

*Integration audit: 2026-03-10*
