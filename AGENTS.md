<!-- GSD:project-start source:PROJECT.md -->
## Project

**Atara**

Atara is a minimalist, open-source intermittent fasting tracker — elegant and mobile-first. Users track fasting windows, view progress with streaks and stats, get AI-powered coaching insights, and participate in challenges and programs. Fully bilingual (EN/BG), privacy-first with localStorage, and PWA-capable.

**Core Value:** A user can track, analyze, and improve their fasting practice through an intuitive, minimal interface that gets out of the way.

### Constraints

- **Tech stack:** Next.js 16, React 19, Tailwind CSS 4, existing component system — no new dependencies
- **Design:** Elegant, minimalistic, modern, mobile-first — no desktop-only features
- **Scope:** Reorganization + visual polish only — no new functionality
- **Premium:** `ENABLE_PREMIUM=false` — all premium gates must be hidden, not removed (code stays for future use)
- **Language:** Bilingual (EN/BG) must be maintained — all new UI strings need translations
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.7.3 - All source code (`.ts`, `.tsx` files across `app/`, `components/`, `lib/`, `hooks/`, `types/`)
- CSS (Tailwind CSS v4 via PostCSS) - Styling in `app/globals.css`
- JavaScript (Service Worker) - `public/sw.js` for push notifications and PWA offline support
## Runtime
- Node.js ≥20 (CI uses Node 20, project targets Next.js 16)
- Next.js 16.1.6 (App Router)
- npm (no version specified)
- Lockfile: `package-lock.json` present
## Frameworks
- Next.js 16.1.6 - Full-stack React framework with App Router (`app/` directory)
- React 19.2.4 - UI library (`react-dom` 19.2.4)
- Tailwind CSS 4.2.1 - Utility-first CSS framework with CSS variables theming
- Playwright 1.58.2 - E2E testing framework
- PostCSS 8.5.8 - CSS processing pipeline
- Autoprefixer 10.0.4 - CSS vendor prefixing
- TypeScript 5.7.3 - Type checking and compilation
## Key Dependencies
- `@clerk/nextjs` ^7.0.1 - Authentication and user management (Clerk)
- `stripe` ^20.4.0 - Server-side Stripe SDK for payment processing
- `@stripe/stripe-js` ^8.9.0 - Client-side Stripe.js for payment UI
- `react-hook-form` ^7.54.1 - Form state management and validation
- `zod` ^3.24.1 - Schema validation (used with react-hook-form via `@hookform/resolvers` ^3.9.1)
- `framer-motion` ^12.34.4 - Animation library for UI transitions
- `@radix-ui/*` (20+ packages) - Headless UI primitives (accordion, dialog, dropdown-menu, select, tabs, toast, tooltip, etc.)
- `lucide-react` ^0.564.0 - Icon library
- `cmdk` 1.1.1 - Command palette / search
- `embla-carousel-react` 8.6.0 - Carousel component
- `vaul` ^1.1.2 - Drawer component
- `sonner` ^1.7.1 - Toast notifications
- `input-otp` 1.4.2 - OTP input component
- `react-resizable-panels` ^2.1.7 - Resizable panel layout
- `clsx` ^2.1.1 - Conditional class name construction
- `tailwind-merge` ^3.3.1 - Tailwind class deduplication
- `class-variance-authority` ^0.7.1 - Variant-based component styling
- `date-fns` 4.1.0 - Date manipulation
- `recharts` ^2.15.4 - Charting library
- `qrcode.react` ^4.2.0 - QR code generation for share features
- `react-markdown` ^10.1.0 - Markdown rendering (blog posts, AI reports)
- `remark-gfm` ^4.0.1 - GitHub Flavored Markdown support
- `@tailwindcss/typography` ^0.5.19 - Tailwind typography plugin for prose styling
- `html-to-image` ^1.11.13 - DOM-to-image export for share cards
- `next-themes` ^0.4.6 - Dark/light/system theme switching
- `@vercel/analytics` 1.6.1 - Vercel Analytics integration
- `react-day-picker` 9.13.2 - Date picker component
- `tw-animate-css` 1.3.3 - Tailwind animation utilities
## Configuration
- Configuration via environment variables (`.env.local` for development, Vercel environment variables for production)
- `.env.example` present - documents all required variables
- Environment variable naming: `NEXT_PUBLIC_*` for client-side, `STRIPE_*`, `CLERK_*`, `OPENROUTER_*` for server-side
- `next.config.mjs` - Next.js configuration:
- `tsconfig.json` - TypeScript configuration:
- `postcss.config.mjs` - PostCSS with `@tailwindcss/postcss` plugin
- `components.json` - shadcn/ui configuration (new-york style, neutral base color, CSS variables, RSC enabled)
- `playwright.config.ts` - E2E test config (testDir: `tests/e2e`, baseURL: `http://localhost:3000`)
- ESLint referenced in `package.json` scripts (`"lint": "eslint ."`) but no ESLint config file found in project root (may use Next.js built-in ESLint or be configured elsewhere)
## Platform Requirements
- Node.js 20+
- Environment variables (see `.env.example` for required vars)
- Run: `npm run dev` → starts Next.js dev server on port 3000
- Build: `npm run build` → Next.js production build
- Lint: `npm run lint` → ESLint
- E2E: `npm run test:e2e` → Playwright
- Deployed on Vercel (evidenced by `@vercel/analytics`, Vercel environment variables pattern, domain `atarafast.com`)
- Multi-domain architecture: landing at `atarafast.com`, app at `app.atarafast.com`
- PWA support: `public/manifest.json`, `public/sw.js` (service worker for push notifications)
- iOS PWA optimizations: apple-touch-icon, `appleWebApp` metadata, safe-area CSS padding
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- **Components:** kebab-case (e.g., `timer-view.tsx`, `checkout-button.tsx`, `premium-gate.tsx`)
- **Library modules:** camelCase (e.g., `storage.ts`, `presets.ts`, `fasting-phases.ts`)
- **Hooks:** `use-` prefix in kebab-case (e.g., `use-toast.ts`, `use-mobile.ts`, `use-notifications.ts`)
- **Types directory:** flat file with descriptive name (`types/blog.ts`)
- **API routes:** `app/api/{domain}/{endpoint}/route.ts`
- camelCase (e.g., `getActiveFast`, `startFast`, `handleEndFast`, `calculateStreaks`)
- Event handlers prefixed with `handle` (e.g., `handleStartFast`, `handleEndFast`, `handleSelectPreset`)
- Callback props prefixed with `on` (e.g., `onFastEnd`, `onNavigateToHistory`, `onClose`)
- Getter functions prefixed with `get` (e.g., `getSettings`, `getHistory`, `getPresetById`)
- Setter/update functions prefixed with `set`, `update`, or `save` (e.g., `updateSettings`, `saveData`, `setLang`)
- Boolean-returning functions prefixed with `is` or `has` (e.g., `isPremium`)
- camelCase (e.g., `activeFast`, `isPremium`, `now`, `elapsedMs`)
- Boolean state variables prefixed with `is`/`has`/`show` (e.g., `isPremium`, `hasHiddenRecords`, `showDeleteConfirm`, `mounted`)
- Module-level constants: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`, `DEFAULT_SETTINGS`, `TRIAL_DAYS`, `MOBILE_BREAKPOINT`)
- Config arrays: UPPER_SNAKE_CASE (e.g., `FASTING_PRESETS`, `PROGRAMS`, `CUSTOM_PRESET`)
- Interfaces: PascalCase (e.g., `FastingRecord`, `AppSettings`, `FastingPreset`, `WeightPoint`)
- Type aliases: PascalCase (e.g., `Language`, `Plan`, `SubscriptionStatus`)
- Union types: lowercase string literals (e.g., `"up" | "down"`, `"free" | "premium"`, `"bg" | "en"`)
- Generic type parameters: descriptive (e.g., `Record<string, number>`, not `T`)
- Discriminated unions via string literals in interfaces (e.g., `type: "consecutive" | "single"`)
## Code Style
- **No ESLint config file found.** The `package.json` has a `lint` script (`eslint .`) but no `.eslintrc*` or `eslint.config.*` exists.
- **No Prettier config file found.** Formatting appears to be manual/in-editor.
- **Indentation:** 2-space (consistent across codebase)
- **Quotes:** Single quotes preferred for strings (observed in imports, object keys, JSX strings)
- **Semicolons:** Inconsistently used. Files like `lib/quota.ts` and `lib/storage.ts` use them; `lib/features.ts` and `lib/fasting-phases.ts` do not. No enforcement.
- `eslint` listed in package.json scripts but no config file detected — linting is effectively unenforced.
- `// eslint-disable-next-line react-hooks/exhaustive-deps` used occasionally (e.g., `components/timer-view.tsx:131`).
- Strict mode enabled (`tsconfig.json`: `"strict": true`)
- Build errors ignored (`next.config.mjs`: `ignoreBuildErrors: true`) — type errors do not block deployment.
- `!` non-null assertions used on env vars (`process.env.STRIPE_SECRET_KEY!`)
- `as` type assertions used (e.g., `as Language`, `as Plan`, `as SubscriptionStatus`)
- `any` occasionally used in catch blocks (e.g., `catch (err: any)`)
## Import Organization
- `@/*` maps to `./*` (project root)
- Used universally: `@/components/*`, `@/lib/*`, `@/hooks/*`
- Relative imports used for cross-lib imports where aliases work (e.g., `from "./storage"`, `from "./presets"`)
## Error Handling
## Logging
- `console.error(...)` for errors in catch blocks
- `console.log(...)` used freely for debugging — even in production code paths (e.g., `lib/quota.ts:22`, `lib/stats.ts:45`)
- No structured logging, log levels, or log aggregation
## Comments
- JSDoc for public API functions (e.g., `lib/programs.ts:34-37`, `lib/stats.ts:14-17`)
- Inline comments for non-obvious logic (e.g., `lib/quota.ts:24 "let's allow 1 per day instead of 1 per month"`)
- Commented-out code sections exist (e.g., `lib/translations.ts:44-52` — the apath feature)
- `// eslint-disable-next-line` used where lint rules conflict
## Function Design
- Functions return explicit types (no reliance on inference for public APIs)
- `null` used for "not found" / "nothing to return"
- `void` for side-effect-only functions
- `boolean` for validation functions (e.g., `importData(jsonString: string): boolean`)
- `useCallback` for callback props and functions passed to effects
- `useMemo` for derived data (e.g., `displayHistory`, `hasHiddenRecords`)
- `useRef` for mutable values that shouldn't trigger re-renders
- `useEffect` for side effects and initialization
## Module Design
- Named exports preferred (only `export default` used for Next.js page components and `next.config.mjs`)
- Co-located type exports alongside functions (same file)
- Types imported with `type` keyword to avoid runtime imports
- `lib/` — pure logic, data transformation, storage, domain types. No React.
- `hooks/` — React hooks, client-side state
- `components/` — React components (both shadcn/ui wrappers in `ui/` and app-level components at top level)
- `components/landing/` — landing page sections
- `app/` — Next.js pages and API routes
- `types/` — shared TypeScript interfaces
## Component Patterns
## Tailwind / Styling Conventions
- Tailwind CSS v4 with `@import 'tailwindcss'` in `app/globals.css`
- Dark mode as default (`.dark` selector)
- CSS custom properties for theming (OKLCH color space)
- `cn()` utility from `@/lib/utils` for class merging
- Inline styles used selectively alongside Tailwind (e.g., for dynamic color values)
- Border radius: `rounded-[2rem]`, `rounded-[1.25rem]` — large, custom radii
- Typography: heavy use of `font-black`, `tracking-widest`, `tracking-[0.2em]`, `uppercase`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```text
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
- **Dual-domain architecture**: landing at `atarafast.com` (server-rendered), app at `app.atarafast.com` (client SPA), with middleware-based routing
- **Client-side state**: all user data in `localStorage` as a single JSON blob — no server-side database
- **Auth-gated with free tier**: Clerk authentication via middleware, 14-day clock trial for premium features
- **AI integration**: OpenRouter-proxied AI coaching with daily quota for free users
- **Stripe payments**: subscription and one-time (lifetime) purchase flows, webhook-synced to Clerk metadata
- **Bi-lingual**: full Bulgarian and English translations via React context
- **PWA-first**: service worker, manifest, install prompts, offline-capable
## Layers
- Purpose: Page rendering, routing, user interaction
- Location: `app/` (pages), `components/` (shared components)
- Contains: Next.js pages (server & client), UI components, layout wrappers
- Depends on: Business Logic Layer, Component Layer
- Used by: N/A (top layer)
- Purpose: Reusable UI components — shadcn/ui primitives (Radix-based), domain-specific components
- Location: `components/ui/` (57 shadcn/ui components), `components/` (28 domain components)
- Contains: Button, Dialog, Form, Charts, Timer views, Stats views, Preset grids
- Depends on: Business Logic Layer (via hooks and lib imports)
- Used by: Presentation Layer
- Purpose: Pure logic — fasting math, stats computation, challenge evaluation, program progression, AI quota checking
- Location: `lib/` (13 modules)
- Contains: `storage.ts` (data persistence), `stats.ts` (streak/weight calculations), `challenges.ts` (badge system), `programs.ts` (multi-day programs), `quota.ts` (AI rate limiting), `presets.ts` (fasting protocols), `subscription.ts` (Clerk metadata reader)
- Depends on: None (internal only, uses `date-fns` for date math)
- Used by: Component Layer, API Layer
- Purpose: Server-side endpoints for AI analysis, Stripe checkout/webhook, AI report saving
- Location: `app/api/` (2 subdirectories: `ai/`, `stripe/`)
- Contains: 4 route handlers
- Depends on: Clerk SDK, Stripe SDK, OpenRouter HTTP API (direct fetch)
- Used by: Presentation Layer (client components call these endpoints)
- Purpose: Persistent storage
- Location: Browser `localStorage` (single `"fasting-tracker-data"` key)
- Contains: `StoredData` interface: active fast, history array, settings, AI usage, active program, badges
- Used by: Business Logic Layer (`lib/storage.ts`)
## Data Flow
### Primary Request Path (Dashboard App)
### AI Coaching Flow
### Stripe Payment Flow
### Domain Routing (Middleware)
- **Client global state**: React Context for Language (`lib/language-context.tsx`), Theme (next-themes), Auth (ClerkProvider)
- **Persisted state**: `localStorage` under key `"fasting-tracker-data"` — single JSON blob loaded/saved on each operation
- **Server state**: Clerk user metadata (publicMetadata: plan, subscriptionStatus, stripeCustomerId, lastAiReport) — the only server-side user data storage
## Key Abstractions
- Purpose: Represents a single fast — active or completed
- Examples: `lib/storage.ts:14-25`, used across `components/timer-view.tsx`, `components/history-view.tsx`, `lib/stats.ts`
- Pattern: Discriminated by `completed` boolean and nullable `endTime`; includes optional `journalData` and `weight`
- Purpose: User preferences — timer direction, visual style, notification/journal toggles, onboarding state, dev premium toggle
- Examples: `lib/storage.ts:36-44`
- Pattern: Merged with defaults on load; partial updates via spread
- Purpose: Predefined fasting protocols (12:12, 14:10, 16:8, 18:6, 20:4 + custom)
- Examples: `lib/presets.ts:1-58`
- Pattern: Static array of objects with id, name, fastHours, eatHours, color; looked up by id
- Purpose: Bi-lingual i18n (English/Bulgarian) with auto-detection and localStorage persistence
- Examples: `lib/translations.ts:1-780` (translations), `lib/language-context.tsx:1-50` (context and provider)
- Pattern: Single `Translation` type with all UI strings; consumed via `useLang()` hook returning `{ t, lang, setLang }`
- Purpose: Gamification — streak badges, duration milestones, total fast counts
- Examples: `lib/challenges.ts:1-82`
- Pattern: Static `CHALLENGES` array → `calculateChallenges(history)` computes unlocked/progress state
- Purpose: Multi-day structured programs (e.g., "7 consecutive days of 16h")
- Examples: `lib/programs.ts:1-105`
- Pattern: Static `PROGRAMS` array → `ActiveProgramState` in localStorage tracks progress → `evaluateProgram()` after each fast end
- Purpose: Blog post data with bilingual content, SEO metadata, and FAQ
- Examples: `types/blog.ts:1-31`, `lib/blog-data.ts`
- Pattern: Static array of Article objects; rendered via dynamic `[slug]` route
## Entry Points
- Location: `app/page.tsx`
- Triggers: Visit to `atarafast.com` (root domain)
- Responsibilities: Marketing page with hero, features, pricing, FAQ, blog links; launches app via `/app` link or `app.atarafast.com`
- Location: `app/app/page.tsx`
- Triggers: Visit to `app.atarafast.com` (or `/app` in dev), middleware rewrites `/` → `/app`
- Responsibilities: Full fasting tracker UI with tabs for timer, history, stats, plan; onboarding flow; journal dialog; settings
- Location: `app/blog/[slug]/page.tsx` (EN), `app/bg/blog/[slug]/page.tsx` (BG)
- Triggers: Direct URL, SEO, links from landing page
- Responsibilities: Server-rendered blog with Markdown content, SEO metadata, FAQ sections
- Location: `app/api/ai/analyze/route.ts`
- Triggers: Client POST request from AI coach component
- Responsibilities: Accepts fasting data, forwards to OpenRouter, returns AI-generated coach analysis
- Location: `app/api/stripe/checkout/route.ts`
- Triggers: Client POST from upgrade/premium prompts
- Responsibilities: Creates Stripe Checkout or Billing Portal session, returns redirect URL
- Location: `app/api/stripe/webhook/route.ts`
- Triggers: Stripe event delivery
- Responsibilities: Validates webhook signature, syncs subscription status to Clerk user metadata
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
### TypeScript Build Errors Ignored
### Inline Stripe Initialization in Route Handlers
### Dual env var name for AI API key
### Ignored Completed Fasts in Program Evaluation
## Error Handling
- API routes: `try { ... } catch (err: any) { return NextResponse.json({ error: '...', details: err.message }, { status: 500 }) }`
- Storage: `try { JSON.parse(raw) } catch { return DEFAULT_DATA }` — silent fallback to defaults on corruption
- Client components: `if (!mounted) return <LoadingSpinner />` pattern to avoid hydration mismatches
- Subscription: null checks before accessing Clerk metadata fields
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
