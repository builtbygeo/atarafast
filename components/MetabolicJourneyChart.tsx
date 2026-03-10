"use client"

import { useState, useEffect } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip 
} from 'recharts'

const wellbeingData = [
  { month: 'Start',  Energy: 20,  Mental: 25,  Sleep: 15 },
  { month: 'Month 1', Energy: 65,  Mental: 72,  Sleep: 55 },
  { month: 'Month 2', Energy: 82,  Mental: 88,  Sleep: 78 },
  { month: 'Month 3', Energy: 95,  Mental: 98,  Sleep: 92 },
]

const weightLossData = [
  { month: 'Start',    Weight: 90, Cravings: 90, BodyFat: 30 },
  { month: 'Month 1',  Weight: 86,  Cravings: 50, BodyFat: 27 },
  { month: 'Month 2', Weight: 83,  Cravings: 25, BodyFat: 24 },
  { month: 'Month 3', Weight: 80,  Cravings: 12, BodyFat: 22 },
]

export default function MetabolicJourneyChart() {
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'weightLoss'>('wellbeing')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const data = activeTab === 'wellbeing' ? wellbeingData : weightLossData
  const isWellbeing = activeTab === 'wellbeing'
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center animate-pulse">
        <span className="text-white/10 font-bold uppercase tracking-[0.3em] text-xs">Loading</span>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 sm:p-8 relative overflow-hidden">
      {/* Background glow - animated */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-32 -mt-32 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/3 rounded-full -ml-24 -mb-24 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Your Progress</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {isWellbeing ? 'Energy & Focus' : 'Body Metrics'}
          </h3>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-black/40 rounded-full p-1 border border-white/5">
          <button
            onClick={() => setActiveTab('wellbeing')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'wellbeing' ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
          >
            Wellbeing
          </button>
          <button
            onClick={() => setActiveTab('weightLoss')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'weightLoss' ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
          >
            Efficiency
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] sm:h-[320px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cravingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bodyFatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            
            <YAxis 
              domain={isWellbeing ? [0, 100] : [70, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 500 }}
              tickFormatter={(val) => isWellbeing ? `${val}%` : `${val}kg`}
            />

            <Tooltip
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-white/10 bg-black/90 p-3 shadow-xl">
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">
                        {payload[0].payload.month}
                      </p>
                      {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
                          <span className="text-white/70">{entry.name}</span>
                          <span className="font-bold text-white">
                            {entry.name === 'Weight' ? `${entry.value}kg` : `${entry.value}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
              cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
            />

            {/* Wellbeing Areas */}
            <Area 
              name="Energy" 
              type="monotone" 
              dataKey="Energy" 
              stroke="#22c55e" 
              strokeWidth={3} 
              fill="url(#energyGrad)" 
              hide={!isWellbeing}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Area 
              name="Focus" 
              type="monotone" 
              dataKey="Mental" 
              stroke="#a855f7" 
              strokeWidth={3} 
              fill="url(#focusGrad)" 
              hide={!isWellbeing}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Area 
              name="Sleep" 
              type="monotone" 
              dataKey="Sleep" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fill="url(#sleepGrad)" 
              hide={!isWellbeing}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />

            {/* Efficiency Areas */}
            <Area 
              name="Weight" 
              type="monotone" 
              dataKey="Weight" 
              stroke="#60a5fa" 
              strokeWidth={3} 
              fill="url(#weightGrad)" 
              hide={isWellbeing}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Area 
              name="Cravings" 
              type="monotone" 
              dataKey="Cravings" 
              stroke="#f97316" 
              strokeWidth={3} 
              fill="url(#cravingsGrad)" 
              hide={isWellbeing}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Area 
              name="Body Fat" 
              type="monotone" 
              dataKey="BodyFat" 
              stroke="#ec4899" 
              strokeWidth={3} 
              fill="url(#bodyFatGrad)" 
              hide={isWellbeing}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 relative z-10">
        {isWellbeing ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Energy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Sleep</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#60a5fa]" />
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Weight</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#f97316]" />
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Cravings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ec4899]" />
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Body Fat</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}