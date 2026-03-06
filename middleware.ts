import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAppProjectEnv = process.env.NEXT_PUBLIC_APP_PROJECT === 'true';

export default clerkMiddleware(async (auth, req) => {
    const url = new URL(req.url);
    const host = req.headers.get('host') || '';
    
    // NUCLEAR REDUNDANCY: Trust the env var OR the subdomain
    const isAppRole = isAppProjectEnv || host.startsWith('app.atarafast.com');
    
    // 1. WWW Redirect (Global)
    if (host.startsWith('www.atarafast.com')) {
        return NextResponse.redirect(new URL(req.url.replace('www.', ''), req.url));
    }

    // 2. Role-based Routing
    if (isAppRole) {
        // === APP ROLE ===
        
        // Define Public Routes for App (Dashboard is NOT public)
        const isPublic = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/webhook/stripe'])(req);
        if (!isPublic) {
            await auth.protect();
        }

        // INTERNAL REWRITE: Force serve the /app folder
        // If they visit app.atarafast.com/app, we internalize it to /app/app which might fail,
        // so we handle the strip precisely.
        if (!url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next')) {
            const cleanPath = url.pathname.startsWith('/app') ? url.pathname.replace(/^\/app/, '') : url.pathname;
            const newUrl = new URL(req.url);
            newUrl.pathname = `/app${cleanPath === '/' ? '' : cleanPath}`;
            
            // Avoid infinite loop if we are already rewritten
            if (url.pathname !== newUrl.pathname) {
                return NextResponse.rewrite(newUrl);
            }
        }
    } else {
        // === LANDING ROLE ===
        
        // REDIRECT: Block /app on landing project, force to app subdomain
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
