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
    const isAppDomain = hostname.includes('app.atarafast.com');

    // Handle WWW redirect
    if (isWWW) {
        const apexHost = hostname.replace('www.', '');
        return NextResponse.redirect(`https://${apexHost}${url.pathname}${url.search}`);
    }

    // Calculate effective path based on host
    // If it's the app domain, we treat it as strictly pointing to our /app folder
    let effectivePath = url.pathname;
    if (isAppDomain && !url.pathname.startsWith('/app') && !url.pathname.startsWith('/api')) {
        effectivePath = `/app${url.pathname === '/' ? '' : url.pathname}`;
    }

    // Auth rules:
    // 1. Landing page (atarafast.com) is public
    // 2. Auth pages (sign-in/sign-up) are public
    // 3. Webhooks are public
    // 4. EVERYTHING on the app domain (app.atarafast.com) requires auth, including the root.
    const isPublic = isPublicRoute(req) && !(isAppDomain && (url.pathname === '/' || url.pathname === ''));

    if (effectivePath.startsWith('/app') && !isPublic) {
        try {
            await auth.protect()
        } catch (error) {
            // Redirect to sign-in on app subdomain, otherwise to landing
            if (isAppDomain) {
                return NextResponse.redirect(new URL('/sign-in', req.url));
            }
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.redirect(new URL('/', req.url));
            }
            return NextResponse.redirect(`https://atarafast.com`);
        }
    }

    // Apply the structural rewrite to direct to the /app folder internally for the app subdomain
    if (isAppDomain && !url.pathname.startsWith('/app') && !url.pathname.startsWith('/api')) {
        url.pathname = `/app${url.pathname === '/' ? '' : url.pathname}`;
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
