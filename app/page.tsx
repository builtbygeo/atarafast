import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckoutButton } from '@/components/checkout-button'
import { Logo } from '@/components/logo'

export const metadata: Metadata = {
  title: 'Atara — Master Your Metabolism',
  description: 'A science-backed fasting companion that tracks your metabolic phases in real time. Start your 14-day free trial today.',
  openGraph: {
    title: 'Atara — Master Your Metabolism',
    description: 'Track sugar burning, transition, and ketosis phases with beautiful metabolic visualizations.',
    type: 'website',
  },
}

const features = [
  {
    icon: '⏱',
    title: 'Metabolic Phase Timer',
    desc: 'Watch your body shift from sugar burning to ketosis in real time. Color-coded phases make complex biology instantly readable.',
  },
  {
    icon: '📊',
    title: 'Deep Analytics',
    desc: 'Weekly charts, completion rates, streaks — everything you need to understand and improve your fasting practice.',
  },
  {
    icon: '🌙',
    title: 'Science-Backed Plans',
    desc: 'From Circadian 12h to OMAD 23h — every plan is grounded in metabolic science and optimized for real results.',
  },
  {
    icon: '📱',
    title: 'Install as an App',
    desc: 'Add Atara directly to your home screen — no App Store, no downloads. One tap to install, feels like a native app on iOS and Android.',
  },
  {
    icon: '🌍',
    title: 'Bulgarian & English',
    desc: 'Fully localized in Bulgarian and English. Switch languages instantly without losing your data.',
  },
  {
    icon: '✨',
    title: 'Share Your Progress',
    desc: 'Generate gorgeous share cards for Instagram, TikTok and Pinterest directly from the app.',
  },
]

const freeFeatures = [
  'Core fasting timer',
  '2 preset plans (Circadian 12h, 16:8)',
  'Last 5 fasts history',
  'Basic metabolic phases display',
]

const premiumFeatures = [
  'Everything in Free',
  'All 6+ fasting plans',
  'Custom duration planner',
  'Full statistics & analytics',
  'AI Metabolic Coach (20 sessions/mo)',
  'Social share cards',
  'Cloud sync across devices (coming soon)',
  'Smart phase notifications (coming soon)',
  'Fasting journal (coming soon)',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl border-b" style={{ backgroundColor: 'rgba(15,15,15,0.8)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5">
          <Logo className="w-24 text-white" />
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
        <Link
          href="/app"
          className="rounded-xl font-bold text-sm px-5 py-2.5 transition-colors"
          style={{ backgroundColor: '#22c55e', color: '#0f0f0f' }}
        >
          Launch App
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6" style={{ border: '1px solid rgba(34,197,94,0.3)', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: 'pulse 2s infinite' }} />
          14-day free trial — no credit card required
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 leading-none max-w-3xl">
          Master Your{' '}
          <span style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Metabolism
          </span>
        </h1>

        <p className="text-lg sm:text-xl max-w-xl mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Atara tracks your fasting journey at the metabolic level — from sugar burning to ketosis — with science-backed plans and stunning real-time visualizations.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-20">
          <Link
            href="/app"
            className="rounded-2xl font-bold text-base px-8 py-4 transition-all hover:scale-105"
            style={{ backgroundColor: '#22c55e', color: '#0f0f0f', boxShadow: '0 16px 40px rgba(34,197,94,0.35)' }}
          >
            Start 14-Day Free Trial
          </Link>
          <a
            href="#features"
            className="rounded-2xl font-bold text-base px-8 py-4 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
          >
            See How It Works
          </a>
        </div>

        {/* Hero image — real mockup */}
        <div className="relative w-full max-w-[420px] mx-auto mt-8">
          <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10" style={{ background: 'linear-gradient(to top, #0f0f0f, transparent)' }} />
          <Image
            src="/hero-mockup-v2.png"
            alt="Atara app showing active fast with metabolic phase ring"
            width={520}
            height={650}
            className="w-full rounded-[2.5rem]"
            style={{ boxShadow: '0 40px 100px rgba(34,197,94,0.15), 0 20px 60px rgba(0,0,0,0.8)' }}
            priority
          />
        </div>
      </section>

      {/* Ataraxia Origin */}
      <section className="py-24 px-6 overflow-hidden bg-white/[0.02]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)' }}>
            The Philosophy
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-8 leading-tight">
            Inspired by <span style={{ color: '#22c55e' }}>Ataraxia</span>
          </h2>

          <div className="relative p-10 rounded-[3rem] overflow-hidden group" style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e] opacity-[0.03] blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22c55e] opacity-[0.03] blur-[100px] -ml-32 -mb-32" />

            <p className="text-xl sm:text-2xl font-medium leading-relaxed italic mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
              &ldquo;Ataraxia is the Stoic state of unshakeable inner calm and freedom from emotional disturbance.&rdquo;
            </p>

            <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Fasting is more than just a biological process. It is a mental practice in discipline and stillness.
              We built Atara to help you navigate your metabolic shifting with the same clarity and peace that the ancient Stoics practiced.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4">Everything You Need</h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>Built for serious fasters who want to understand what&apos;s happening inside their body.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>Start free. Upgrade when you&apos;re ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="rounded-2xl p-8 flex flex-col" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-black text-xl mb-1 text-white">Free</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Full basic experience</p>
            <div className="text-4xl font-black mb-8 text-white">€0<span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>/month</span></div>
            <ul className="space-y-3 mb-8 flex-grow">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <span className="mt-0.5 shrink-0" style={{ color: '#22c55e' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/app" className="block w-full text-center rounded-xl font-bold py-3.5 text-white transition-all hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.07)' }}>
              Get Started Free
            </Link>
          </div>

          {/* Atara+ Monthly */}
          <div className="rounded-2xl p-8 relative overflow-hidden flex flex-col" style={{ border: '1px solid rgba(34,197,94,0.3)', backgroundColor: 'rgba(34,197,94,0.03)' }}>
            <h3 className="font-black text-xl mb-1 text-white">Monthly</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Flexible metabolic mastery</p>
            <div className="text-4xl font-black text-white mb-2">€3.69<span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>/mo</span></div>
            <p className="text-xs font-semibold mb-6" style={{ color: '#22c55e' }}>✓ 14-day free trial (no card)</p>
            <div className="h-px mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <ul className="space-y-3 mb-8 flex-grow">
              {premiumFeatures.slice(0, 5).map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <span className="mt-0.5 shrink-0" style={{ color: '#22c55e' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <CheckoutButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!}
              label="Choose Monthly"
              className="w-full text-center rounded-xl font-bold py-4 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: '#22c55e', color: '#0f0f0f', boxShadow: '0 8px 24px rgba(34,197,94,0.2)' }}
            />
          </div>

          {/* Atara+ Yearly */}
          <div className="rounded-2xl p-8 relative overflow-hidden flex flex-col" style={{ border: '1px solid #22c55e', background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, transparent 60%)' }}>
            <div className="absolute top-0 right-0 text-[10px] font-black px-3 py-1 rounded-bl-xl" style={{ backgroundColor: '#22c55e', color: '#0f0f0f' }}>
              BEST VALUE
            </div>
            <h3 className="font-black text-xl mb-1 text-white">Yearly</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Long-term transformation</p>
            <div className="text-4xl font-black text-white mb-2">€12<span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>/year</span></div>
            <p className="text-xs font-semibold mb-6" style={{ color: '#22c55e' }}>Save ~73% over monthly</p>
            <div className="h-px mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <ul className="space-y-3 mb-8 flex-grow">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <span className="mt-0.5 shrink-0" style={{ color: '#22c55e' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <CheckoutButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!}
              label="Choose Yearly"
              className="w-full text-center rounded-xl font-bold py-4 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: '#22c55e', color: '#0f0f0f', boxShadow: '0 8px 32px rgba(34,197,94,0.4)' }}
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 text-center max-w-2xl mx-auto">
        <div className="rounded-3xl p-12" style={{ border: '1px solid rgba(34,197,94,0.2)', background: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, transparent 100%)' }}>
          <h2 className="text-4xl font-black tracking-tight mb-4">Ready to start fasting smarter?</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>Join Atara. Your body has been waiting for this.</p>
          <Link
            href="/app"
            className="inline-block rounded-2xl font-bold px-10 py-4 transition-all hover:scale-105"
            style={{ backgroundColor: '#22c55e', color: '#0f0f0f', boxShadow: '0 16px 40px rgba(34,197,94,0.35)' }}
          >
            Start Your Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <div className="flex items-center gap-2">
            <Logo className="w-16 opacity-50 text-white" />
            <span className="ml-2">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/app" className="hover:text-white transition-colors">Open App</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
