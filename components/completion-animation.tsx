"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function CompletionAnimation() {
    const [particles, setParticles] = useState<{ id: number; angle: number; distance: number; size: number; delay: number }[]>([])

    useEffect(() => {
        // Generate 30 elegant particles
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            angle: Math.random() * Math.PI * 2,
            distance: 120 + Math.random() * 150, // how far they travel
            size: 3 + Math.random() * 6,
            delay: Math.random() * 0.4,
        }))
        setParticles(newParticles)
    }, [])

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
            {/* Expanding Glow Rings */}
            <motion.div
                initial={{ opacity: 0.8, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-[280px] h-[280px] rounded-full border-[2px] border-primary/50 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
            />
            <motion.div
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
                className="absolute w-[280px] h-[280px] rounded-full border border-primary/30"
            />

            {/* Floating Particles */}
            {particles.map((p) => {
                const x = Math.cos(p.angle) * p.distance
                const y = Math.sin(p.angle) * p.distance

                return (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: [0, x],
                            y: [0, y],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 1.5 + Math.random() * 1,
                            ease: "easeOut",
                            delay: p.delay,
                        }}
                        className="absolute rounded-full"
                        style={{
                            width: p.size,
                            height: p.size,
                            background: Math.random() > 0.5 ? "#22c55e" : "#4ade80",
                            boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
                        }}
                    />
                )
            })}
        </div>
    )
}
