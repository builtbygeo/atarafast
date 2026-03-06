import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckoutButton } from '@/components/checkout-button'
import { Logo } from '@/components/logo'
import { LifetimeOfferLink } from '@/components/lifetime-offer-link'
import MetabolicJourneyChart from '@/components/MetabolicJourneyChart'
import { Timer, BarChart3, Moon, Smartphone, Globe2, Sparkles } from 'lucide-react'

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
  'Fasting journal (coming soon)',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#0f0f0f', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center">
          <Logo className="w-24 text-white" />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <a href="#features" className="hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Features</a>
          <a href="#philosophy" className="hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Philosophy</a>
          <a href="#pricing" className="hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Pricing</a>
        </div>
        <a
          href="/app"
          className="rounded-xl font-bold text-xs px-5 py-2.5 transition-colors uppercase tracking-widest"
          style={{ backgroundColor: '#22c55e', color: '#0f0f0f' }}
        >
          Launch App
        </a>
      </nav>

      <section id="hero" className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] animate-fade-in" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)' }}>
          Next-Gen Metabolic Fasting
        </div>

        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mt-8 mb-8 leading-[0.9] max-w-5xl">
          Atara — The beautiful<br />
          way to{' '}
          <span className="text-[#22c55e]">
            fast.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed font-sans">
          Stoic-inspired fasting for modern humans. Achieve metabolic flexibility with unshakeable inner calm.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/app"
            className="bg-white text-black px-12 py-5 rounded-[2rem] font-bold text-xl hover:scale-105 transition-all shadow-2xl"
          >
            Launch App
          </Link>
          <a
            href="#features"
            className="border border-zinc-700 hover:bg-zinc-900 px-12 py-5 rounded-[2rem] font-bold text-xl transition-all text-white hover:border-zinc-500"
          >
            See How It Works
          </a>
        </div>

        {/* Hero image container - Locked Aspect Ratio & Clean UI */}
        <div className="relative w-full max-w-[580px] mx-auto mt-12 overflow-hidden rounded-[3rem]">
          {/* Sharp gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10" style={{ background: 'linear-gradient(to top, #0f0f0f 0%, transparent 100%)' }} />
          <Image
            src="/atarahero.webp"
            alt="Atara app showing active fast with metabolic phase ring"
            width={580}
            height={725}
            className="w-full h-auto relative z-0"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </section>

      {/* Ataraxia Origin */}
      <section id="philosophy" className="py-24 px-6 overflow-hidden bg-white/[0.02]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)' }}>
            The Philosophy
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-8 leading-tight">
            Inspired by <span style={{ color: '#22c55e' }}>Ataraxia</span>
          </h2>

          <div className="relative p-10 rounded-[3rem] overflow-hidden group" style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e] opacity-[0.03] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22c55e] opacity-[0.03] -ml-32 -mb-32" />

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

      {/* Plans Mockup Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-[#22c55e]/5 rounded-full" />
              <Image
                src="/atarasamsung.webp"
                alt="Atara Presets Screen"
                width={500}
                height={500}
                className="relative z-10 rounded-[2.5rem] shadow-2xl border border-white/5"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">Choose Your <span className="text-primary">Protocol</span></h2>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              Whether you are a beginner starting with Circadian rhythms or an expert following the Warrior protocol, Atara provides the perfect structure for your goals.
            </p>
            <ul className="space-y-4">
              {['Circadian 12:12', 'Starter 14:10', 'Gold Standard 16:8', 'Advanced 18:6', 'The Warrior 20:4'].map(p => (
                <li key={p} className="flex items-center gap-3 font-bold text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Science & Timeline mockup */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-8 bg-primary/10 text-primary border border-primary/20">
              The Science
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-8 leading-[1.1]">
              Know Your <span className="text-primary">Phases</span>
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed mb-10 text-white/50">
              Fasting isn&apos;t just about not eating. Your body goes through distinct shifts: Sugar Burning, Transition, Ketosis, and Autophagy. Atara visualizes these milestones as you reach them.
            </p>
            <div className="space-y-6">
              {[
                { title: 'Sugar Burning', time: '0-4h', desc: 'Body burns recent dietary glucose.' },
                { title: 'Ketosis', time: '12-16h', desc: 'Liver begins producing ketones from fat.' },
                { title: 'Autophagy', time: '16h+', desc: 'Cellular cleanup and repair kicks in.' }
              ].map((m) => (
                <div key={m.title} className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] group hover:bg-white/[0.05] transition-colors">
                  <div className="w-1.5 h-auto rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-white">{m.title}</span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{m.time}</span>
                    </div>
                    <p className="text-sm text-white/40">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-primary/5 rounded-full opacity-50" />
            <Image
              src="/atara_c2.png"
              alt="Atara Metabolic Timeline Interface"
              width={600}
              height={800}
              className="relative z-10 rounded-[3rem] shadow-2xl scale-110 lg:translate-x-12"
            />
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
          <div className="flex justify-center">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-[#22c55e]/5 rounded-full" />
              <Image
                src="/ataraai.png"
                alt="Atara Coach Card"
                width={500}
                height={500}
                className="relative z-10 rounded-[2.5rem] shadow-2xl border border-white/5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Share Cards / Social mockup */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="relative rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="absolute -inset-10 bg-primary/5 opacity-40" />
              <Image
                src="/streak.webp"
                alt="Atara Streak Stats"
                width={400}
                height={700}
                className="relative z-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(34,197,94,0.3)] border border-white/10"
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
              <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">{f.icon}</div>
              <h3 className="font-bold text-white mb-2 transition-colors duration-300 group-hover:text-primary">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing & Comparison */}
      <section id="pricing" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4">Start free. Upgrade when you're ready.</h2>
        </div>

        {/* Comparison Table */}
        <div className="mb-20 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <th className="py-4 px-6 text-lg font-bold text-white/50 w-1/3">Feature</th>
                <th className="py-4 px-6 text-lg font-bold text-white w-1/3">Free</th>
                <th className="py-4 px-6 text-lg font-black text-primary w-1/3">Atara Pro</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <td className="py-5 px-6 font-medium text-white/80">Triangle + Circle visual</td>
                <td className="py-5 px-6 text-white/60">Yes</td>
                <td className="py-5 px-6 font-bold text-white">Yes</td>
              </tr>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <td className="py-5 px-6 font-medium text-white/80">AI Analysis</td>
                <td className="py-5 px-6 text-white/60">Limited (1/mo)</td>
                <td className="py-5 px-6 font-bold text-white">1 per day (5 per week)</td>
              </tr>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <td className="py-5 px-6 font-medium text-white/80">History & Stats</td>
                <td className="py-5 px-6 text-white/60">Last 30 days</td>
                <td className="py-5 px-6 font-bold text-white">1 per day (5 per week) + Advanced Stats</td>
              </tr>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <td className="py-5 px-6 font-medium text-white/80">Ketosis prediction</td>
                <td className="py-5 px-6 text-white/60">No</td>
                <td className="py-5 px-6 font-bold text-white">Yes</td>
              </tr>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <td className="py-5 px-6 font-medium text-white/80">Data export</td>
                <td className="py-5 px-6 text-white/60">No</td>
                <td className="py-5 px-6 font-bold text-white">JSON (PDF/CSV ready)</td>
              </tr>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <td className="py-5 px-6 font-medium text-white/80">Data Privacy</td>
                <td className="py-5 px-6 text-white/60">Local/Private</td>
                <td className="py-5 px-6 font-bold text-white">Local/Private</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="rounded-2xl p-8 relative overflow-hidden flex flex-col" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-black text-xl mb-1 text-white">Free</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Always</p>
            <div className="text-4xl font-black text-white mb-2">€0<span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}></span></div>
            <p className="text-xs font-semibold mb-6 text-white/40">Free forever</p>

            <Link href="/app" className="mt-auto w-full text-center rounded-xl font-bold py-4 transition-all hover:bg-white/10 block" style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', color: 'white' }}>
              Get Started
            </Link>
          </div>

          {/* Atara Pro Monthly */}
          <div className="rounded-2xl p-8 relative overflow-hidden flex flex-col" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-black text-xl mb-1 text-white">Monthly</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Less than a Burrito</p>
            <div className="text-4xl font-black text-white mb-2">€4.99<span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>/month</span></div>
            <p className="text-xs font-semibold mb-6 text-white/40">Renews every month</p>

            <CheckoutButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!}
              label="Choose Monthly"
              className="mt-auto w-full text-center rounded-xl font-bold py-4 transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.07)', color: 'white' }}
            />
          </div>

          {/* Atara Pro Yearly */}
          <div className="rounded-2xl p-8 relative overflow-hidden flex flex-col" style={{ border: '1px solid #22c55e', background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, transparent 60%)' }}>
            <div className="absolute top-0 right-0 text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-wider" style={{ backgroundColor: '#f97316', color: '#fff' }}>
              Most Popular
            </div>
            <h3 className="font-black text-xl mb-1 text-white">Yearly</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Skip just one dinner and this is yours</p>
            <div className="text-4xl font-black text-white mb-2">€29<span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>/year</span></div>
            <p className="text-xs font-semibold mb-6" style={{ color: '#22c55e' }}>Only €2.42/mo (Save 51%)</p>

            <CheckoutButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!}
              label="Choose Yearly"
              className="mt-auto w-full text-center rounded-xl font-bold py-4 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: '#22c55e', color: '#0f0f0f', boxShadow: '0 8px 32px rgba(34,197,94,0.4)' }}
            />
            <div className="mt-4 text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                Want it forever? <br />
                <LifetimeOfferLink />
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-white/40 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
          Payments are securely processed by Stripe. We never see or store your credit card details.
        </div>

        <p className="text-center text-sm font-medium mt-6 text-white/50">
          Join others who <span className="text-white">upgraded</span> to Atara Pro this month.
        </p>
      </section>

      {/* CTA Banner & PWA Teaser */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto flex flex-col gap-12">
        {/* PWA Banner */}
        <div className="rounded-[3rem] p-10 md:p-16 relative flex flex-col md:flex-row items-center gap-10 text-left overflow-hidden bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 pointer-events-none" />
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Install Atara in 3 seconds <br /><span className="text-white/40 text-2xl font-bold">(no App Store required)</span></h2>
            <p className="mb-8 text-white/60 text-lg">Atara is a Progressive Web App. That means zero App Store fees, total privacy, and instant installation directly to your home screen.</p>
            <Link href="/app" className="inline-block rounded-2xl font-bold px-8 py-4 bg-white text-black transition-transform hover:scale-105 shadow-2xl cursor-pointer">
              Open App to Install
            </Link>
          </div>
          <div className="w-48 sm:w-64 relative z-10 shrink-0 hidden sm:block">
            <Image src="/atarahero.webp" width={256} height={400} alt="PWA on phone screen" className="w-full rounded-[2rem] shadow-2xl border border-white/10 rotate-3 hover:rotate-0 transition-transform" />
          </div>
        </div>

        {/* Standard CTA */}
        <div className="rounded-[3xl] p-12" style={{ border: '1px solid rgba(34,197,94,0.2)', background: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, transparent 100%)' }}>
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
