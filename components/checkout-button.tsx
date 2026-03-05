'use client'

import { useRouter } from 'next/navigation'

interface CheckoutButtonProps {
    priceId: string
    label: string
    style?: React.CSSProperties
    className?: string
}

/**
 * Clicking this button:
 * 1. If user is signed in → directly opens Stripe Checkout for the chosen plan
 * 2. If not signed in → redirects to /sign-up with the plan encoded,
 *    so after sign-up it goes straight to checkout
 */
export function CheckoutButton({ priceId, label, style, className }: CheckoutButtonProps) {
    const router = useRouter()

    async function handleClick() {
        // Check auth state via a lightweight API call
        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId }),
        })

        if (res.status === 401) {
            // Not signed in — send to sign-up, then back to checkout for this plan
            router.push(`/sign-up?redirect=/checkout?priceId=${encodeURIComponent(priceId)}`)
            return
        }

        const data = await res.json()
        if (data.url) {
            window.location.href = data.url
        }
    }

    return (
        <button onClick={handleClick} style={style} className={className}>
            {label}
        </button>
    )
}
