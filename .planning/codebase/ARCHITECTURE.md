# Architecture

**Analysis Date:** 2026-03-10

## Pattern Overview

**Overall:** Next.js App Router with Client-Side Persistence

**Key Characteristics:**
- Server-side rendering (SSR) for landing and auth pages
- Client-side state management for app functionality
- Local-first data storage (no external database)
- PWA architecture with service worker

## Layers

**App Layer (`app/`):**
- Purpose: Routes and pages
- Location: `app/`
- Contains: Page components, layouts, API routes
- Key files:
  - `app/page.tsx` - Landing page
  - `app/app/page.tsx` - Main app (fasting timer)
  - `app/layout.tsx` - Root layout with Clerk provider
  - `app/api/stripe/*` - Stripe payment endpoints

**Components Layer (`components/`):**
- Purpose: Reusable UI components
- Location: `components/`
- Contains: Timer components, dialogs, sheets, charts
- Key files:
  - `components/timer-view.tsx` - Main timer UI
  - `components/preset-detail.tsx` - Fasting plan details
  - `components/stats-view.tsx` - Statistics dashboard
  - `components/history-view.tsx` - Fasting history
  - `components/journal-dialog.tsx` - Post-fast journaling
  - `components/settings-sheet.tsx` - User settings
  - `components/landing/` - Landing page sections

**Lib Layer (`lib/`):**
- Purpose: Utilities and business logic
- Location: `lib/`
- Contains:
  - `lib/translations.ts` - i18n translations (EN/BG)
  - `lib/subscription.ts` - Subscription/pricing logic
  - `lib/utils.ts` - General utilities
  - `lib/storage.ts` - Local storage helpers

## Data Flow

**User starts fast:**
1. User selects preset or custom duration in `preset-detail.tsx`
2. Timer starts, stores start time in localStorage
3. Timer component calculates progress in real-time

**User completes fast:**
1. Timer shows completion dialog
2. Journal dialog prompts for feelings/metrics
3. Data saved to localStorage

**Subscription flow:**
1. User clicks upgrade in settings
2. `CheckoutButton` triggers Stripe checkout
3. Stripe webhook updates user metadata
4. Subscription status checked via `lib/subscription.ts`

## State Management

**Client State:**
- React useState/useEffect for UI state
- localStorage for persistent data
- No external state management library needed

**Data Storage:**
- Fasting history in localStorage
- User preferences in localStorage
- Subscription status in Clerk user metadata

## Entry Points

**Landing Page:**
- Location: `app/page.tsx`
- Triggers: Direct visit to domain
- Responsibilities: Marketing, signup CTAs

**App (Authenticated):**
- Location: `app/app/page.tsx`
- Triggers: After login, redirects from middleware
- Responsibilities: Timer, stats, history, settings

**API Routes:**
- `/api/stripe/checkout` - Create Stripe checkout session
- `/api/stripe/webhook` - Handle Stripe events

## Error Handling

**Strategy:** Try-catch with user-friendly error messages

**Patterns:**
- Error boundaries for component failures
- Toast notifications (sonner) for user feedback
- Form validation with Zod

## Cross-Cutting Concerns

**Authentication:** Clerk (@clerk/nextjs)
- Middleware protects app routes
- Public routes: sign-in, sign-up, terms, privacy, Stripe webhook

**Validation:** Zod schemas
- Used in forms and API endpoints

**i18n:** Custom translation system
- `lib/translations.ts` contains all strings
- Support for English and Bulgarian

---

*Architecture analysis: 2026-03-10*
