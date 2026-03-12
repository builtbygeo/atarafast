"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Scale, Brain, Heart, Moon, XCircle, Play, Flame, Snowflake, Wind, Download, ArrowRight } from "lucide-react"

const ACCENT = "#22c55e" // Using Atara's green instead of amber

export function LandingHero() {
  return (
    <section id="hero" className="relative pt-28 pb-16 px-6 flex flex-col items-center text-center">
      <div className="max-w-3xl mx-auto">
        {/* Label pill */}
        <div 
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8"
          style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: ACCENT }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
          Next-Gen Metabolic Fasting
        </div>

        {/* H1 */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.95]">
          Your body already<br />
          knows how to<br />
          <span style={{ color: ACCENT }}>fix itself.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
          Give it a 16-hour window. No diet changes. No willpower. Just timing — and watch what happens inside.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/app"
            prefetch={false}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
            style={{ backgroundColor: ACCENT, color: "#000" }}
          >
            Try Atara Free
          </Link>
          <a
            href="#science"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-white/70 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
          >
            See How It Works
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex gap-6 justify-center flex-wrap text-sm text-white/40 font-medium">
          <span>✓ No credit card</span>
          <span>✓ Works offline</span>
          <span>✓ 100% private</span>
        </div>
      </div>
    </section>
  )
}

const phases = [
  { hour: "0–4h", name: "Sugar Burning", desc: "Body runs on glucose from your last meal." },
  { hour: "4–12h", name: "Transition", desc: "Glucose depletes. Body hunts for alternate fuel." },
  { hour: "12–16h", name: "Ketosis", desc: "Fat becomes fuel. Mental clarity sharpens.", active: true },
  { hour: "16h+", name: "Autophagy", desc: "Cellular repair begins. Damaged proteins cleared." },
]

export function LandingScience() {
  return (
    <section id="science" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: ACCENT }}>
            The Science
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4">
            Not a diet.<br />
            <span style={{ color: ACCENT }}>A biological window.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-md mx-auto leading-relaxed">
            Every hour you fast, your body moves through distinct metabolic phases. Atara tracks them in real time.
          </p>
        </div>

        {/* Phase grid */}
        <div className="phase-grid">
          {phases.map((p) => (
            <div
              key={p.hour}
              className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{
                backgroundColor: p.active ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${p.active ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {p.active && (
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                  Goal zone
                </div>
              )}
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: p.active ? ACCENT : "rgba(255,255,255,0.4)" }}>
                {p.hour}
              </div>
              <div className="text-lg font-bold text-white mb-2">{p.name}</div>
              <div className="text-sm text-white/40 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          A 16:8 window reaches both ketosis and autophagy — every day, no supplements.
        </p>
      </div>
    </section>
  )
}

const audiences = [
  { id: "weight", icon: Scale, label: "Lose Weight", hook: "No diet. No calorie counting.", headline: "Lose weight without changing what you eat.", body: "You don't have to eat less. You have to eat in a smaller window. Same meals, same portions — but when your body isn't processing food for 14–16 hours, it burns stored fat instead.", stat: "3–8% body weight loss in 3–24 weeks" },
  { id: "clarity", icon: Brain, label: "Mental Clarity", hook: "Fewer meals = fewer decisions.", headline: "One less thing to think about. Every day.", body: "Every meal is a decision — what, when, how much. Fasting collapses that to a window. No breakfast debate, no 11am snack guilt.", stat: "Decision fatigue drops. Ketone-fueled focus follows." },
  { id: "health", icon: Heart, label: "Cellular Health", hook: "Your body repairs itself.", headline: "Ketosis at 12h. Autophagy at 16h.", body: "At hour 12 your body switches to fat for fuel. At 16, autophagy begins — cellular cleanup. Your body's built-in maintenance mode.", stat: "mTOR suppressed. AMPK activated." },
  { id: "sleep", icon: Moon, label: "Better Sleep", hook: "Late eating disrupts sleep.", headline: "Stop eating at 8pm. Wake up rested.", body: "Your circadian rhythm controls both metabolism and sleep. Eating late sends wrong signals. A fasting window realigns them.", stat: "Earlier last meal → deeper sleep" },
  { id: "junk", icon: XCircle, label: "Less Junk Food", hook: "Cravings need a slot.", headline: "When the window closes, cravings stop.", body: "Most junk food happens from boredom or habit. A fasting window removes those moments — by structure, not willpower.", stat: "Ghrelin adapts in 10–14 days" },
  { id: "begin", icon: Play, label: "Just Starting", hook: "Most of it is sleep.", headline: "12 hours. Half you're asleep.", body: "Stop eating at 9pm. Have breakfast at 9am. You just did a 12-hour fast. That's a real start.", stat: "Start 12:12. Upgrade when ready." },
]

export function LandingAudience() {
  const [hovered, setHovered] = useState<string>("clarity")

  // Always show full content - just hover to preview different categories
  const activeId = hovered
  const aud = audiences.find(a => a.id === activeId)

  // Handle click for mobile - toggle the selected category
  const handleClick = (id: string) => {
    if (hovered === id) {
      // If clicking same category, don't change
      return
    }
    setHovered(id)
  }

  return (
    <section id="for-you" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: ACCENT }}>
            Who Is Fasting For
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-3">
            Fasting works for everyone.<br />
            <span style={{ color: ACCENT }}>Your reason makes it yours.</span>
          </h2>
          <p className="text-sm text-white/40">Tap or hover to explore different reasons</p>
        </div>

        {/* Icon grid - always 3 per row for even distribution */}
        <div className="grid grid-cols-3 gap-3 mb-10 max-w-lg mx-auto">
          {audiences.map((a) => {
            const isA = activeId === a.id
            const Icon = a.icon
            return (
              <button
                key={a.id}
                onMouseEnter={() => setHovered(a.id)}
                onClick={() => handleClick(a.id)}
                className="rounded-xl px-3 py-4 cursor-pointer flex flex-col items-center gap-2 outline-none transition-all"
                style={{
                  backgroundColor: isA ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isA ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`,
                  color: isA ? ACCENT : "rgba(255,255,255,0.4)",
                  transform: isA ? "translateY(-4px)" : "none",
                }}
              >
                <Icon className="w-8 h-8" />
                <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">{a.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content panel - always shows full content */}
        <div className="flex items-center justify-center">
          {aud && (
            <div
              className="rounded-2xl p-8 max-w-lg w-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                {aud.label}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{aud.headline}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-4">{aud.body}</p>
              <div 
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
                style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: ACCENT }}
              >
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: ACCENT }} />
                {aud.stat}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const trackReasons = [
  { title: "You don't have to remember.", body: "No mental math. No checking the clock. Atara tells you exactly where you are — what phase, how much time left. Your only job is to start." },
  { title: "What you don't measure, you can't improve.", body: "Streaks, completion rates, weekly patterns — data turns vague effort into visible progress. You stop guessing and start knowing." },
  { title: "Your data becomes your coach.", body: "The longer you track, the smarter Atara gets. AI surfaces patterns specific to you — not generic advice, but insight from your own biology." },
]

export function LandingWhyTrack() {
  return (
    <section id="why-track" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: ACCENT }}>
              Why Track
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 leading-tight">
              The fast you track<br />
              <span style={{ color: ACCENT }}>compounds.</span>
            </h2>
            <p className="text-white/50 mb-6 leading-relaxed">
              Memory is unreliable. Intention without data is just hope. Tracking turns fasting from a habit into a system.
            </p>
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: ACCENT, color: "#000" }}
            >
              Start Tracking Free
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {trackReasons.map((r, i) => (
              <div
                key={i}
                className="rounded-xl p-6 flex gap-4 items-start transition-all duration-300 hover:translate-x-1"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: ACCENT }}>
                  <span className="text-lg font-bold">{i + 1}</span>
                </div>
                <div>
                  <div className="font-bold text-white mb-1">{r.title}</div>
                  <div className="text-sm text-white/40 leading-relaxed">{r.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// NEW: Level Up Your Fast - 3 Biohacks Section
// ============================================

const biohacks = [
  {
    icon: Flame,
    title: "Sauna",
    schedule: "20–30 min, 4–7× week",
    benefit: "40–66% lower risk of heart disease & dementia (2026 data)",
    detail: "Heat shock proteins + deeper autophagy when done post-fast.",
    color: "#f97316",
  },
  {
    icon: Snowflake,
    title: "Cold Exposure",
    schedule: "2–3 min cold shower",
    benefit: "Activates brown fat, massive dopamine boost, faster fat burn",
    detail: "Perfect finisher on fasting days.",
    color: "#06b6d4",
  },
  {
    icon: Wind,
    title: "Wim Hof Breathwork",
    schedule: "10 min morning",
    benefit: "Cuts inflammation, calms the nervous system, skyrockets energy",
    detail: "Best done at the start of your fast.",
    color: "#8b5cf6",
  },
]

export function LandingLevelUp() {
  return (
    <section id="level-up" className="py-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: ACCENT }}>
            Zero-Cost Biohacks
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">
            Level Up Your Fast<br />
            <span style={{ color: ACCENT }}>without spending a dime.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-4">
            Fasting does 80% of the work. These three ancient tools (used by Stoics, SEALs, and top biohackers in 2026) do the rest — with zero extra time or money.
          </p>
          <p className="text-sm text-white/40">
            That&apos;s it. No gadgets. No $300 stacks. Just simple reminders to your body.
          </p>
        </div>

        {/* Biohack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {biohacks.map((hack, i) => {
            const Icon = hack.icon
            return (
              <div
                key={hack.title}
                className="rounded-2xl p-6 transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: `1px solid ${hack.color}20`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${hack.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: hack.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{hack.title}</h3>
                    <p className="text-xs text-white/50">{hack.schedule}</p>
                  </div>
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: hack.color }}>
                  {hack.benefit}
                </p>
                <p className="text-xs text-white/40">{hack.detail}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div 
            className="inline-flex flex-col items-center gap-4 p-8 rounded-[2rem]"
            style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-sm text-white/60">
              Want the exact protocols, weekly schedule, safety notes + all the March 2026 studies?
            </p>
            <a
              href="/The 4 Free Biohacks.pdf"
              download
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT, color: "#000" }}
            >
              <Download className="w-4 h-4" />
              Download Free: "The 4 Free Biohacks Blueprint – Updated March 2026"
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// NEW: Social Proof Section
// ============================================

const socialProof = [
  {
    quote: "Getting into fasting is one of the top 3 most important things I've done in my life.",
    author: "Phil Libin",
    title: "former CEO of Evernote",
  },
  {
    quote: "Intermittent fasting is the #1 free biohack.",
    author: "Gary Brecka",
    title: "biohacker & founder of 10X Health",
  },
  {
    quote: "The best of all medicines are resting and fasting.",
    author: "Benjamin Franklin",
    title: "Founding Father & Polymath",
  },
]

export function LandingSocialProof() {
  return (
    <section id="social-proof" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: ACCENT }}>
            What Experts Say
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialProof.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-3xl text-white/20 mb-3">"</div>
              <p className="text-sm font-medium text-white mb-4 leading-relaxed">
                {item.quote}
              </p>
              <div>
                <p className="text-xs font-bold text-white">— {item.author}</p>
                <p className="text-[10px] text-white/40 mt-1">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
