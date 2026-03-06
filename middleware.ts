import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhook/stripe'])
const isAppRoute = createRouteMatcher(['/app(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const url = new URL(req.url);
    const hostname = req.headers.get('host') || '';
    const isAppDomain = hostname === 'app.atarafast.com' || hostname.startsWith('app.atarafast.com:');

    // Calculate effective path based on host
    let effectivePath = url.pathname;
    if (isAppDomain && !url.pathname.startsWith('/app') && !url.pathname.startsWith('/api')) {
        effectivePath = `/app${url.pathname === '/' ? '' : url.pathname}`;
    }

    // Only protect /app routes. For the app domain, `/` is not public (it maps to the app dashboard).
    const isPublic = isPublicRoute(req) && !(isAppDomain && url.pathname === '/');

    if (effectivePath.startsWith('/app') && !isPublic) {
        try {
            await auth.protect()
        } catch (error) {
            // If auth protection fails during redirect loops, fall back to home
            // But if we are on the app domain, returning home will just loop. Redirect to sign-in or main landing.
            // Sending them to the main marketing domain is safest to avoid endless rewrite loops.
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.redirect(new URL('/', req.url));
            }
            return NextResponse.redirect(`https://atarafast.com`);
        }
    }

    // Apply the structural rewrite to direct to the /app folder internally
    if (effectivePath !== url.pathname) {
        url.pathname = effectivePath;
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
