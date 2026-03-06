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
    // 1. Get Host & Path
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
    const host = hostHeader.toLowerCase();
    const { pathname } = req.nextUrl;

    // 2. Identify Role
    // We trust NEXT_PUBLIC_APP_PROJECT, or the 'app.' subdomain, or the 'atara-app' vercel host.
    const isAppProject = 
        process.env.NEXT_PUBLIC_APP_PROJECT === 'true' || 
        host.includes('app.atarafast.com') || 
        host.includes('atara-app.vercel.app');

    // DEBUG: This will show up in Vercel 'Logs' tab
    console.log(`[Middleware] Host: ${host} | Role: ${isAppProject ? 'APP' : 'LANDING'} | Path: ${pathname}`);

    // 3. Global WWW -> Apex Redirect
    if (host.startsWith('www.')) {
        return NextResponse.redirect(new URL(pathname, `https://${host.replace('www.', '')}`));
    }

    // 4. Handle App Project
    if (isAppProject) {
        // AUTH: Protect everything except predefined public routes
        if (!isPublicRoute(req)) {
            await auth.protect();
        }

        // INTERNAL REWRITE: Force serve the dashboard contents
        // Logic: app.atarafast.com/ -> serves /app (which is app/app/page.tsx)
        if (!pathname.startsWith('/app') && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
            const rewriteUrl = new URL(`/app${pathname === '/' ? '' : pathname}`, req.url);
            const response = NextResponse.rewrite(rewriteUrl);
            response.headers.set('x-atara-role', 'APP-REWRITTEN');
            return response;
        }
    } 
    
    // 5. Handle Landing Project
    else {
        // REDIRECT: If someone hits /app on the landing domain, throw them to the subdomain
        if (pathname.startsWith('/app')) {
            const redirectUrl = new URL(pathname, 'https://app.atarafast.com');
            // Remove the duplicated /app if present (e.g. atarafast.com/app -> app.atarafast.com/)
            redirectUrl.pathname = pathname.replace(/^\/app/, '') || '/';
            return NextResponse.redirect(redirectUrl);
        }
    }

    const res = NextResponse.next();
    res.headers.set('x-atara-role', isAppProject ? 'APP-DIRECT' : 'LANDING');
    return res;
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
