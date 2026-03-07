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
    const host = req.nextUrl.hostname.toLowerCase();
    const { pathname } = req.nextUrl;
    const isDev = host.includes('localhost') || host.includes('127.0.0.1');

    // Role detection
    const isApp = 
        process.env.NEXT_PUBLIC_APP_PROJECT === 'true' || 
        host.startsWith('app.') || 
        host.includes('.app.') ||
        host.includes('atara-app') ||
        (isDev && pathname.startsWith('/app'));

    // 1. Landing Project Logic
    if (!isApp) {
        if (pathname.startsWith('/app') && !isDev) {
            const cleanPath = pathname.replace(/^\/app/, '') || '/';
            return NextResponse.redirect(new URL(cleanPath, 'https://app.atarafast.com'));
        }
        return NextResponse.next();
    }

    // 2. App Project Logic (app.atarafast.com)
    // Redirect app.atarafast.com/app -> app.atarafast.com/
    if (!isDev && (pathname === '/app' || pathname === '/app/')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Auth Protection
    const isPublic = isPublicRoute(req);
    if (!isPublic) {
        await auth.protect();
    }

    // INTERNAL REWRITE: Only show dashboard content at /
    if (pathname === '/' || pathname === '') {
        const url = req.nextUrl.clone();
        url.pathname = '/app';
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
})

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
