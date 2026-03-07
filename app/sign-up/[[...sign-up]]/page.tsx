import { SignUp } from '@clerk/nextjs'
import { headers } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

export default async function SignUpPage() {
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const isDev = host.includes('localhost') || host.includes('127.0.0.1')
    
    // On production app project, we go back to the main domain
    const landingUrl = isDev ? "/" : "https://atarafast.com"

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] selection:bg-primary/30">
            {/* God-Tier Mesh Gradient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-emerald-900/10 blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] h-[300px] w-[300px] rounded-full bg-blue-900/5 blur-[80px]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
                {/* Real Brand Logo */}
                <div className="mb-10 flex flex-col items-center gap-5">
                    <div className="relative h-24 w-24 overflow-hidden rounded-[2.5rem] bg-white/5 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl transition-transform duration-500 hover:scale-105">
                         <Image 
                            src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzNBY2NrSzJDS09wcGdUOTlUTzBVckh2eG42bCJ9?width=400"
                            alt="Atara Logo"
                            fill
                            className="object-contain p-4"
                            priority
                         />
                    </div>
                    <h1 className="text-4xl font-black tracking-[-0.05em] text-white">ATARA</h1>
                </div>

                {/* Elegant Glassmorphic Card Wrapper */}
                <div className="group relative w-full max-w-[440px]">
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-0 blur transition duration-500 group-hover:opacity-100" />
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#161616]/40 p-1 shadow-2xl backdrop-blur-3xl">
                        <SignUp
                            appearance={{
                                variables: {
                                    colorPrimary: '#22c55e',
                                    colorBackground: 'transparent',
                                    colorText: '#ffffff',
                                    colorTextSecondary: 'rgba(255,255,255,0.7)',
                                    colorInputBackground: 'rgba(255,255,255,0.05)',
                                    colorInputText: '#ffffff',
                                    borderRadius: '1rem',
                                    fontFamily: 'var(--font-inter)',
                                },
                                elements: {
                                    rootBox: 'w-full',
                                    card: 'bg-transparent shadow-none border-none p-6 sm:p-8',
                                    headerTitle: 'text-2xl font-bold tracking-tight text-white mb-2',
                                    headerSubtitle: 'text-zinc-300 font-semibold leading-relaxed',
                                    formButtonPrimary: 'h-11 bg-primary text-black font-bold hover:bg-primary/90 transition-all shadow-[0_0_25px_rgba(34,197,94,0.4)] active:scale-[0.98]',
                                    socialButtonsBlockButton: 'bg-white/5 border-white/5 hover:bg-white/10 text-white transition-all h-11',
                                    socialButtonsBlockButtonText: 'font-semibold text-white',
                                    formFieldInput: 'h-11 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all text-white placeholder:text-zinc-500',
                                    footer: 'bg-transparent mt-4',
                                    footerActionText: 'text-zinc-400 font-medium',
                                    footerActionLink: 'text-primary hover:text-primary/80 font-black',
                                    identityPreviewText: 'text-white font-semibold',
                                    identityPreviewEditButtonIcon: 'text-primary',
                                    formFieldLabel: 'text-zinc-200 font-bold text-[12px] uppercase tracking-wider mb-2',
                                    dividerLine: 'bg-white/10',
                                    dividerText: 'text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em]',
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Refined Navigation */}
                <div className="mt-12 flex flex-col items-center gap-6">
                    <Link
                        href={landingUrl}
                        className="group flex items-center gap-2 text-sm font-bold tracking-widest text-zinc-500 uppercase transition-all hover:text-white"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">←</span>
                        <span>Back to Website</span>
                    </Link>
                    
                    <div className="flex items-center gap-4 text-[11px] font-bold tracking-[0.2em] text-zinc-600 uppercase">
                        <Link href={`${landingUrl}/privacy`} className="hover:text-zinc-400">Privacy</Link>
                        <span className="h-1 w-1 rounded-full bg-zinc-800" />
                        <Link href={`${landingUrl}/terms`} className="hover:text-zinc-400">Terms</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
