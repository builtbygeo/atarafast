import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
    // Initialize inside handler → avoids build-time crash without env vars
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-02-25.clover',
    })

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const clerk = await clerkClient()

    switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription
            const clerkUserId = subscription.metadata?.clerkUserId
            if (!clerkUserId) break

            const isActive = ['active', 'trialing'].includes(subscription.status)

            await clerk.users.updateUserMetadata(clerkUserId, {
                publicMetadata: {
                    subscriptionStatus: subscription.status,
                    subscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    plan: isActive ? 'premium' : 'free',
                },
            })
            break
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription
            const clerkUserId = subscription.metadata?.clerkUserId
            if (!clerkUserId) break

            await clerk.users.updateUserMetadata(clerkUserId, {
                publicMetadata: {
                    subscriptionStatus: 'cancelled',
                    plan: 'free',
                },
            })
            break
        }
    }

    return NextResponse.json({ received: true })
}
