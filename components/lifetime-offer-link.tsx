'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CheckoutButton } from "./checkout-button"

export function LifetimeOfferLink() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-primary font-bold hover:underline transition-all cursor-pointer">
                    Get Atara Lifetime for just €49 (one-time payment)
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-center mb-2 text-white">Unlock Lifetime Access</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-6 py-6">
                    <div className="text-center rounded-2xl p-8 relative overflow-hidden flex flex-col w-full border border-primary/40 bg-primary/5">
                        <h3 className="font-black text-xl mb-1 text-white">Lifetime</h3>
                        <p className="text-sm mb-4 text-white/60">One-time payment — yours forever</p>
                        <div className="text-4xl font-black text-white mb-2">€49</div>
                        <p className="text-xs font-semibold mb-6 text-[#f97316] uppercase tracking-wider">Limited launch price – normally €79</p>

                        <CheckoutButton
                            priceId={process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID!}
                            label="Unlock Lifetime Now"
                            className="mt-auto w-full text-center rounded-xl font-bold py-4 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            style={{ backgroundColor: 'white', color: '#0f0f0f' }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
