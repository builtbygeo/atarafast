import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhook/stripe'])
const isAppRoute = createRouteMatcher(['/app(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const url = new URL(req.url);
    const hostHeader = req.headers.get('host') || '';
    const xForwardedHost = req.headers.get('x-forwarded-host') || '';
    const hostname = (xForwardedHost || hostHeader).toLowerCase();
    
    const isWWW = hostname.startsWith('www.');
    const isAppDomain = hostname.startsWith('app.atarafast.com');
    const isLandingDomain = hostname === 'atarafast.com' || hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1');

    // 1. WWW Redirect (Absolute priority)
    if (isWWW) {
        const apexHost = hostname.replace('www.', '');
        return NextResponse.redirect(`https://${apexHost}${url.pathname}${url.search}`);
    }

    // 2. Cross-domain Enforcement
    // If on landing domain but trying to access /app, redirect to app subdomain
    if (isLandingDomain && url.pathname.startsWith('/app') && process.env.NODE_ENV === 'production') {
        const appUrl = new URL(url.toString());
        appUrl.hostname = 'app.atarafast.com';
        return NextResponse.redirect(appUrl);
    }

    // 3. Subdomain Structural Rewrite
    // For app.atarafast.com, every path (including /) is treated as being inside /app
    if (isAppDomain && !url.pathname.startsWith('/api')) {
        // If they visit app.atarafast.com/app, we could leave it or redirect to / to keep it clean.
        // But for now, just ensure the internal path is prefixed with /app for Next.js folder routing.
        if (!url.pathname.startsWith('/app')) {
            url.pathname = `/app${url.pathname === '/' ? '' : url.pathname}`;
            // We rewrite here, but we still need to check auth below on the effective path
        }
    }

    const effectivePath = url.pathname;
    const isPublic = isPublicRoute(req);
    
    // 4. Auth Enforcement
    // The app folder /app and the app subdomain ALWAYS require auth.
    const requiresAuth = effectivePath.startsWith('/app') || isAppDomain;

    if (requiresAuth && !isPublic) {
        try {
            await auth.protect();
        } catch (error) {
            // If they are on the app subdomain, we MUST send them to sign-in.
            // If we send them to '/' on the same domain, it loops.
            if (isAppDomain) {
                return NextResponse.redirect(new URL('/sign-in', req.url));
            }
            // Otherwise, back to landing
            return NextResponse.redirect(process.env.NODE_ENV === 'development' 
                ? new URL('/', req.url) 
                : `https://atarafast.com`);
        }
    }

    // Apply the rewrite for the app subdomain after auth check
    if (isAppDomain && !url.pathname.startsWith('/api') && (xForwardedHost || hostHeader)) {
        // This is the dual rewrite/auth logic. Next.js will see the /app folder.
        return NextResponse.rewrite(url);
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
