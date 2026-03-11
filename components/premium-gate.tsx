'use client'

import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import { startCheckout } from '@/lib/subscription'

interface PremiumGateProps {
    children: React.ReactNode
    /** If true, show a blurred + locked overlay instead of hiding content */
    blur?: boolean
    featureName?: string
}

/**
 * Wrap any premium-only UI with this.
 * Renders children as-is for premium users,
 * shows an upgrade prompt for free users.
 */
export function PremiumGate({ children, blur = false, featureName }: PremiumGateProps) {
    // This is imported inside the component to avoid SSR issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useSubscription } = require('@/lib/subscription')
    const { isPremium, isLoaded } = useSubscription()

    if (!isLoaded) return null
    if (isPremium) return <>{children}</>

    if (blur) {
        return (
            <div className="relative">
                <div className="pointer-events-none select-none" style={{ filter: 'blur(6px)', opacity: 0.4 }}>
                    {children}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                    <UpgradeCard featureName={featureName} />
                </div>
            </div>
        )
    }

    return <UpgradeCard featureName={featureName} />
}

function UpgradeCard({ featureName }: { featureName?: string }) {
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
                {featureName ? `${featureName} requires Atara Pro` : 'Atara Pro Feature'}
            </h3>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Start your 14-day free trial to unlock this and all premium features.
            </p>
            <button
                onClick={() => startCheckout()}
                className="w-full rounded-xl font-bold text-sm py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#22c55e', color: '#0f0f0f' }}
            >
                <Sparkles className="w-4 h-4" />
                Start Free Trial
            </button>
        </motion.div>
    )
}
