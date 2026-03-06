"use client"

import { useState } from "react"
import {
    LineChart as OriginalLineChart,
    Line as OriginalLine,
    XAxis as OriginalXAxis,
    YAxis as OriginalYAxis,
    CartesianGrid as OriginalCartesianGrid,
    ResponsiveContainer,
    Tooltip as OriginalTooltip
} from "recharts"

// Recharts + React 19 type fix
const LineChart: any = OriginalLineChart
const Line: any = OriginalLine
const XAxis: any = OriginalXAxis
const YAxis: any = OriginalYAxis
const CartesianGrid: any = OriginalCartesianGrid
const Tooltip: any = OriginalTooltip

const wellbeingData = [
    { name: "Start", energy: 20, clarity: 25, sleep: 15 },
    { name: "Month 1", energy: 85, clarity: 88, sleep: 82 },
    { name: "Month 2", energy: 88, clarity: 92, sleep: 85 },
    { name: "Month 3", energy: 92, clarity: 95, sleep: 90 },
]

const weightLossData = [
    { name: "Start", weight: 95, cravings: 85, energy: 25 },
    { name: "Month 1", weight: 82, cravings: 40, energy: 75 },
    { name: "Month 2", weight: 78, cravings: 25, energy: 82 },
    { name: "Month 3", weight: 72, cravings: 10, energy: 90 },
]

export function WellbeingChart() {
    const [mode, setMode] = useState<"wellbeing" | "weightloss">("wellbeing")

    const data = mode === "wellbeing" ? wellbeingData : weightLossData

    return (
        <div className="w-full flex flex-col rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 sm:p-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-1">
                        Metabolic Journey
                    </h3>
                    <p className="text-[10px] text-primary/60 font-medium uppercase tracking-wider">
                        Real results over 90 days
                    </p>
                </div>
                <div className="flex bg-black/40 p-1 rounded-xl w-fit border border-white/5">
                    <button
                        onClick={() => setMode("wellbeing")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === "wellbeing" ? "bg-primary text-primary-foreground shadow-lg" : "text-white/40 hover:text-white"}`}
                    >
                        Wellbeing
                    </button>
                    <button
                        onClick={() => setMode("weightloss")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === "weightloss" ? "bg-[#3b82f6] text-white shadow-lg" : "text-white/40 hover:text-white"}`}
                    >
                        Weight Loss
                    </button>
                </div>
            </div>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart key={mode} data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.15)", fontSize: 10, fontWeight: 700 }}
                            domain={[0, 100]}
                            dx={-5}
                        />
                        <Tooltip
                            content={({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-xl border border-white/10 bg-black/95 px-4 py-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                                            <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-2 pb-2 border-b border-white/5">
                                                {payload[0].payload.name}
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                {payload.map((entry: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-4 justify-between min-w-[120px]">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                            <span className="text-[10px] font-bold text-white/70">
                                                                {entry.name}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] font-black" style={{ color: entry.color }}>
                                                            {mode === 'weightloss' && entry.dataKey === 'weight' ? entry.value + 'kg' : entry.value + '%'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        {mode === "wellbeing" && (
                            <Line
                                type="monotone"
                                name="Energy"
                                dataKey="energy"
                                stroke="#22c55e"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        )}
                        {mode === "wellbeing" && (
                            <Line
                                type="monotone"
                                name="Mental Clarity"
                                dataKey="clarity"
                                stroke="#a855f7"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: "#a855f7", strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        )}
                        {mode === "wellbeing" && (
                            <Line
                                type="monotone"
                                name="Sleep Quality"
                                dataKey="sleep"
                                stroke="#3b82f6"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        )}

                        {mode === "weightloss" && (
                            <Line
                                type="monotone"
                                name="Weight"
                                dataKey="weight"
                                stroke="#3b82f6"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        )}
                        {mode === "weightloss" && (
                            <Line
                                type="monotone"
                                name="Cravings"
                                dataKey="cravings"
                                stroke="#ef4444"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: "#ef4444", strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        )}
                        {mode === "weightloss" && (
                            <Line
                                type="monotone"
                                name="Energy"
                                dataKey="energy"
                                stroke="#22c55e"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
