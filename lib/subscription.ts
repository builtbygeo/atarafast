'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { getSettings } from './storage'

export type Plan = 'free' | 'premium'
export type SubscriptionStatus = 'active' | 'trialing' | 'cancelled' | 'free'

const TRIAL_DAYS = 14
export function useSubscription() {
    const { user, isLoaded, isSignedIn } = useUser()

    const [devForcePremium, setDevForcePremium] = useState(false)
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            try {
                // Must handle case where getSettings runs before storage is available or similar
                setDevForcePremium(!!getSettings().devForcePremium)
            } catch (e) {
                console.error("Failed to load dev settings", e)
            }
        }
    }, [])

    if (!isLoaded) {
        return { isLoaded: false, isPremium: false, isTrialing: false, trialDaysLeft: 0, plan: 'free' as Plan, status: 'free' as SubscriptionStatus, isSignedIn: false }
    }

    if (!isSignedIn || !user) {
        return { isLoaded: true, isPremium: false, isTrialing: false, trialDaysLeft: 0, plan: 'free' as Plan, status: 'free' as SubscriptionStatus, isSignedIn: false }
    }

    const metadata = user.publicMetadata as {
        plan?: Plan
        subscriptionStatus?: SubscriptionStatus
        stripeCustomerId?: string
    }

    const stripePlan = metadata?.plan ?? 'free'
    const stripeStatus = metadata?.subscriptionStatus ?? 'free'
    const hasStripePremium =
        stripePlan === 'premium' ||
        stripeStatus === 'active' ||
        stripeStatus === 'trialing'

    // Clock-based trial: 14 days from Clerk account creation, no card required
    const accountCreatedAt = user.createdAt ? new Date(user.createdAt) : null
    const now = new Date()
    const msInDay = 1000 * 60 * 60 * 24
    const daysSinceSignup = accountCreatedAt
        ? (now.getTime() - accountCreatedAt.getTime()) / msInDay
        : Infinity
    const isClockTrial = daysSinceSignup < TRIAL_DAYS
    const trialDaysLeft = isClockTrial ? Math.ceil(TRIAL_DAYS - daysSinceSignup) : 0

    // Free access list
    const userEmail = user?.primaryEmailAddress?.emailAddress
    const FREE_EMAILS = ["gag1000x@icloud.com", "atara.app.team@gmail.com"] // Hardcoded fallback or use env var
    const envEmails = process.env.NEXT_PUBLIC_FREE_USERS?.split(",") || []
    const isFreeAccessEmail = Boolean(userEmail && (FREE_EMAILS.includes(userEmail) || envEmails.includes(userEmail)))

    const isPremium = hasStripePremium || isClockTrial || isFreeAccessEmail || devForcePremium
    const isTrialing = isClockTrial && !hasStripePremium && !isFreeAccessEmail

    const status: SubscriptionStatus = hasStripePremium
        ? (stripeStatus as SubscriptionStatus)
        : isClockTrial
            ? 'trialing'
            : 'free'

    return {
        isLoaded: true,
        isSignedIn: true,
        plan: stripePlan,
        status,
        isPremium,
        isTrialing,
        trialDaysLeft,
        stripeCustomerId: metadata?.stripeCustomerId,
    }
}

export async function startCheckout(priceId?: string) {
    const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
    })
    const data = await res.json()
    if (data.url) {
        window.location.href = data.url
    }
}
