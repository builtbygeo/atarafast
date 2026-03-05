import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
})

export async function POST(req: NextRequest) {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const requestedPriceId: string =
        body.priceId ||
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!

    // If user already has an active subscription, open billing portal instead
    const customerId = (sessionClaims?.publicMetadata as Record<string, string> | undefined)?.stripeCustomerId

    if (customerId) {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app`,
        })
        return NextResponse.json({ url: portalSession.url })
    }

    // Create a new checkout session — NO trial here, trial is clock-based (free)
    // Stripe is only charged when user explicitly subscribes
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                price: requestedPriceId,
                quantity: 1,
            },
        ],
        subscription_data: {
            metadata: { clerkUserId: userId },
        },
        metadata: { clerkUserId: userId },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?payment=cancelled`,
    })

    return NextResponse.json({ url: session.url })
}
