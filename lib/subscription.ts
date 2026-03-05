'use client'

import { useUser } from '@clerk/nextjs'

export type Plan = 'free' | 'premium'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'free'

export function useSubscription() {
    const { user, isLoaded, isSignedIn } = useUser()

    if (!isLoaded) {
        return { isLoaded: false, isPremium: false, plan: 'free' as Plan, status: 'free' as SubscriptionStatus, isSignedIn: false }
    }

    if (!isSignedIn) {
        return { isLoaded: true, isPremium: false, plan: 'free' as Plan, status: 'free' as SubscriptionStatus, isSignedIn: false }
    }

    const metadata = user.publicMetadata as {
        plan?: Plan
        subscriptionStatus?: SubscriptionStatus
        stripeCustomerId?: string
    }

    const plan = metadata?.plan ?? 'free'
    const status = metadata?.subscriptionStatus ?? 'free'
    const isPremium = plan === 'premium' || status === 'trialing' || status === 'active'

    return {
        isLoaded: true,
        isSignedIn: true,
        plan,
        status,
        isPremium,
        stripeCustomerId: metadata?.stripeCustomerId,
    }
}

export async function startCheckout() {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
        window.location.href = data.url
    }
}
