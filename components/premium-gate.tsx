'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import { useSubscription, startCheckout } from '@/lib/subscription'
import { getCompletedFastCount } from '@/lib/quota'
import { ENABLE_PREMIUM } from '@/lib/features'

interface PremiumGateProps {
    children: ReactNode
    fallback?: ReactNode
    requirements?: { minFasts?: number; maxDaily?: number }
    reason?: string
}

export function PremiumGate({ children, fallback = null, requirements, reason }: PremiumGateProps) {
    const { isPremium } = useSubscription()
    const fastCount = getCompletedFastCount()

    if (!ENABLE_PREMIUM) {
        return <>{children}</>
    }

    if (isPremium) {
        return <>{children}</>
    }

    if (requirements?.minFasts && fastCount >= requirements.minFasts) {
        return <>{children}</>
    }

    return <UpgradeCard reason={reason} />
}

function UpgradeCard({ reason }: { reason?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs rounded-2xl p-6 text-center"
            style={{ backgroundColor: 'rgba(15,15,15,0.95)', border: '1px solid rgba(34,197,94,0.3)' }}
        >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <Lock className="w-5 h-5" style={{ color: '#22c55e' }} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">
                {reason || 'Feature Unavailable'}
            </h3>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {reason ? 'Complete requirements to unlock.' : 'Start your 14-day free trial to unlock this and all premium features.'}
            </p>
            <button
                onClick={() => startCheckout()}
                className="w-full rounded-xl font-bold text-sm py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#22c55e', color: '#0f0f0f' }}
            >
                <Sparkles className="w-4 h-4" />
                {reason ? 'Upgrade to Unlock' : 'Start Free Trial'}
            </button>
        </motion.div>
    )
}
