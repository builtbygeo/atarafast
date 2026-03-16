import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckoutButton } from '@/components/checkout-button'
import { Logo } from '@/components/logo'
import { LifetimeOfferLink } from '@/components/lifetime-offer-link'
import MetabolicJourneyChart from '@/components/MetabolicJourneyChart'
import { PhilosophyDrawer } from '@/components/landing/PhilosophyDrawer'
import {
  LandingHero,
  LandingScience,
  LandingAudience,
  LandingWhyTrack,
  LandingLevelUp,
  LandingSocialProof,
} from '@/components/landing/hero-sections'
import { Timer, BarChart3, Moon, Smartphone, Globe2, Sparkles } from 'lucide-react'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'Atara — Master Your Metabolism',
  description: 'Free forever with basic tracking and visuals. Pro unlocks unlimited history, analytics, custom themes & streak insights.',
  openGraph: {
    title: 'Atara — Master Your Metabolism',
    description: 'The beautiful way to fast. Track sugar burning, transition, and ketosis phases with beautiful metabolic visualizations.',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

const features = [
  {
    icon: <Timer className="w-8 h-8 text-primary" />,
    title: 'Metabolic Phase Timer',
    desc: 'Watch your body shift from sugar burning to ketosis in real time. Color-coded phases make complex biology instantly readable.',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: 'Deep Analytics',
    desc: 'Weekly charts, completion rates, streaks — everything you need to understand and improve your fasting practice.',
  },
  {
    icon: <Moon className="w-8 h-8 text-primary" />,
    title: 'Science-Backed Plans',
    desc: 'From Circadian 12h to Warrior 20:4 — every plan is grounded in metabolic science and optimized for real results.',
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: 'Install as an App',
    desc: 'Tap "Share" then "Add to Home Screen" on iOS, or "Install App" from your browser menu on Android. Feels like a native app.',
  },
  {
    icon: <Globe2 className="w-8 h-8 text-primary" />,
    title: 'Bulgarian & English',
    desc: 'Fully localized in Bulgarian and English. Switch languages instantly without losing your data.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
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
  'Fasting journal',
]

export default async function LandingPage() {
  const headerList = await headers()
  const host = headerList.get('host') || ''
  const isDev = host.includes('localhost') || host.includes('127.0.0.1')
  const appUrl = isDev ? '/app' : 'https://app.atarafast.com'

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white dark" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#0f0f0f', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center">
          <Logo className="w-24 text-white" />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <a href="#features" className="hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Features</a>
          <PhilosophyDrawer />
          <a href="#pricing" className="hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Pricing</a>
        </div>
        <a
          href={appUrl}
          className="rounded-xl font-bold text-xs px-5 py-2.5 transition-colors uppercase tracking-widest"
          style={{ backgroundColor: '#22c55e', color: '#0f0f0f' }}
        >
          Launch App
        </a>
      </nav>

      {/* NEW: Hero Section */}
      <LandingHero />

      {/* NEW: Science Section */}
      <LandingScience />

      {/* NEW: Audience Section */}
      <LandingAudience />

      {/* NEW: Why Track Section */}
      <LandingWhyTrack />

      {/* NEW: Level Up Section */}
      <LandingLevelUp />

      {/* NEW: Social Proof Section */}
      <LandingSocialProof />

      {/* Plans Mockup Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[400px] overflow-hidden rounded-[2rem] group">
              <Image
                src="/atarasamsung.webp"
                alt="Atara Presets Screen"
                width={400}
                height={400}
                className="w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">Choose Your <span className="text-primary">Protocol</span></h2>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              Whether you are a beginner starting with Circadian rhythms or an expert following the Warrior protocol, Atara provides the perfect structure for your goals.
            </p>
            
            {/* Protocol Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Circadian', hours: '12:12', desc: 'Beginner friendly', color: "oklch(0.45 0.05 240)" },
                { name: 'Starter', hours: '14:10', desc: 'Easy start', color: "oklch(0.5 0.07 180)" },
                { name: 'Gold Standard', hours: '16:8', desc: 'Most popular', color: "oklch(0.55 0.09 145)" },
                { name: 'Advanced', hours: '18:6', desc: 'Experienced', color: "oklch(0.6 0.12 75)" },
                { name: 'Warrior', hours: '20:4', desc: 'Expert level', color: "oklch(0.5 0.15 35)" },
                { name: 'Custom', hours: 'Any', desc: 'Your own plan', highlight: true, color: "oklch(0.4 0.03 260)" },
              ].map((p) => (
                <div 
                  key={p.name}
                  className="p-4 rounded-xl transition-all hover:-translate-y-1 cursor-pointer border group"
                  style={{ 
                    backgroundColor: `color-mix(in oklch, ${p.color}, transparent 92%)`,
                    borderColor: `color-mix(in oklch, ${p.color}, transparent 70%)`
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm group-hover:text-white transition-colors">{p.name}</span>
                    <span className="text-xs font-black" style={{ color: p.color }}>{p.hours}</span>
                  </div>
                  <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Analytics Mockup Section */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">Insights Powered by <span className="text-primary">AI</span></h2>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              Atara doesn&apos;t just track time. It analyzes your habits. Our AI Coach provides personalized metabolic insights based on your unique fasting history.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-primary font-black text-2xl mb-1">78</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Day Streak</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-primary font-black text-2xl mb-1">91%</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Goal Success</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[380px] overflow-hidden rounded-[2rem] group">
              <Image
                src="/ataraai.png"
                alt="Atara Coach Card"
                width={380}
                height={380}
                className="w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Share Cards / Social mockup */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px] overflow-hidden rounded-[2rem] group -rotate-1 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/streak.webp"
                alt="Atara Streak Stats"
                width={320}
                height={560}
                className="w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-8 bg-white/5 text-white/60 border border-white/10">
              Community
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-8">
              Celebrate Your <span style={{ color: '#22c55e' }}>Streaks</span>
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed text-white/50 mb-8">
              Your discipline deserves recognition. Atara generates gorgeous, minimalist share cards for Instagram and beyond, so you can inspire others with your journey.
            </p>
            <div className="flex flex-wrap gap-4">
              {['#MetabolicFlexibility', '#AtaraLife', '#AtaraFast', '#StoicFasting'].map(tag => (
                <span key={tag} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-black tracking-widest uppercase text-white/40 italic">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wellbeing Graph Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-4 bg-primary/10 text-primary border border-primary/20">
            Results
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">
            With regular fasting you increase your <span className="text-primary">wellbeing</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
            See how you start on low energy and poor sleep, but end up reaching the peak with high energy, sharp mental clarity, and deep, restorative sleep.
          </p>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <MetabolicJourneyChart />
        </div>
      </section>

      {/* Journal Section */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[400px] overflow-hidden rounded-[2rem] group">
              <Image
                src="/atarajournal.jpg"
                alt="Atara Fasting Journal"
                width={400}
                height={500}
                className="w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-6 bg-primary/10 text-primary border border-primary/20">
              After Your Fast
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">Your <span className="text-primary">fasting journal</span>, reimagined</h2>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              Track not just hours, but how you feel. Note your energy levels, mood, cravings, and breakthroughs. Build a personal record of your metabolic journey.
            </p>
            <ul className="space-y-4">
              {[
                'Quick mood & energy check-ins',
                'Track cravings and how you overcame them',
                'Celebrate wins with personal notes',
                'AI-powered insights from your patterns'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                </li>
              ))}
            </ul>
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
              className="rounded-2xl p-6 transition-all hover:border-primary/30 group cursor-default"
              style={{ border: '1px solid rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-2 transition-colors duration-300 group-hover:text-primary">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing & Comparison */}
      <section id="pricing" className="py-32 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-6 bg-primary/10 text-primary border border-primary/20">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Start free. Upgrade when you're ready.</h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">No hidden fees. Cancel anytime. Your data stays yours.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Free */}
          <div className="rounded-[2rem] p-8 relative overflow-hidden flex flex-col group transition-all duration-300 border border-primary/40 bg-primary/5">
            <div className="absolute top-0 right-0 text-[10px] font-black px-5 py-2 rounded-bl-2xl uppercase tracking-widest bg-primary text-black">
              Current Version
            </div>
            <h3 className="font-black text-lg mb-1 text-white/60 uppercase tracking-widest">Atara Core</h3>
            <div className="text-5xl font-black text-white mb-1 mt-2">€0</div>
            <p className="text-sm text-white/40 mb-8">Free forever</p>

            <ul className="space-y-3 mb-8 flex-1">
              {['Core fasting timer', '2 preset plans', 'Last 30 days history', 'Basic metabolic phases'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                  <span className="w-1 h-1 rounded-full bg-primary" /> {f}
                </li>
              ))}
            </ul>

            <Link href={appUrl} className="w-full text-center rounded-xl font-bold py-3.5 transition-all bg-primary text-black hover:opacity-90">
              Use Free Version
            </Link>
          </div>

          {/* Atara Monthly - Locked */}
          <div className="rounded-[2rem] p-8 relative overflow-hidden flex flex-col group transition-all duration-300 opacity-60 grayscale" style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="bg-black/80 text-white font-bold px-4 py-2 rounded-full border border-white/20">Coming Soon</span>
            </div>
            <h3 className="font-black text-lg mb-1 text-white/60 uppercase tracking-widest">Monthly</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-5xl font-black text-white/50">€4.99</span>
              <span className="text-white/20 text-sm">/month</span>
            </div>
            <p className="text-sm text-white/20 mb-8 mt-1">Not available yet</p>

            <ul className="space-y-3 mb-8 flex-1">
              {['AI Metabolic Coach', 'All fasting plans', 'Unlimited stats'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/20">
                  <span className="w-1 h-1 rounded-full bg-white/10" /> {f}
                </li>
              ))}
            </ul>
            <button disabled className="w-full text-center rounded-xl font-bold py-3.5 border border-white/5 text-white/20 cursor-not-allowed">
              Locked
            </button>
          </div>

          {/* Atara Yearly - Locked */}
          <div className="rounded-[2rem] p-8 relative overflow-hidden flex flex-col group transition-all duration-300 opacity-60 grayscale" style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="bg-black/80 text-white font-bold px-4 py-2 rounded-full border border-white/20">Coming Soon</span>
            </div>
            <h3 className="font-black text-lg mb-1 text-white/60 uppercase tracking-widest">Yearly</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-5xl font-black text-white/50">€29</span>
              <span className="text-white/20 text-sm">/year</span>
            </div>
            <p className="text-sm text-white/20 mb-8 mt-1">Not available yet</p>

            <ul className="space-y-3 mb-8 flex-1">
              {['Everything in Monthly', 'Priority support'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/20">
                  <span className="w-1 h-1 rounded-full bg-white/10" /> {f}
                </li>
              ))}
            </ul>
            <button disabled className="w-full text-center rounded-xl font-bold py-3.5 border border-white/5 text-white/20 cursor-not-allowed">
              Locked
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-white/30 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
          Payments securely processed by Stripe. We never see your card.
        </div>
      </section>

      {/* CTA Banner & PWA Teaser */}
      <section id="how" className="py-24 px-6 text-center max-w-4xl mx-auto flex flex-col gap-12">
        {/* PWA Banner */}
        <div className="rounded-[3rem] p-10 md:p-16 relative flex flex-col md:flex-row items-center gap-10 text-left overflow-hidden bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 pointer-events-none" />
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Install Atara in 3 seconds <br /><span className="text-white/40 text-2xl font-bold">(no App Store required)</span></h2>
            <p className="mb-8 text-white/60 text-lg">Atara is a Progressive Web App. That means zero App Store fees, total privacy, and instant installation directly to your home screen.</p>
            <Link href="/install" className="inline-block rounded-2xl font-bold px-8 py-4 bg-white text-black transition-transform hover:scale-105 shadow-2xl cursor-pointer">
              How to Install →
            </Link>
          </div>
          <div className="w-40 sm:w-52 relative z-10 shrink-0 hidden sm:block">
            <div className="overflow-hidden rounded-[1.5rem] group">
              <Image 
                src="/atarahero.webp" 
                width={208} 
                height={325} 
                alt="PWA on phone screen" 
                className="w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.02]" 
              />
            </div>
          </div>
        </div>

        {/* Standard CTA */}
        <div className="rounded-[3xl] p-12" style={{ border: '1px solid rgba(34,197,94,0.2)', background: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, transparent 100%)' }}>
          <h2 className="text-4xl font-black tracking-tight mb-4">Ready to start fasting smarter?</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>Join Atara. Your body has been waiting for this.</p>
          <Link
            href={appUrl}
            className="inline-block rounded-2xl font-bold px-10 py-4 transition-all hover:scale-105 shadow-2xl shadow-primary/20 animate-pulse"
            style={{ backgroundColor: '#22c55e', color: '#0f0f0f' }}
          >
            Start Your Free Trial →
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 max-w-4xl mx-auto border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-4 bg-primary/10 text-primary border border-primary/20">
            FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
            Common <span className="text-primary">Questions</span>
          </h2>
        </div>

        <div className="space-y-6">
          {[
            {
              q: "Atara vs Zero vs Simple: Why choose Atara?",
              a: "Atara is built by fasters, for fasters. Unlike Zero or Simple, we prioritize aesthetics and privacy above all else. Atara is a PWA that stores data locally, avoiding the cloud-sync tracking inherent in native apps. Plus, our 'Triangle' metabolic progress bar is objectively cooler."
            },
            {
              q: "What is a PWA and why do you use it?",
              a: "A Progressive Web App (PWA) looks and feels like a native app but runs in your browser and on your home screen. We use it to bypass the 30% App Store 'tax' and because it keeps your data 100% private, without Apple or Google tracking your fasting habits."
            },
            {
              q: "Can I suggest new features?",
              a: "Yes! Atara is in active development. You can reach out directly to the creator on X (Twitter) @builtbygeo or via email. We love hearing from our metabolic practitioners."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-white">{item.q}</h3>
              <p className="text-zinc-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-5xl mx-auto mb-10 text-center">
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 flex flex-wrap justify-center gap-x-4 gap-y-2">
            <span>100% private</span> <span className="text-white/20">•</span>
            <span>No ads in free version</span> <span className="text-white/20">•</span>
            <span>Made in Europe</span> <span className="text-white/20">•</span>
            <span>Cancel anytime</span>
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-sm">
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-white/50">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link href="/app" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Learn</h4>
            <ul className="space-y-2 text-white/50">
              <li><a href="/blog/best-intermittent-fasting-apps-2026" className="hover:text-white transition-colors">Best Fasting Apps 2026</a></li>
              <li><a href="/blog/how-to-choose-the-right-fasting-tracker-in-2026" className="hover:text-white transition-colors">Choose Tracker Guide</a></li>
              <li><a href="/blog/intermittent-fasting-phases-explained-visually" className="hover:text-white transition-colors">Fasting Phases Explained</a></li>
              <li><a href="/blog/why-triangle-progress-bar-better-than-circle" className="hover:text-white transition-colors">Triangle vs Circle</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Guides</h4>
            <ul className="space-y-2 text-white/50">
              <li><a href="/blog/fasting-for-beginners-2026-free-tools" className="hover:text-white transition-colors">Fasting for Beginners</a></li>
              <li><a href="/blog/atara-vs-zero-vs-simple-fasting" className="hover:text-white transition-colors">Atara vs Zero vs Simple</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-white/50">
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-white/50">
              <li><a href="mailto:support@atarafast.com" className="hover:text-white transition-colors">support@atarafast.com</a></li>
              <li className="pt-2"><a href="https://x.com/builtbygeo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors opacity-60 hover:opacity-100">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter / X
              </a></li>
              <li><span className="inline-flex items-center gap-2 text-white/20 cursor-default">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.64 11H17V7h3.64c.2 0 .36.16.36.36v3.28c0 .2-.16.36-.36.36zM8 11h3V7H8c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1zM22 6.5A2.5 2.5 0 0 0 19.5 4H4.5A2.5 2.5 0 0 0 2 6.5v11A2.5 2.5 0 0 0 4.5 20h15a2.5 2.5 0 0 0 2.5-2.5v-11z"/></svg>
                Product Hunt (Soon)
              </span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}>
          <div className="flex items-center gap-2">
            <Logo className="w-16 opacity-50 text-white" />
            <span className="ml-2">© {new Date().getFullYear()}</span>
          </div>
          <p>
            Designed to help you master your metabolism.
          </p>
        </div>
      </footer>
    </div>
  )
}