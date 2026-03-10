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
            <div className="fixed inset-0 bg-background/80 backdrop-blur-md" onClick={onSkip} />
            <div className="relative z-50 w-full max-w-md max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-150">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 bg-card/95 backdrop-blur-md sticky top-0 z-10 border-b border-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t.journalTitle}</h1>
                        <p className="text-primary text-xs font-bold uppercase tracking-widest">
                            {t.fastCompleted}
                        </p>
                    </div>
                    <button
                        onClick={onSkip}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 no-scrollbar text-foreground">
                    {/* HOW DID YOU FEEL? */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5">{t.howDidYouFeel}</p>

                        {/* Energy Level Slider */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs font-medium mb-2">
                                <span className="text-muted-foreground">{t.energyLevel}</span>
                                <span className="font-mono text-primary">{energy}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={energy}
                                onChange={(e) => setEnergy(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_15px_oklch(var(--primary))] dark:[&::-webkit-slider-thumb]:shadow-[0_0_15px_oklch(var(--primary))]"
                                style={{ background: `linear-gradient(to right, #ef4444, #eab308, #22c55e)` }}
                            />
                        </div>

                        {/* Mental Slider */}
                        <div>
                            <div className="flex justify-between text-xs font-medium mb-2">
                                <span className="text-muted-foreground">{t.mentalClarity}</span>
                                <span className="font-mono text-primary">{mental}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={mental}
                                onChange={(e) => setMental(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_15px_oklch(var(--primary))] dark:[&::-webkit-slider-thumb]:shadow-[0_0_15px_oklch(var(--primary))]"
                                style={{ background: `linear-gradient(to right, #ef4444, #eab308, #22c55e)` }}
                            />
                        </div>
                    </div>

                    {/* SLEEP - 3 WORD OPTIONS */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.sleepQuality}</p>
                        <div className="grid grid-cols-3 gap-2">
                            {(['Poor', 'Good', 'Excellent'] as const).map((option) => {
                                const labels: Record<string, string> = { Poor: t.sleepPoor, Good: t.sleepGood, Excellent: t.sleepExcellent }
                                return (
                                <button
                                    key={option}
                                    onClick={() => setSleep(option)}
                                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${sleep === option
                                            ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
                                            : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                                        }`}
                                >
                                    {labels[option]}
                                </button>
                            )})}
                        </div>
                    </div>

                    {/* HYDRATION - BUTTONS */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.hydration}</p>
                        <div className="grid grid-cols-4 gap-2">
                            {(['1L', '2L', '3L', '4L+'] as const).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setHydration(l)}
                                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${hydration === l
                                            ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
                                            : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
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
                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.difficultMoments}</p>
                            <div className="flex gap-1.5">
                                {[0, 1, 2, 3].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setDifficult(n as 0 | 1 | 2 | 3)}
                                        className={`flex-1 py-2.5 rounded-lg font-mono text-sm transition-all border ${difficult === n
                                                ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                                                : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                                            }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hungry (times?) */}
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.hungerPangs}</p>
                            <div className="flex gap-1.5">
                                {[0, 1, 2, 3].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setHungry(n as 0 | 1 | 2 | 3)}
                                        className={`flex-1 py-2.5 rounded-lg font-mono text-sm transition-all border ${hungry === n
                                                ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                                                : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
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
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.tagsOptional}</p>
                        <div className="grid grid-cols-4 gap-2">
                            {availableTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${selectedTags.includes(tag)
                                            ? 'bg-primary/10 text-primary border-primary/50'
                                            : 'bg-secondary/30 text-muted-foreground border-border hover:border-muted hover:text-foreground'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 shrink-0 bg-card border-t border-border">
                    <button
                        onClick={handleRecord}
                        className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] hover:bg-primary/90 active:scale-[0.98] transition-all"
                    >
                        {t.saveJournal}
                    </button>
                    {!initialData && (
                        <button
                            onClick={onSkip}
                            className="w-full mt-3 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {t.skipForNow}
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}