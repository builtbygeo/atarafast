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

    const isApp = 
        process.env.NEXT_PUBLIC_APP_PROJECT === 'true' || 
        host.includes('app.');

    // 1. Landing Project -> Redirect /app to subdomain
    if (!isApp) {
        if (pathname.startsWith('/app')) {
            const redirectUrl = new URL(pathname, 'https://app.atarafast.com');
            redirectUrl.pathname = pathname.replace(/^\/app/, '') || '/';
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
    }

    // 2. App Project -> Auth + Force /app path
    if (isApp) {
        // Auth Protection
        if (!isPublicRoute(req)) {
            await auth.protect();
        }

        // FORCE REDIRECT from root to /app
        // This makes https://app.atarafast.com -> https://app.atarafast.com/app
        // Definitive fix for landing page showing on app subdomain
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/app', req.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
