import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes that don't need authentication
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhook/stripe',
  '/terms(.*)',
  '/privacy(.*)',
  '/blog(.*)'
])

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl;

    // Direct Auth Protection
    // We protect everything EXCEPT the landing page and public routes listed above.
    const isPublic = isPublicRoute(req);
    if (!isPublic) {
        await auth.protect();
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
