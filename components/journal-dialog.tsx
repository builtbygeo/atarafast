"use client"

import { useState } from 'react'
import { X } from 'lucide-react'
import { JournalData } from '@/lib/storage'
import { useLang } from '@/lib/language-context'

interface JournalDialogProps {
    onSave: (data: JournalData) => void
    onSkip: () => void
    initialData?: JournalData
}

const availableTags = [
    "Headache", "Clarity", "Cravings", "Workout",
    "Bloating", "Fatigue", "Focused", "Irritability"
]

export function JournalDialog({ onSave, onSkip, initialData }: JournalDialogProps) {
    const { t } = useLang()

    // ==================== STATE ====================
    const [energy, setEnergy] = useState(initialData?.energy ?? 3)
    const [mental, setMental] = useState(initialData?.mental ?? 3)
    const [sleep, setSleep] = useState<'Poor' | 'Good' | 'Excellent'>(initialData?.sleep ?? 'Good')
    const [hydration, setHydration] = useState<'1L' | '2L' | '3L' | '4L+'>(initialData?.hydration ?? '2L')
    const [difficult, setDifficult] = useState<0 | 1 | 2 | 3>(initialData?.difficult ?? 0)
    const [hungry, setHungry] = useState<0 | 1 | 2 | 3>(initialData?.hungry ?? 0)
    const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags ?? [])

    // ==================== HELPERS ====================
    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const handleRecord = () => {
        onSave({
            energy,
            mental,
            sleep,
            hydration,
            difficult,
            hungry,
            tags: selectedTags
        })
    }

    // ==================== UI ====================
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onSkip} />
            <div className="relative z-50 w-full max-w-md max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-black border border-zinc-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 bg-black/95 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-800">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Journal</h1>
                        <p className="text-[#22c55e] text-xs font-bold uppercase tracking-widest">
                            Fast Completed
                        </p>
                    </div>
                    <button
                        onClick={onSkip}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 no-scrollbar text-white">
                    {/* HOW DID YOU FEEL? */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-5">How did you feel?</p>

                        {/* Energy Level Slider */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs font-medium mb-2">
                                <span className="text-zinc-300">Energy Level (1-5)</span>
                                <span className="font-mono text-[#22c55e]">{energy}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={energy}
                                onChange={(e) => setEnergy(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none bg-zinc-800 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_#22c55e]"
                                style={{ background: `linear-gradient(to right, #ef4444, #eab308, #22c55e)` }}
                            />
                        </div>

                        {/* Mental Slider */}
                        <div>
                            <div className="flex justify-between text-xs font-medium mb-2">
                                <span className="text-zinc-300">Mental Clarity (1-5)</span>
                                <span className="font-mono text-[#22c55e]">{mental}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={mental}
                                onChange={(e) => setMental(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none bg-zinc-800 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_#22c55e]"
                                style={{ background: `linear-gradient(to right, #ef4444, #eab308, #22c55e)` }}
                            />
                        </div>
                    </div>

                    {/* SLEEP - 3 WORD OPTIONS */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">Sleep quality</p>
                        <div className="grid grid-cols-3 gap-2">
                            {(['Poor', 'Good', 'Excellent'] as const).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setSleep(option)}
                                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${sleep === option
                                            ? 'bg-[#22c55e] text-black border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                            : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* HYDRATION - BUTTONS */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">Hydration</p>
                        <div className="grid grid-cols-4 gap-2">
                            {(['1L', '2L', '3L', '4L+'] as const).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setHydration(l)}
                                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${hydration === l
                                            ? 'bg-[#22c55e] text-black border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                            : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DIFFICULT MOMENTS & HUNGRY - 0-3 BUTTONS */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Difficult moments */}
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Difficult Moments</p>
                            <div className="flex gap-1.5">
                                {[0, 1, 2, 3].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setDifficult(n as 0 | 1 | 2 | 3)}
                                        className={`flex-1 py-2.5 rounded-lg font-mono text-sm transition-all border ${difficult === n
                                                ? 'bg-[#22c55e] text-black border-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                                            }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hungry (times?) */}
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Hunger Pangs (times)</p>
                            <div className="flex gap-1.5">
                                {[0, 1, 2, 3].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setHungry(n as 0 | 1 | 2 | 3)}
                                        className={`flex-1 py-2.5 rounded-lg font-mono text-sm transition-all border ${hungry === n
                                                ? 'bg-[#22c55e] text-black border-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                                            }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* TAGS - 2 EVEN ROWS (8 tags) */}
                    <div className="pb-4">
                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">Tags (optional)</p>
                        <div className="grid grid-cols-4 gap-2">
                            {availableTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${selectedTags.includes(tag)
                                            ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/50'
                                            : 'bg-zinc-900/30 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 shrink-0 bg-black border-t border-zinc-800">
                    <button
                        onClick={handleRecord}
                        className="w-full py-4 bg-[#22c55e] text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:bg-[#22c55e]/90 active:scale-[0.98] transition-all"
                    >
                        Save Journal
                    </button>
                    {!initialData && (
                        <button
                            onClick={onSkip}
                            className="w-full mt-3 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            Skip for now
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}
