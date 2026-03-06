import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhook/stripe'])
const isAppRoute = createRouteMatcher(['/app(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const url = new URL(req.url);
    const host = req.headers.get('host') || '';

    // 1. WWW Redirect
    if (host.startsWith('www.atarafast.com')) {
        return NextResponse.redirect(new URL(req.url.replace('www.', ''), req.url));
    }

    // 2. Cross-domain Enforcement (atarafast.com/app -> app.atarafast.com)
    // Only redirect if we are on the landing domain and NOT in local dev
    if (host === 'atarafast.com' && url.pathname.startsWith('/app') && process.env.NODE_ENV === 'production') {
        const appUrl = new URL(url.toString());
        appUrl.hostname = 'app.atarafast.com';
        appUrl.pathname = url.pathname.replace(/^\/app/, '') || '/';
        return NextResponse.redirect(appUrl);
    }

    // 3. Auth Enforcement
    // We protect everything that STARTS with /app in the internal path.
    // Note: Vercel rewrites app.atarafast.com/ to /app/ internally, so Clerk will see /app.
    const isPublic = isPublicRoute(req);
    if (url.pathname.startsWith('/app') && !isPublic) {
        await auth.protect();
    }

    return NextResponse.next();
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
