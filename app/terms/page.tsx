import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Terms of Service — Atara',
    description: 'Terms and conditions for using the Atara fasting application.',
}

export default function TermsPage() {
    const lastUpdated = 'March 5, 2025'
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white dark" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
            <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)' }}>
                        <span className="font-black text-xs" style={{ color: '#22c55e' }}>A</span>
                    </div>
                    <span className="font-bold text-sm">Atara</span>
                </Link>
                <a href="https://app.atarafast.com" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)' }}>
                    Open App
                </a>
            </nav>

            <main className="max-w-2xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-black tracking-tight mb-2">Terms of Service</h1>
                <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Last updated: {lastUpdated}</p>

                <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing or using the Atara application and website (atarafast.com and app.atarafast.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the App.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">2. Description of Service</h2>
                        <p>Atara is a personal fasting tracker application that helps users monitor intermittent fasting sessions, track metabolic phases, and view personal health insights. The App is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease or medical condition.</p>
                        <p className="mt-3">Always consult a qualified healthcare professional before starting any fasting or dietary program, particularly if you have a pre-existing medical condition.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">3. Free Trial and Subscription</h2>
                        <p>Atara offers a <strong className="text-white">14-day free trial</strong> for the Atara+ subscription plan. During the trial period, you will have full access to all premium features.</p>
                        <ul className="list-disc list-inside mt-3 space-y-1.5">
                            <li>Your payment method will be charged at the end of the free trial unless you cancel before the trial period ends.</li>
                            <li>Subscriptions automatically renew monthly unless cancelled.</li>
                            <li>You may cancel your subscription at any time through your account settings or via the billing portal.</li>
                            <li>Cancellation takes effect at the end of the current billing period.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">4. Refund Policy</h2>
                        <p>Payments are generally non-refundable. However, if you experience a technical issue that prevents you from accessing the service, please contact us at <a href="mailto:support@atarafast.com" className="underline" style={{ color: '#22c55e' }}>support@atarafast.com</a> within 7 days of the charge.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">5. User Accounts</h2>
                        <p>To access Atara+ features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">6. Prohibited Uses</h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc list-inside mt-3 space-y-1.5">
                            <li>Use the App for any unlawful purpose</li>
                            <li>Attempt to reverse engineer or extract the source code</li>
                            <li>Share your account credentials with others</li>
                            <li>Misuse the App in ways that could damage, disable, or impair it</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">7. Intellectual Property</h2>
                        <p>All content, design, code, logos, and trademarks within the App are the exclusive property of Atara and are protected by applicable intellectual property laws.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">8. Disclaimer of Warranties</h2>
                        <p>The App is provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or meet your specific requirements.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">9. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law, Atara shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the App.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">10. Governing Law</h2>
                        <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of Bulgaria and applicable European Union regulations, including GDPR.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">11. Changes to Terms</h2>
                        <p>We reserve the right to modify these Terms at any time. We will notify you of significant changes by updating the &ldquo;Last updated&rdquo; date above. Continued use of the App after changes constitutes acceptance.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">12. Contact</h2>
                        <p>For any questions regarding these Terms, please contact us at: <a href="mailto:support@atarafast.com" className="underline" style={{ color: '#22c55e' }}>support@atarafast.com</a></p>
                    </section>
                </div>
            </main>

            <footer className="py-8 px-6 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
                <div className="flex justify-center gap-6">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <a href="https://app.atarafast.com" className="hover:text-white transition-colors">Open App</a>
                </div>
            </footer>
        </div>
    )
}
