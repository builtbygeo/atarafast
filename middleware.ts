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

    // 2. App Subdomain Logic (app.atarafast.com)
    if (host.includes('app.atarafast.com')) {
        // CLEAN UP: Prevent "app.atarafast.com/app" -> redirect to "app.atarafast.com/"
        if (url.pathname.startsWith('/app')) {
            const cleanPath = url.pathname.replace(/^\/app/, '') || '/';
            return NextResponse.redirect(new URL(cleanPath, req.url));
        }

        // AUTH: Everything on app subdomain requires auth (unless it's public)
        const isPublic = isPublicRoute(req);
        if (!isPublic) {
            await auth.protect();
        }

        // REWRITE: Direct root/paths to /app folder internally
        const newUrl = new URL(req.url);
        newUrl.pathname = `/app${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(newUrl);
    }

    // 3. Root Domain Logic (atarafast.com)
    // If someone tries to open /app on root domain -> redirect to app subdomain
    if (url.pathname.startsWith('/app')) {
        const appUrl = new URL(req.url);
        appUrl.hostname = 'app.atarafast.com';
        appUrl.pathname = url.pathname.replace(/^\/app/, '') || '/';
        return NextResponse.redirect(appUrl);
    }

    // Default: Just proceed for landing/public routes
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
