import { SignIn } from '@clerk/nextjs'
import { headers } from 'next/headers'

export default async function SignInPage() {
    const headerList = await headers()
    const host = headerList.get('host') || ''
    
    // Dynamic link for "Back to Website"
    const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
    const isProdKey = clerkPubKey.startsWith('pk_live_')
    const landingUrl = isProdKey ? "https://atarafast.com" : "/"

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
            <div className="flex flex-col items-center gap-6">
                <SignIn
                    appearance={{
                        variables: {
                            colorPrimary: '#22c55e',
                            colorBackground: '#1a1a1a',
                            colorText: '#ffffff',
                            colorTextSecondary: 'rgba(255,255,255,0.6)',
                            colorInputBackground: '#252525',
                            colorInputText: '#ffffff',
                            borderRadius: '0.75rem',
                        },
                        elements: {
                            card: 'shadow-2xl border border-white/10',
                            headerTitle: 'text-white font-black',
                            formButtonPrimary: 'bg-[#22c55e] text-[#0f0f0f] hover:bg-[#16a34a]',
                        },
                    }}
                />
                <a
                    href={landingUrl}
                    className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors tracking-widest uppercase"
                >
                    ← Back to Website
                </a>
            </div>
        </div>
    )
}
