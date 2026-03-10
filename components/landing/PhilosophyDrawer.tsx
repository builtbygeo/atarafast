"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function PhilosophyDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Trigger button in nav */}
      <button
        onClick={() => setIsOpen(true)}
        className="hover:text-white transition-colors text-xs font-black uppercase tracking-widest cursor-pointer"
        style={{ color: 'rgba(255,255,255,0.6)' }}
      >
        Philosophy
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Drawer Panel - Right side */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg z-[101] bg-[#0f0f0f] border-l border-white/10 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <span className="text-lg">🏛️</span>
                  </div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">The Philosophy</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 pb-20">
                <div className="mb-10">
                  <div 
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-6" 
                    style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    From Ataraxia
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mb-6 leading-tight">
                    Inspired by <span style={{ color: '#22c55e' }}>Ataraxia</span>
                  </h3>

                  <div 
                    className="relative p-8 rounded-[2rem] overflow-hidden mb-8"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e] opacity-[0.03] -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#22c55e] opacity-[0.03] -ml-16 -mb-16" />

                    <p className="text-lg sm:text-xl font-medium leading-relaxed italic mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      &ldquo;Ataraxia is the Stoic state of unshakeable inner calm and freedom from emotional disturbance.&rdquo;
                    </p>

                    <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      — Ancient Greek philosophy, notably from Epicurus, Democritus, and later the Stoics
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-3 text-white/60">The Connection</h4>
                    <p className="text-base leading-relaxed text-white/50">
                      Fasting is more than just a biological process. It is a mental practice in discipline and stillness. 
                      We built Atara to help you navigate your metabolic shifting with the same clarity and peace that the ancient Stoics practiced.
                    </p>
                  </div>

                  <div 
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.1)' }}
                  >
                    <p className="text-sm font-medium text-white/70 leading-relaxed">
                      Just as the Stoics sought <span style={{ color: '#22c55e' }}>ataraxia</span> — freedom from disturbance — 
                      fasting gives you freedom from the disturbance of constant hunger, energy crashes, and food decisions.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-white/40">Key Stoic Principles</h4>
                    <div className="grid gap-3">
                      {[
                        { title: "Discipline", desc: "Fasting requires self-control, a core Stoic virtue" },
                        { title: " imperance", desc: "Accept the hunger wave. It will pass." },
                        { title: "Rationality", desc: "Understand the science. Make informed choices." },
                        { title: "Temperance", desc: "Moderation in all things — including when you eat." },
                      ].map((item, i) => (
                        <div 
                          key={i}
                          className="flex items-start gap-3 p-4 rounded-xl"
                          style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                          <div>
                            <span className="text-sm font-bold text-white">{item.title}</span>
                            <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                  <p className="text-xs text-white/30 text-center">
                    Atara — Master Your Metabolism
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
