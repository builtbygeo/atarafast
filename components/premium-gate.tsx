'use client'

import { ReactNode } from 'react'
import { useSubscription } from '@/lib/subscription'
import { ENABLE_PREMIUM } from '@/lib/features'

interface PremiumGateProps {
    children: ReactNode
    fallback?: ReactNode
}

export function PremiumGate({ children, fallback = null }: PremiumGateProps) {
    const { isPremium } = useSubscription()

    if (!ENABLE_PREMIUM) {
        return <>{children}</>
    }

    return isPremium ? <>{children}</> : <>{fallback}</>
}
