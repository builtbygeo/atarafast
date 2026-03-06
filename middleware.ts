import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes for both projects
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhook/stripe',
  '/terms(.*)',
  '/privacy(.*)'
])

export default clerkMiddleware(async (auth, req) => {
    const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').toLowerCase();
    const { pathname } = req.nextUrl;

    // REDUNDANT ROLE DETECTION
    const isApp = 
        process.env.NEXT_PUBLIC_APP_PROJECT === 'true' || 
        host.includes('app.') ||
        host.includes('atara-app');

    // 1. Landing Project Logic
    if (!isApp) {
        // Redirect /app (and deep links) to the app subdomain root
        if (pathname.startsWith('/app')) {
            const cleanPath = pathname.replace(/^\/app/, '') || '/';
            return NextResponse.redirect(new URL(cleanPath, 'https://app.atarafast.com'));
        }
        return NextResponse.next();
    }

    // 2. App Project Logic
    if (isApp) {
        // EXTERNAL REDIRECT: app.atarafast.com/app -> app.atarafast.com/
        // We only do this for the exact path to avoid interfering with deep-link rewrites
        if (pathname === '/app') {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Auth
        if (!isPublicRoute(req)) {
            await auth.protect();
        }

        // INTERNAL REWRITE: Show dashboard content at /
        if (pathname === '/') {
            return NextResponse.rewrite(new URL('/app', req.url));
        }

        // DEEP LINKS: app.atarafast.com/settings -> internally /app/settings
        if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
            // If the path isn't /app already, move it there internally
            if (!pathname.startsWith('/app')) {
                return NextResponse.rewrite(new URL(`/app${pathname}`, req.url));
            }
        }
    }

    return NextResponse.next();
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
