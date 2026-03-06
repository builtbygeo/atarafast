import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Privacy Policy — Atara',
    description: 'How Atara collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
    const lastUpdated = 'March 5, 2025'
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
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
                <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
                <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Last updated: {lastUpdated}</p>

                <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">1. Overview</h2>
                        <p>Atara (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding your data.</p>
                        <p className="mt-3">We comply with the General Data Protection Regulation (GDPR) and applicable Bulgarian data protection laws.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">2. Data We Collect</h2>

                        <h3 className="font-semibold text-white/90 mb-2 mt-4">2a. Local Storage (No Account Required)</h3>
                        <p>When using Atara without an account, <strong className="text-white">all your fasting data is stored exclusively on your device</strong> using the browser&apos;s local storage. This data never leaves your device and is not accessible to us.</p>
                        <p className="mt-2">This includes: fasting start/end times, completion status, target hours, and history.</p>

                        <h3 className="font-semibold text-white/90 mb-2 mt-4">2b. Account Data (Atara+ Subscribers)</h3>
                        <p>When you create an account, we collect via <strong className="text-white">Clerk</strong> (our authentication provider):</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Email address</li>
                            <li>Name (optional)</li>
                            <li>OAuth profile data if using Google/Apple login</li>
                            <li>Authentication tokens and session data</li>
                        </ul>

                        <h3 className="font-semibold text-white/90 mb-2 mt-4">2c. Payment Data</h3>
                        <p>Payments are processed by <strong className="text-white">Stripe</strong>. We do not store your card details. Stripe collects and processes payment information in accordance with their own privacy policy. We receive only a subscription status identifier.</p>

                        <h3 className="font-semibold text-white/90 mb-2 mt-4">2d. Future: Cloud Sync</h3>
                        <p>When cloud sync is enabled (a future Atara+ feature), your fasting history will be stored securely in our database. You will be explicitly notified before this feature is activated.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">3. How We Use Your Data</h2>
                        <ul className="list-disc list-inside space-y-1.5">
                            <li>To authenticate your identity and manage your account</li>
                            <li>To process subscription payments and manage your billing</li>
                            <li>To provide and improve the Atara service</li>
                            <li>To send transactional emails (receipts, account notifications)</li>
                            <li>To respond to support requests</li>
                        </ul>
                        <p className="mt-3">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">4. Third-Party Services</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong className="text-white">Clerk</strong> — Authentication. <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#22c55e' }}>Privacy Policy</a></li>
                            <li><strong className="text-white">Stripe</strong> — Payment processing. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#22c55e' }}>Privacy Policy</a></li>
                            <li><strong className="text-white">Vercel</strong> — Hosting and analytics. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#22c55e' }}>Privacy Policy</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">5. Data Retention</h2>
                        <p>We retain your account data for as long as your account is active. If you delete your account, your personal data will be removed within 30 days, except where retention is required by law.</p>
                        <p className="mt-3">Local storage data on your device is entirely under your control and can be cleared at any time through your browser settings.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">6. Your Rights (GDPR)</h2>
                        <p>Under GDPR, you have the right to:</p>
                        <ul className="list-disc list-inside mt-3 space-y-1.5">
                            <li>Access the personal data we hold about you</li>
                            <li>Correct inaccurate personal data</li>
                            <li>Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;)</li>
                            <li>Object to processing of your personal data</li>
                            <li>Request data portability</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                        <p className="mt-3">To exercise these rights, contact us at <a href="mailto:privacy@atarafast.com" className="underline" style={{ color: '#22c55e' }}>privacy@atarafast.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">7. Cookies</h2>
                        <p>Atara uses only essential cookies for authentication session management. We do not use tracking, advertising, or analytics cookies.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">8. Children&apos;s Privacy</h2>
                        <p>Atara is not intended for use by children under the age of 16. We do not knowingly collect personal data from children.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">9. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the &ldquo;Last updated&rdquo; date and, where appropriate, by email notification.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">10. Contact</h2>
                        <p>For privacy-related inquiries: <a href="mailto:privacy@atarafast.com" className="underline" style={{ color: '#22c55e' }}>privacy@atarafast.com</a></p>
                        <p className="mt-1">For general support: <a href="mailto:support@atarafast.com" className="underline" style={{ color: '#22c55e' }}>support@atarafast.com</a></p>
                    </section>
                </div>
            </main>

            <footer className="py-8 px-6 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
                <div className="flex justify-center gap-6">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <a href="https://app.atarafast.com" className="hover:text-white transition-colors">Open App</a>
                </div>
            </footer>
        </div>
    )
}
