# Technology Stack

**Analysis Date:** 2026-03-10

## Languages

**Primary:**
- TypeScript 5.7.3 - All application code

**Secondary:**
- CSS/Tailwind - Styling

## Runtime

**Environment:**
- Node.js 22+
- Next.js 16.1.6 (Turbopack)

**Package Manager:**
- npm 10+
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with App Router
- React 19.2.4 - UI library
- Tailwind CSS 4.2.0 - Utility-first CSS framework

**UI Components:**
- Radix UI (multiple primitives) - Accessible component primitives
- shadcn/ui - Component library built on Radix
- Framer Motion 12+ - Animation library
- Lucide React - Icon library
- Embla Carousel - Carousel component
- Recharts - Charting library

**Forms & Validation:**
- React Hook Form - Form handling
- Zod 3.24 - Schema validation

**State & Data:**
- date-fns - Date utilities
- Local storage - Client-side persistence

## Key Dependencies

**Authentication:**
- @clerk/nextjs 7.0.1 - Authentication & user management

**Payments:**
- stripe 20.4.0 - Payment processing
- @stripe/stripe-js 8.9.0 - Stripe.js client

**PWA & Mobile:**
- Progressive Web App capabilities
- PWA manifest in `public/manifest.json`

**Analytics:**
- @vercel/analytics 1.6.1 - Vercel analytics

## Configuration

**Environment:**
- `.env.local` - Local environment variables
- `.env.example` - Template for env vars
- Environment variables required:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth
  - `CLERK_SECRET_KEY` - Clerk backend
  - `NEXT_PUBLIC_STRIPE_PRICE_ID` - Stripe monthly price
  - `NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID` - Stripe yearly price
  - `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID` - Stripe lifetime price
  - `STRIPE_SECRET_KEY` - Stripe backend
  - `STRIPE_WEBHOOK_SECRET` - Stripe webhooks

**Build:**
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.mjs` / `postcss.config.mjs` - Tailwind config
- `components.json` - shadcn/ui configuration

## Platform Requirements

**Development:**
- Node.js 22+
- npm 10+

**Production:**
- Vercel (recommended deployment platform)
- Edge runtime support

---

*Stack analysis: 2026-03-10*
