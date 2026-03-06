import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Universal public routes
const isPublic = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/webhook/stripe'])

export default clerkMiddleware(async (auth, req) => {
    const host = (req.headers.get('host') || '').toLowerCase();
    const { pathname } = req.nextUrl;
    
    // REDUNDANT ROLE DETECTION (Env Var + Subdomain + Preview URLs)
    const isAppProject = 
        process.env.NEXT_PUBLIC_APP_PROJECT === 'true' || 
        host.startsWith('app.') || 
        host.includes('atara-app');

    // REDIRECT WWW TO APEX
    if (host.startsWith('www.')) {
        return NextResponse.redirect(new URL(pathname, `https://${host.replace('www.', '')}`));
    }

    if (isAppProject) {
        // === APP PROJECT ROLE ===
        
        // Everything protected except sign-in/up
        if (!isPublic(req)) {
            await auth.protect();
        }

        // FORCE Dashboard serve
        // If they are on "/", we want to show the DASHBOARD (which is in /app folder)
        // We only rewrite if it's NOT a static asset or API call
        if (!pathname.startsWith('/app') && !pathname.startsWith('/api') && !pathname.includes('.')) {
            const rewriteUrl = new URL(`/app${pathname === '/' ? '' : pathname}`, req.url);
            return NextResponse.rewrite(rewriteUrl);
        }
    } else {
        // === LANDING PROJECT ROLE ===
        
        // Block /app access locally on landing, force to subdomain
        if (pathname.startsWith('/app') && process.env.NODE_ENV === 'production') {
            return NextResponse.redirect(`https://app.atarafast.com${pathname.replace(/^\/app/, '') || '/'}`);
        }
    }

    return NextResponse.next();
})

export const config = {
  matcher: [
    // Standard Next.js/Clerk matcher
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
