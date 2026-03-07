import { SignUp } from '@clerk/nextjs'
import { headers } from 'next/headers'

export default async function SignUpPage() {
    const headerList = await headers()
    const host = headerList.get('host') || ''
    
    const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
    const isProdKey = clerkPubKey.startsWith('pk_live_')
    
    // If using production keys, we always go back to the main marketing site
    const landingUrl = isProdKey ? "https://atarafast.com" : "/"

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
            <div className="flex flex-col items-center gap-6">
                {/* Trial badge above the form */}
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold" style={{ border: '1px solid rgba(34,197,94,0.4)', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    14 days free — full Atara+ access
                </div>
                <SignUp
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
