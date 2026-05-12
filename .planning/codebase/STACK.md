# Technology Stack

**Analysis Date:** 2026-05-12

## Languages

**Primary:**
- TypeScript 5.7.3 - All source code (`.ts`, `.tsx` files across `app/`, `components/`, `lib/`, `hooks/`, `types/`)

**Secondary:**
- CSS (Tailwind CSS v4 via PostCSS) - Styling in `app/globals.css`
- JavaScript (Service Worker) - `public/sw.js` for push notifications and PWA offline support

## Runtime

**Environment:**
- Node.js ≥20 (CI uses Node 20, project targets Next.js 16)
- Next.js 16.1.6 (App Router)

**Package Manager:**
- npm (no version specified)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with App Router (`app/` directory)
- React 19.2.4 - UI library (`react-dom` 19.2.4)
- Tailwind CSS 4.2.1 - Utility-first CSS framework with CSS variables theming

**Testing:**
- Playwright 1.58.2 - E2E testing framework
  - Config: `playwright.config.ts`
  - Test location: `tests/e2e/` (only `quota.spec.ts` present)

**Build/Dev:**
- PostCSS 8.5.8 - CSS processing pipeline
- Autoprefixer 10.0.4 - CSS vendor prefixing
- TypeScript 5.7.3 - Type checking and compilation

## Key Dependencies

**Critical:**
- `@clerk/nextjs` ^7.0.1 - Authentication and user management (Clerk)
- `stripe` ^20.4.0 - Server-side Stripe SDK for payment processing
- `@stripe/stripe-js` ^8.9.0 - Client-side Stripe.js for payment UI
- `react-hook-form` ^7.54.1 - Form state management and validation
- `zod` ^3.24.1 - Schema validation (used with react-hook-form via `@hookform/resolvers` ^3.9.1)
- `framer-motion` ^12.34.4 - Animation library for UI transitions

**UI Component System (shadcn/ui "new-york" style):**
- `@radix-ui/*` (20+ packages) - Headless UI primitives (accordion, dialog, dropdown-menu, select, tabs, toast, tooltip, etc.)
- `lucide-react` ^0.564.0 - Icon library
- `cmdk` 1.1.1 - Command palette / search
- `embla-carousel-react` 8.6.0 - Carousel component
- `vaul` ^1.1.2 - Drawer component
- `sonner` ^1.7.1 - Toast notifications
- `input-otp` 1.4.2 - OTP input component
- `react-resizable-panels` ^2.1.7 - Resizable panel layout

**Utilities:**
- `clsx` ^2.1.1 - Conditional class name construction
- `tailwind-merge` ^3.3.1 - Tailwind class deduplication
- `class-variance-authority` ^0.7.1 - Variant-based component styling
- `date-fns` 4.1.0 - Date manipulation

**Data & Charts:**
- `recharts` ^2.15.4 - Charting library
- `qrcode.react` ^4.2.0 - QR code generation for share features

**Rich Content:**
- `react-markdown` ^10.1.0 - Markdown rendering (blog posts, AI reports)
- `remark-gfm` ^4.0.1 - GitHub Flavored Markdown support
- `@tailwindcss/typography` ^0.5.19 - Tailwind typography plugin for prose styling
- `html-to-image` ^1.11.13 - DOM-to-image export for share cards

**Theming:**
- `next-themes` ^0.4.6 - Dark/light/system theme switching

**Analytics:**
- `@vercel/analytics` 1.6.1 - Vercel Analytics integration

**Other:**
- `react-day-picker` 9.13.2 - Date picker component
- `tw-animate-css` 1.3.3 - Tailwind animation utilities

## Configuration

**Environment:**
- Configuration via environment variables (`.env.local` for development, Vercel environment variables for production)
- `.env.example` present - documents all required variables
- Environment variable naming: `NEXT_PUBLIC_*` for client-side, `STRIPE_*`, `CLERK_*`, `OPENROUTER_*` for server-side

**Build:**
- `next.config.mjs` - Next.js configuration:
  - `typescript.ignoreBuildErrors: true` (TS errors do not block builds)
  - `images.unoptimized: true` (disables Next.js image optimization)
  - `transpilePackages: ['remark-gfm', 'react-markdown', 'micromark-extension-gfm']`
- `tsconfig.json` - TypeScript configuration:
  - `strict: true`
  - `moduleResolution: "bundler"`
  - Path alias: `@/*` → `./*` (root-relative imports)
  - `jsx: "react-jsx"` (React 19 JSX transform)
- `postcss.config.mjs` - PostCSS with `@tailwindcss/postcss` plugin
- `components.json` - shadcn/ui configuration (new-york style, neutral base color, CSS variables, RSC enabled)
- `playwright.config.ts` - E2E test config (testDir: `tests/e2e`, baseURL: `http://localhost:3000`)

**Linting:**
- ESLint referenced in `package.json` scripts (`"lint": "eslint ."`) but no ESLint config file found in project root (may use Next.js built-in ESLint or be configured elsewhere)

## Platform Requirements

**Development:**
- Node.js 20+
- Environment variables (see `.env.example` for required vars)
- Run: `npm run dev` → starts Next.js dev server on port 3000
- Build: `npm run build` → Next.js production build
- Lint: `npm run lint` → ESLint
- E2E: `npm run test:e2e` → Playwright

**Production:**
- Deployed on Vercel (evidenced by `@vercel/analytics`, Vercel environment variables pattern, domain `atarafast.com`)
- Multi-domain architecture: landing at `atarafast.com`, app at `app.atarafast.com`
- PWA support: `public/manifest.json`, `public/sw.js` (service worker for push notifications)
- iOS PWA optimizations: apple-touch-icon, `appleWebApp` metadata, safe-area CSS padding

---

*Stack analysis: 2026-05-12*
