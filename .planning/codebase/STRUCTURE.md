# Codebase Structure

**Analysis Date:** 2026-05-12

## Directory Layout

```
atarafast/                          # Project root
├── app/                            # Next.js App Router pages & API routes
│   ├── layout.tsx                  # Root layout (Clerk, Theme, Language providers)
│   ├── page.tsx                    # Landing page (marketing)
│   ├── globals.css                 # Global Tailwind styles & CSS custom properties
│   ├── app/
│   │   └── page.tsx                # Main dashboard (PWA app shell)
│   ├── api/
│   │   ├── ai/
│   │   │   ├── analyze/route.ts    # POST - AI coaching via OpenRouter
│   │   │   └── save-report/route.ts # POST - Persist AI report to Clerk metadata
│   │   └── stripe/
│   │       ├── checkout/route.ts   # POST - Create Stripe Checkout session
│   │       └── webhook/route.ts    # POST - Handle Stripe events
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx            # EN blog post (dynamic route)
│   ├── bg/
│   │   └── blog/
│   │       └── [slug]/
│   │           └── page.tsx        # BG blog post (dynamic route)
│   ├── install/
│   │   └── page.tsx                # PWA install instructions page
│   ├── privacy/
│   │   └── page.tsx                # Privacy policy page
│   ├── terms/
│   │   └── page.tsx                # Terms of service page
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx            # Clerk sign-in page
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx            # Clerk sign-up page
│   └── test/                       # Test routes (empty — development sandbox)
├── components/
│   ├── ui/                         # shadcn/ui primitives (57 components)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ...                     # (accordion, alert, badge, card, chart, etc.)
│   ├── landing/
│   │   ├── hero-sections.tsx       # Landing page section components
│   │   └── PhilosophyDrawer.tsx    # Philosophy/Stoicism drawer
│   ├── timer-view.tsx              # Main timer UI with progress visualization
│   ├── stats-view.tsx              # Stats, streaks, challenges, AI coach
│   ├── history-view.tsx            # Fast history list and calendar
│   ├── plan-view.tsx               # Educational fasting protocol content
│   ├── settings-sheet.tsx          # Settings bottom sheet
│   ├── onboarding-flow.tsx         # First-time user onboarding
│   ├── circular-progress.tsx       # Circle timer progress component
│   ├── triangular-progress.tsx     # Triangle timer progress component
│   ├── preset-grid.tsx             # Fasting protocol selection grid
│   ├── preset-detail.tsx           # Individual preset info & start
│   ├── premium-gate.tsx            # Premium feature lock screen
│   ├── upgrade-dialog.tsx          # Subscription upgrade modal
│   ├── journal-dialog.tsx          # Post-fast journal entry
│   ├── share-dialog.tsx            # Social share card generation
│   ├── week-status-strip.tsx       # 7-day completion strip
│   ├── recent-fasts-chart.tsx      # Recent fasts bar chart
│   ├── weight-trends-chart.tsx     # Weight tracking line chart
│   ├── wellbeing-chart.tsx         # Wellbeing over time chart
│   ├── MetabolicJourneyChart.tsx   # Metabolic journey arc chart
│   ├── manual-fast-dialog.tsx      # Add/edit past fast dialog
│   ├── edit-time-dialog.tsx        # Edit fast start/end times
│   ├── completion-animation.tsx    # Fast completion celebration
│   ├── programs-grid.tsx           # Multi-day program selection
│   ├── checkout-button.tsx         # Stripe checkout trigger
│   ├── lifetime-offer-link.tsx     # Lifetime purchase link
│   ├── logo.tsx                    # SVG logo component
│   └── theme-provider.tsx          # Theme provider wrapper
├── lib/                            # Business logic & data layer
│   ├── storage.ts                  # localStorage CRUD (fasts, settings, AI usage, programs)
│   ├── presets.ts                  # Fasting protocol definitions (12:12 → 20:4)
│   ├── programs.ts                 # Multi-day program definitions & evaluation logic
│   ├── challenges.ts               # Gamification badges (streaks, durations, milestones)
│   ├── stats.ts                    # Streak calculation, weight data transformation
│   ├── quota.ts                    # AI usage quota/rate limiter
│   ├── fasting-phases.ts           # Metabolic phase percentage calculator
│   ├── subscription.ts             # Clerk metadata-based subscription hook
│   ├── features.ts                 # Feature flag (ENABLE_PREMIUM)
│   ├── translations.ts             # Full EN/BG translation strings (~780 lines)
│   ├── language-context.tsx        # React context for language switching
│   ├── blog-data.ts                # Blog article data (static content)
│   └── utils.ts                    # cn() utility (clsx + tailwind-merge)
├── hooks/                          # Shared React hooks
│   ├── use-notifications.ts        # Service Worker notification management
│   ├── use-toast.ts                # Toast notification hook
│   └── use-mobile.ts              # Mobile breakpoint detection
├── types/                          # Shared TypeScript type definitions
│   └── blog.ts                     # Article, FAQ type interfaces
├── styles/
│   └── globals.css                 # (Duplicate of app/globals.css? — legacy location)
├── tests/
│   └── e2e/
│       └── quota.spec.ts           # Playwright E2E tests for AI quota
├── scripts/
│   └── verify-quota-logic.ts       # Quota verification script
├── public/                         # Static assets
│   ├── favicon.png
│   ├── icon-192.png, icon-512.png  # PWA icons
│   ├── apple-touch-icon.png
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service Worker
│   ├── *.webp, *.png, *.jpg        # App screenshots & images
│   └── The 4 Free Biohacks.pdf
├── .planning/                      # GSD planning artifacts
├── .gsd/                           # GSD milestone/slice/task data
├── middleware.ts                   # Clerk auth + domain routing
├── next.config.mjs                 # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies & scripts
├── postcss.config.mjs              # PostCSS config
├── components.json                 # shadcn/ui configuration
├── playwright.config.ts            # Playwright E2E test config
├── check_usage.ts                  # Debug script for AI usage
└── .env.example                    # Environment variable template (DO NOT READ VALUES)
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js 16 App Router pages and API routes. Central routing hub.
- Contains: Page components (server & client), layout wrappers, API route handlers, global CSS
- Key files: `app/layout.tsx` (root providers), `app/page.tsx` (landing), `app/app/page.tsx` (dashboard), `middleware.ts` (domain routing & auth)
- Organization: Flat for utility pages; nested for dynamic routes (`blog/[slug]`, `sign-in/[[...sign-in]]`), API routes grouped by domain (`ai/`, `stripe/`)

**`components/`:**
- Purpose: Reusable React components — shadcn/ui primitives and domain-specific UI components
- Contains: 57 shadcn/ui components in `ui/`, 28 domain components at root, 2 landing page sections in `landing/`
- Key files: `components/ui/button.tsx`, `components/timer-view.tsx`, `components/stats-view.tsx`
- Organization: `ui/` for generic primitives (auto-generated by shadcn CLI); top-level for feature components; `landing/` for marketing-specific sections

**`lib/`:**
- Purpose: Business logic and data access — the "backend" of the client-side app
- Contains: 13 TypeScript modules — data persistence (`storage.ts`), fasting logic (`presets.ts`, `programs.ts`, `challenges.ts`, `fasting-phases.ts`), stats (`stats.ts`), auth/subscription (`subscription.ts`, `features.ts`), i18n (`translations.ts`, `language-context.tsx`), utilities (`utils.ts`, `quota.ts`, `blog-data.ts`)
- Key files: `lib/storage.ts` (all data persistence), `lib/translations.ts` (i18n), `lib/subscription.ts` (premium status)
- Organization: Flat — all modules at root. No subdirectories.

**`hooks/`:**
- Purpose: Shared React hooks used across multiple components
- Contains: 3 hooks — notifications, toast, mobile detection
- Key files: `hooks/use-notifications.ts`

**`types/`:**
- Purpose: Shared TypeScript type definitions
- Contains: 1 file — `blog.ts` (Article, FAQ types)
- Note: Domain types (`FastingRecord`, `AppSettings`, etc.) are defined inline in `lib/storage.ts` and re-exported — not centralized here.

**`public/`:**
- Purpose: Static assets served at root URL
- Contains: PWA icons, manifest, service worker, app screenshots, SEO images
- Key files: `public/manifest.json`, `public/sw.js`, `public/favicon.png`

**`tests/`:**
- Purpose: E2E test suite
- Contains: Playwright tests in `e2e/` subdirectory
- Key files: `tests/e2e/quota.spec.ts`

**`scripts/`:**
- Purpose: Standalone verification/utility scripts
- Contains: `verify-quota-logic.ts`
- Key files: `scripts/verify-quota-logic.ts`

**`styles/`:**
- Purpose: Legacy location — appears to duplicate `app/globals.css`
- Contains: `globals.css`
- Note: Global styles are now primarily in `app/globals.css`

**`.planning/`:**
- Purpose: GSD planning artifacts (generated by `/gsd-map-codebase` and other commands)
- Contains: `codebase/` subdirectory
- Generated: Yes
- Committed: Yes (tracked in git)

**`.gsd/`:**
- Purpose: GSD state — milestones, slices, tasks, decisions, requirements
- Contains: `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md`, `milestones/`
- Generated: Yes
- Committed: Yes

## Key File Locations

**Entry Points:**
- `app/page.tsx`: Landing/marketing page (server component with `force-dynamic`)
- `app/app/page.tsx`: Dashboard PWA (client component — the main app)
- `app/layout.tsx`: Root layout — all providers (Clerk, Theme, Language, Analytics)
- `middleware.ts`: Domain routing, auth protection, internal rewrites

**Configuration:**
- `next.config.mjs`: Next.js config (typescript ignoreBuildErrors, image unoptimized, transpilePackages)
- `tsconfig.json`: TypeScript config with `@/*` alias → `./*`
- `package.json`: Dependencies and scripts (dev, build, start, lint, test:e2e)
- `playwright.config.ts`: E2E test config (base URL, session cookie)
- `postcss.config.mjs`: PostCSS (Tailwind v4)
- `components.json`: shadcn/ui configuration
- `.env.example`: Environment variable template

**Core Logic:**
- `lib/storage.ts`: All data CRUD — fasts, settings, AI usage, programs, badges
- `lib/presets.ts`: Fasting protocol definitions
- `lib/programs.ts`: Multi-day program rules & evaluation
- `lib/challenges.ts`: Badge/gamification logic
- `lib/stats.ts`: Streak & weight calculations
- `lib/quota.ts`: AI usage rate limiting
- `lib/subscription.ts`: Premium status from Clerk metadata

**Testing:**
- `tests/e2e/quota.spec.ts`: Playwright E2E tests for AI quota gating
- `playwright.config.ts`: Test runner configuration

**Documentation:**
- `README.md`: Project README
- `CONTRIBUTING.md`: Contribution guidelines
- `STATE.md`: Project state overview

## Naming Conventions

**Files:**
- **kebab-case** for component files: `timer-view.tsx`, `settings-sheet.tsx`, `preset-grid.tsx`
- **kebab-case** for lib files: `language-context.tsx`, `blog-data.ts`, `fasting-phases.ts`
- **PascalCase exception**: `MetabolicJourneyChart.tsx` — one-off deviation from kebab convention
- **camelCase** for hooks: `use-toast.ts`, `use-mobile.ts`, `use-notifications.ts`
- **kebab-case** for API routes: `route.ts` inside a kebab-cased directory (e.g., `analyze/route.ts`)
- **kebab-case** for page directories: `sign-in/`, `sign-up/`
- **dot notation** for config: `.env.example`, `next.config.mjs`, `postcss.config.mjs`

**Directories:**
- **kebab-case** for route groups: `blog/`, `sign-in/`, `sign-up/`
- **CamelCase** for component files (file naming, not directory — components live flat)
- Single-purpose directories: each API route gets its own directory with `route.ts`

**Components:**
- **PascalCase** for component names and exports: `TimerView`, `StatsView`, `HistoryView`
- **PascalCase** for component files: `timer-view.tsx` exports `TimerView` (kebab file, Pascal export)

## Where to Add New Code

**New Feature (UI + Logic):**
- Primary code: 
  - Create a new component in `components/` (e.g., `components/new-feature.tsx`)
  - If it's a new tab in the dashboard, wire it in `app/app/page.tsx`
  - Add business logic in a new `lib/new-feature.ts` module
  - If it needs server-side processing, create a route in `app/api/new-feature/route.ts`
- Tests: Create a new spec in `tests/e2e/` or add a new test file in a `tests/` subdirectory

**New Page:**
- Implementation: Create a directory in `app/` with a `page.tsx` (e.g., `app/new-page/page.tsx`)
  - For server-rendered pages: export `async function` component
  - For client-side pages: add `"use client"` directive at top
- Dynamic routes: Use `[param]` directory syntax (e.g., `app/new-page/[id]/page.tsx`)
- Layout: Optionally add `layout.tsx` in the directory for shared layout

**New shadcn/ui Component:**
- Run: `npx shadcn-ui@latest add <component-name>`
- Output: New file in `components/ui/<component-name>.tsx`
- Imports: Use `@/components/ui/<component-name>` path alias

**New API Endpoint:**
- Implementation: Create directory under `app/api/` with a `route.ts`
- Pattern: Export named functions for HTTP methods (`export async function POST`, `GET`, etc.)
- Auth: Check `auth()` from `@clerk/nextjs/server` for protected endpoints
- Example: `app/api/new-domain/action/route.ts`

**New Utility/Helper:**
- Shared helpers: Add to `lib/utils.ts` (for simple functions) or create a new `lib/<name>.ts` file
- Use the `@/*` path alias for imports: `import { cn } from "@/lib/utils"`

**New Translation Strings:**
- Add keys to both `bg` and `en` objects in `lib/translations.ts`
- Follow existing key naming: camelCase, dot-notation for nested (e.g., `planContent."16:8".name`)
- Use the `useLang()` hook in components: `const { t } = useLang(); t.myNewKey`

**New Type Definition:**
- Domain types (closely coupled with logic): Define in the relevant `lib/` file and export
- Shared/cross-module types: Add to `types/` directory
- Path alias: `import { TypeName } from "@/types/file"`

## Special Directories

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (via `npm install`)
- Committed: No (gitignored)

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes (via `npm run build` or `npm run dev`)
- Committed: No (gitignored)

**`test-results/`:**
- Purpose: Playwright test output and failure artifacts
- Generated: Yes (via `npm run test:e2e`)
- Committed: Some content present (error-context.md files from failed runs)

**`forfix/`:**
- Purpose: Unknown — appears empty (only `.DS_Store`). Possibly a work-in-progress directory for bug fixes.
- Generated: No
- Committed: Partially (`.DS_Store` only)

**`.artifacts/`:**
- Purpose: Build/development artifacts
- Generated: Yes
- Committed: Unknown

**`.bg-shell/`:**
- Purpose: Background shell process manifest
- Generated: Yes (by development tooling)
- Committed: Yes (contains `manifest.json`)

**`.opencode/`:**
- Purpose: AI code generation tool artifacts (opencode)
- Generated: Yes
- Committed: Yes

---

*Structure analysis: 2026-05-12*
