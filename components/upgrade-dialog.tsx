"use client"

import { useState } from "react"
import { Sparkles, Trophy, Star, X } from "lucide-react"
import { startCheckout } from "@/lib/subscription"

interface UpgradeDialogProps {
    open: boolean
    onClose: () => void
}

export function UpgradeDialog({ open, onClose }: UpgradeDialogProps) {
    const [loading, setLoading] = useState<string | null>(null)

    if (!open) return null

    const handleSelect = async (priceId: string) => {
        setLoading(priceId)
        await startCheckout(priceId)
        setLoading(null) // in case they return
    }

    const monthlyId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
    const yearlyId = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID
    const lifetimeId = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-50 w-full max-w-md bg-card border border-border/50 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors z-10"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center bg-gradient-to-b from-primary/10 to-transparent">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary relative">
                        <Sparkles className="h-8 w-8" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Upgrade to Atara+</h2>
                    <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                        Unlock advanced statistics, AI coaching, all fasting protocols, and 1 per day (5 per week) features.
                    </p>
                </div>

                <div className="px-6 pb-8 flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-3">
                        {monthlyId && (
                            <button
                                onClick={() => handleSelect(monthlyId)}
                                disabled={!!loading}
                                className="relative flex flex-col p-4 rounded-2xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 active:scale-[0.98] transition-all text-left group"
                            >
                                <div className="flex justify-between items-center w-full mb-1">
                                    <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">Monthly</span>
                                    <span className="font-black text-lg text-foreground">€4.99<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground">Billed monthly, cancel anytime.</p>
                                {loading === monthlyId && <span className="absolute inset-y-0 right-4 flex items-center"><div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" /></span>}
                            </button>
                        )}

                        {yearlyId && (
                            <button
                                onClick={() => handleSelect(yearlyId)}
                                disabled={!!loading}
                                className="relative flex flex-col p-4 rounded-2xl border border-primary/40 bg-primary/5 hover:bg-primary/10 active:scale-[0.98] transition-all text-left shadow-lg shadow-primary/5 group"
                            >
                                <div className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Most Popular</div>
                                <div className="flex justify-between items-center w-full mb-1">
                                    <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                                        <Star className="h-4 w-4 text-primary" /> Yearly
                                    </span>
                                    <span className="font-black text-lg text-primary">€29<span className="text-xs font-normal text-primary/70">/yr</span></span>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground/80">Only €2.42/mo (Save 51%)</p>
                                {loading === yearlyId && <span className="absolute inset-y-0 right-4 flex items-center"><div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" /></span>}
                            </button>
                        )}

                        {lifetimeId && (
                            <button
                                onClick={() => handleSelect(lifetimeId)}
                                disabled={!!loading}
                                className="relative flex flex-col p-4 rounded-2xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 active:scale-[0.98] transition-all text-left group"
                            >
                                <div className="flex justify-between items-center w-full mb-1">
                                    <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                                        <Trophy className="h-4 w-4 text-amber-500" /> Lifetime
                                    </span>
                                    <span className="font-black text-lg text-foreground">€49<span className="text-xs font-normal text-muted-foreground"> one-time</span></span>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground">Pay once, use Atara+ forever.</p>
                                {loading === lifetimeId && <span className="absolute inset-y-0 right-4 flex items-center"><div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" /></span>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
