export default function SignInPage() {
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
                    href="/"
                    className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors tracking-widest uppercase"
                >
                    ← Back to Website
                </a>
            </div>
        </div>
    )
}
