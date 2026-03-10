import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Smartphone, Share2, Plus, Check, Zap, Bell, Home, ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Install Atara on Your Home Screen • No App Store Needed',
  description: 'Get Atara as a real app on your phone in seconds. Works offline, instant access, no download size.',
}

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#0f0f0f', borderColor: 'rgba(255,255,255,0.05)' }}>
        <Link href="/">
          <Logo className="w-24 text-white" />
        </Link>
        <Link
          href="/app"
          className="rounded-xl font-bold text-xs px-5 py-2.5 transition-colors uppercase tracking-widest"
          style={{ backgroundColor: '#22c55e', color: '#0f0f0f' }}
        >
          Open App
        </Link>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)' }}>
            Progressive Web App
          </div>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            Get Atara on your <span className="text-primary">home screen</span> in 10 seconds
          </h1>
          <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
            Works offline • Looks and feels like a real app • No app store, no download size
          </p>
          <a
            href="#how"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl"
          >
            Show Me How <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Benefits */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-center mb-8 tracking-tight">Why install it?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <p className="font-bold mb-1">Lightning fast</p>
            <p className="text-sm text-white/40">Opens instantly, even offline</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <p className="font-bold mb-1">Home screen icon</p>
            <p className="text-sm text-white/40">One-tap access like any app</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-rose-500" />
            </div>
            <p className="font-bold mb-1">Push notifications</p>
            <p className="text-sm text-white/40">Get alerts (if enabled)</p>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section id="how" className="max-w-2xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-center mb-8 tracking-tight">How to install</h2>

        {/* Android */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#3DDC84]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3DDC84]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.341a.85.85 0 0 1-.853-.853.85.85 0 0 1 .853-.854.85.85 0 0 1 .854.854.85.85 0 0 1-.854.853m-11.046 0a.85.85 0 0 1-.854-.853.85.85 0 0 1 .854-.854.85.85 0 0 1 .853.854.85.85 0 0 1-.853.853m11.434-6.015l1.992-3.446a.415.415 0 0 0-.152-.567.415.415 0 0 0-.568.152L17.15 8.996a12.266 12.266 0 0 0-5.15-1.107c-1.837 0-3.561.402-5.15 1.107L4.817 5.465a.415.415 0 0 0-.568-.152.415.415 0 0 0-.152.567l1.992 3.446C2.682 11.42.54 14.998.54 19.09h22.92c0-4.092-2.142-7.67-5.549-9.764"/>
              </svg>
            </div>
            <h3 className="text-xl font-black tracking-tight">Android (Chrome, Edge, Brave)</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 font-black text-primary">1</div>
              <div>
                <p className="font-bold mb-1">Open this site in Chrome</p>
                <p className="text-sm text-white/40">Make sure you&apos;re using Google Chrome (or Edge/Brave).</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 font-black text-primary">2</div>
              <div>
                <p className="font-bold mb-1">Tap the menu (⋮) → &quot;Add to Home screen&quot; or &quot;Install Atara&quot;</p>
                <p className="text-sm text-white/40">Some versions show an install icon directly in the address bar — tap that instead!</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-primary/10 border border-primary/20">
              <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold mb-1">Tap &quot;Add&quot; or &quot;Install&quot;</p>
                <p className="text-sm text-primary/80 font-medium">Done! The app icon now appears on your home screen.</p>
              </div>
            </div>
          </div>
        </div>

        {/* iOS */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <h3 className="text-xl font-black tracking-tight">iPhone / iPad (Safari)</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 font-black text-primary">1</div>
              <div>
                <p className="font-bold mb-1">Open this site in Safari</p>
                <p className="text-sm text-white/40">Best experience — Chrome on iOS also works now</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 font-black text-primary">2</div>
              <div>
                <p className="font-bold mb-1">Tap the Share button</p>
                <p className="text-sm text-white/40 mb-3">The square with arrow pointing up at the bottom of the screen</p>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                  <Share2 className="w-6 h-6 text-primary" />
                  <Plus className="w-6 h-6 text-white/60" />
                  <span className="text-white/60">Scroll down and tap</span>
                  <span className="font-bold">Add to Home Screen</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-primary/10 border border-primary/20">
              <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold mb-1">Tap &quot;Add&quot; (top right corner)</p>
                <p className="text-sm text-primary/80 font-medium">Your PWA now launches full-screen like a native app!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-sm text-amber-200/80">
            <strong className="text-amber-300">Pro tip:</strong> If you see a banner at the bottom of the app saying &quot;Install Atara&quot;, just tap it!
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <h3 className="font-black text-xl mb-6 tracking-tight">Common questions</h3>
        <div className="space-y-3">
          <details className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] cursor-pointer group">
            <summary className="font-bold flex items-center justify-between">
              Can I uninstall it later?
              <ChevronDown className="w-4 h-4 text-white/40 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-sm text-white/50">Yes — long-press the icon on your home screen → Remove / Uninstall.</p>
          </details>
          <details className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] cursor-pointer group">
            <summary className="font-bold flex items-center justify-between">
              Does it work offline?
              <ChevronDown className="w-4 h-4 text-white/40 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-sm text-white/50">Yes! Atara is a proper PWA with offline support. Your fasting data is stored locally on your device.</p>
          </details>
          <details className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] cursor-pointer group">
            <summary className="font-bold flex items-center justify-between">
              Is my data private?
              <ChevronDown className="w-4 h-4 text-white/40 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-sm text-white/50">100%. As a PWA, your data stays on your device. No cloud sync means no tracking by Apple or Google.</p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-black mb-4 tracking-tight">Ready to install?</h2>
          <p className="text-white/50 mb-6">Open the app and follow the steps above to add Atara to your home screen.</p>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 bg-primary text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/30"
          >
            Open Atara App
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs text-white/30 border-t border-white/[0.05]">
        <Link href="/" className="hover:text-white/50 transition-colors">
          ← Back to Atara
        </Link>
      </footer>
    </div>
  )
}
