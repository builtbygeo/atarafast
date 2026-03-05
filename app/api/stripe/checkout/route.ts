import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
    // Initialize inside handler to avoid build-time issues
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-02-25.clover',
    })

    const { userId, sessionClaims } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const requestedPriceId: string = body.priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!

    const customerId = (sessionClaims?.publicMetadata as Record<string, any> | undefined)?.stripeCustomerId

    if (customerId) {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app`,
        })
        return NextResponse.json({ url: portalSession.url })
    }

    const isLifetime = requestedPriceId === process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID

    const session = await stripe.checkout.sessions.create({
        mode: isLifetime ? 'payment' : 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: requestedPriceId, quantity: 1 }],
        ...(isLifetime ? {} : {
            subscription_data: {
                metadata: { clerkUserId: userId },
            }
        }),
        metadata: { clerkUserId: userId },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?payment=cancelled`,
    })

    return NextResponse.json({ url: session.url })
}
