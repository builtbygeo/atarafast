import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhook/stripe'])
const isAppRoute = createRouteMatcher(['/app(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const url = new URL(req.url);
    const host = req.headers.get('host') || '';
    const isAppProject = process.env.NEXT_PUBLIC_APP_PROJECT === 'true';

    // 1. WWW Redirect (Global)
    if (host.startsWith('www.atarafast.com')) {
        return NextResponse.redirect(new URL(req.url.replace('www.', ''), req.url));
    }

    // 2. Role-based Routing
    if (isAppProject) {
        // === APP PROJECT LOGIC ===
        
        // AUTH: Everything on the app project requires auth (except public routes)
        const isPublic = isPublicRoute(req);
        if (!isPublic) {
            await auth.protect();
        }

        // REWRITE: Silent internal rewrite to /app folder
        // If the path is already /app (from a legacy link), we leave it or rewrite it.
        // The goal is that internally Next.js sees /app/...
        if (!url.pathname.startsWith('/app') && !url.pathname.startsWith('/api')) {
            const newUrl = new URL(req.url);
            newUrl.pathname = `/app${url.pathname === '/' ? '' : url.pathname}`;
            return NextResponse.rewrite(newUrl);
        }
    } else {
        // === LANDING PROJECT LOGIC ===
        
        // REDIRECT: If someone hits /app on landing, send them to the App Project
        if (url.pathname.startsWith('/app') && process.env.NODE_ENV === 'production') {
            const appUrl = new URL(req.url);
            appUrl.hostname = 'app.atarafast.com';
            appUrl.pathname = url.pathname.replace(/^\/app/, '') || '/';
            return NextResponse.redirect(appUrl);
        }
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
