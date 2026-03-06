"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowRight, Check, Sparkles } from "lucide-react"

interface OnboardingFlowProps {
    onComplete: (recommendedPlanId: string, startImmediately: boolean) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const [step, setStep] = useState(1)
    const [experience, setExperience] = useState<string | null>(null)
    const [goal, setGoal] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [recommendedPlan, setRecommendedPlan] = useState<{ id: string, name: string, desc: string } | null>(null)

    const handleNext = () => {
        if (step === 1 && experience) setStep(2)
        else if (step === 2 && goal) {
            setStep(3)
            setIsAnalyzing(true)

            // Determine plan based on answers
            setTimeout(() => {
                let plan = { id: "16:8", name: "Gold Standard 16:8", desc: "The perfect balance of fasting and eating for daily results." }

                if (experience === "Never tried it before" || experience === "Just starting out") {
                    plan = { id: "14:10", name: "Starter 14:10", desc: "A gentle introduction to time-restricted eating." }
                    if (goal === "Better sleep") {
                        plan = { id: "12:12", name: "Circadian 12:12", desc: "Aligns with your natural circadian rhythm for restorative sleep." }
                    }
                } else if (experience === "I fast regularly") {
                    plan = { id: "20:4", name: "The Warrior 20:4", desc: "Advanced protocol for maximum metabolic flexibility and autophagy." }
                } else if (goal === "Weight loss") {
                    plan = { id: "18:6", name: "Advanced 18:6", desc: "Pushes deeper into fat-burning ketosis for accelerated results." }
                }

                setRecommendedPlan(plan)
                setIsAnalyzing(false)
                setStep(4)
            }, 3000) // Slightly longer for "premium" feel
        }
    }

    const handleFinish = (startNow: boolean) => {
        if (recommendedPlan) {
            onComplete(recommendedPlan.id, startNow)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-md flex flex-col items-center relative z-10"
                    >
                        <div className="mb-12 text-center">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-black tracking-tighter mb-4 text-white"
                            >
                                Welcome to Atara.
                            </motion.h2>
                            <p className="text-white/40 text-lg font-medium tracking-wide">
                                Let’s build your perfect fasting rhythm. How familiar are you with intermittent fasting?
                            </p>
                        </div>
                        <div className="w-full space-y-3">
                            {['Never tried it before', 'Just starting out', 'I’ve tried it a few times', "I fast regularly"].map((opt, i) => (
                                <motion.button
                                    key={opt}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setExperience(opt)}
                                    className={`w-full p-5 rounded-[1.5rem] border text-left font-bold transition-all duration-300 ${experience === opt ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(34,197,94,0.2)] text-primary' : 'bg-white/[0.03] border-white/5 text-white/50 hover:bg-white/[0.06] hover:text-white'}`}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleNext}
                            disabled={!experience}
                            className="mt-12 w-full rounded-2xl bg-white text-black font-black py-5 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
                        >
                            Continue <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-md flex flex-col items-center relative z-10"
                    >
                        <div className="mb-12 text-center">
                            <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">Your Goal.</h2>
                            <p className="text-white/40 text-lg font-medium tracking-wide">Why do you fast?</p>
                        </div>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['Better sleep', 'Weight loss', 'Mental clarity', 'Discipline', 'Longevity', 'Digestion', 'General health & longevity'].map((opt, i) => (
                                <motion.button
                                    key={opt}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setGoal(opt)}
                                    className={`w-full p-5 rounded-[1.5rem] border text-center font-bold tracking-wide transition-all duration-300 ${goal === opt ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(34,197,94,0.2)] text-primary' : 'bg-white/[0.03] border-white/5 text-white/50 hover:bg-white/[0.06] hover:text-white'}`}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleNext}
                            disabled={!goal}
                            className="mt-12 w-full rounded-2xl bg-white text-black font-black py-5 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
                        >
                            Analyze Profile <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center p-10 text-center relative z-10"
                    >
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
                            <Loader2 className="w-20 h-20 text-primary animate-spin relative z-10" />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-[0.2em] uppercase mb-4 animate-pulse">Analyzing</h3>
                        <p className="text-primary/60 text-sm font-bold uppercase tracking-widest italic">Crafting your perfect metabolic protocol…</p>
                    </motion.div>
                )}

                {step === 4 && recommendedPlan && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md flex flex-col items-center text-center relative z-10"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] mb-8 bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        >
                            <Sparkles className="w-3 h-3 fill-primary/20" /> Perfect Match Found
                        </motion.div>

                        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6 text-white leading-tight">Your Custom Protocol.</h2>
                        <p className="text-white/40 mb-12 text-lg px-4 font-medium">Based on your experience and goal, we highly recommend this plan to start.</p>

                        <div className="w-full p-10 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 mb-12 overflow-hidden relative group shadow-2xl">
                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
                            <h3 className="text-5xl font-black text-white mb-4 relative z-10">{recommendedPlan.name}</h3>
                            <p className="text-primary/90 font-bold text-lg relative z-10 leading-relaxed">{recommendedPlan.desc}</p>
                        </div>

                        <h3 className="text-xl font-black text-white mb-8 tracking-tight">Ready to start now?</h3>
                        <div className="w-full space-y-3">
                            <button
                                onClick={() => handleFinish(true)}
                                className="w-full rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_10px_40px_rgba(34,197,94,0.3)] font-black py-5 transition-all active:scale-[0.98]"
                            >
                                Start Fasting
                            </button>
                            <button
                                onClick={() => handleFinish(false)}
                                className="w-full rounded-[1.5rem] bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white font-bold py-5 transition-all border border-white/5"
                            >
                                Save for later
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
