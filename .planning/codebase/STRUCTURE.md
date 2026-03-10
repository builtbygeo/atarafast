# Codebase Structure

**Analysis Date:** 2026-03-10

## Directory Layout

```
Atara/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── app/               # Authenticated app
│   │   └── page.tsx       # Main timer view
│   ├── api/               # API routes
│   │   ├── stripe/       # Stripe endpoints
│   │   └── ai/           # AI endpoints (if enabled)
│   ├── sign-in/           # Clerk sign-in
│   ├── sign-up/          # Clerk sign-up
│   ├── blog/             # Blog pages (EN)
│   ├── bg/blog/          # Blog pages (BG)
│   ├── terms/            # Terms of service
│   ├── privacy/          # Privacy policy
│   └── install/          # PWA install page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── landing/          # Landing page sections
│   ├── timer-view.tsx    # Main timer component
│   ├── preset-detail.tsx # Fasting plan details
│   ├── stats-view.tsx    # Statistics dashboard
│   ├── history-view.tsx  # Fasting history
│   ├── journal-dialog.tsx # Post-fast journal
│   ├── settings-sheet.tsx # Settings panel
│   ├── checkout-button.tsx # Stripe checkout
│   ├── premium-gate.tsx  # Premium feature gating
│   └── logo.tsx          # Logo component
├── lib/                   # Utilities and logic
│   ├── translations.ts    # i18n strings (EN/BG)
│   ├── subscription.ts   # Subscription logic
│   ├── storage.ts        # localStorage helpers
│   └── utils.ts         # General utilities
├── hooks/                 # Custom React hooks
├── public/                # Static assets
│   ├── manifest.json     # PWA manifest
│   ├── atarahero.webp   # Hero images
│   └── *.webp           # App screenshots
├── styles/               # Global styles
├── middleware.ts         # Next.js middleware (auth)
├── package.json
└── next.config.mjs
```

## Directory Purposes

**app/:**
- Purpose: Next.js App Router - all routes and pages
- Contains: page.tsx, layout.tsx, api routes
- Key files: `page.tsx` (landing), `app/page.tsx` (app)

**components/:**
- Purpose: All React components
- Contains: UI components, feature components, landing sections
- Key files: Timer, stats, history, settings, journal

**lib/:**
- Purpose: Business logic and utilities
- Contains: Translations, subscription logic, storage helpers
- Key files: `translations.ts`, `subscription.ts`

**public/:**
- Purpose: Static assets
- Contains: Images, PWA manifest, icons

## Key File Locations

**Entry Points:**
- `/` (landing): `app/page.tsx`
- `/app` (authenticated): `app/app/page.tsx`
- Auth: `app/sign-in`, `app/sign-up`

**Configuration:**
- `package.json`: Dependencies
- `next.config.mjs`: Next.js config
- `middleware.ts`: Auth middleware

**Core Logic:**
- Timer: `components/timer-view.tsx`
- Stats: `components/stats-view.tsx`
- Subscriptions: `lib/subscription.ts`

## Naming Conventions

**Files:**
- kebab-case for components: `timer-view.tsx`, `settings-sheet.tsx`
- PascalCase for utilities: `utils.ts`, `storage.ts`

**Directories:**
- kebab-case: `components/landing/`, `app/sign-in/`

## Where to Add New Code

**New Feature:**
- Feature components: `components/`
- Page route: `app/[feature]/page.tsx`

**New Component:**
- UI component: `components/ui/`
- Feature component: `components/`

**Utilities:**
- Shared helpers: `lib/`

---

*Structure analysis: 2026-03-10*
