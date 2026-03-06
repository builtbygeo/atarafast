"use client"

import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const wellbeingData = [
  { month: 'Start',    Energy: 20,  Mental: 25,  Sleep: 15 },
  { month: 'Month 1',  Energy: 75,  Mental: 82,  Sleep: 65 },
  { month: 'Month 2',  Energy: 88,  Mental: 90,  Sleep: 82 },
  { month: 'Month 3',  Energy: 95,  Mental: 98,  Sleep: 92 },
];

const weightLossData = [
  { month: 'Start',    Weight: 100, Cravings: 90, BodyFat: 30 },
  { month: 'Month 1',  Weight: 92,  Cravings: 50, BodyFat: 27 },
  { month: 'Month 2',  Weight: 86,  Cravings: 25, BodyFat: 24 },
  { month: 'Month 3',  Weight: 82,  Cravings: 12, BodyFat: 22 },
];

export default function MetabolicJourneyChart() {
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'weightLoss'>('wellbeing');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = activeTab === 'wellbeing' ? wellbeingData : weightLossData;
  const isWellbeing = activeTab === 'wellbeing';

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center animate-pulse">
        <span className="text-white/10 font-bold uppercase tracking-[0.3em] text-xs">Initializing Journey</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-4 sm:p-10 relative overflow-hidden group hover:border-white/10 transition-all duration-700">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full -mr-48 -mt-48 transition-opacity group-hover:opacity-60" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full -ml-32 -mb-32" />
      
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              Results
            </span>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
              Verified Analysis
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-none">
            Metabolic <span className="text-primary italic">Success</span>
          </h2>
          <p className="text-sm font-medium text-white/40 leading-relaxed max-w-md">
            Visualizing the transformation of your body's energy systems over a 90-day disciplined cycle.
          </p>
        </div>

        {/* Tab Selector - Responsive Solid UI */}
        <div className="flex bg-white/[0.03] p-1 rounded-xl sm:p-1.5 sm:rounded-2xl border border-white/5 ring-1 ring-white/5 w-fit">
          <button
            onClick={() => setActiveTab('wellbeing')}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative ${activeTab === 'wellbeing' ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)] scale-[1.02]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
          >
            Wellbeing
          </button>
          <button
            onClick={() => setActiveTab('weightLoss')}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative ${activeTab === 'weightLoss' ? 'bg-primary text-black shadow-[0_10px_30px_rgba(34,197,94,0.3)] scale-[1.02]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
          >
            Efficiency
          </button>
        </div>
      </div>

      <div className="h-[280px] sm:h-[400px] w-full relative z-10 cursor-crosshair bg-black/40 rounded-2xl sm:rounded-3xl p-2 sm:p-4 border border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cravingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bodyFatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>

              <filter id="premiumGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 900, letterSpacing: '0.15em' }}
              dy={20}
            />
            
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 700 }}
              width={40}
              hide={true}
            />

            <Tooltip
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-[2rem] border border-white/10 bg-black/90 p-5 shadow-4xl backdrop-blur-3xl ring-1 ring-white/10 min-w-[220px]">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-5 pb-3 border-b border-white/5">
                        {payload[0].payload.month} Progress
                      </p>
                      <div className="flex flex-col gap-4">
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke, boxShadow: `0 0 15px ${entry.stroke}` }} />
                              <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">
                                {entry.name}
                              </span>
                            </div>
                            <span className="text-sm font-black tabular-nums" style={{ color: entry.stroke }}>
                              {entry.value}{isWellbeing ? '%' : entry.name === 'Weight' ? 'kg' : '%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
            />

            {/* Wellbeing Areas - Using 'hide' prop for tab switching */}
            <Area 
              name="Energy" 
              type="monotone" 
              dataKey="Energy" 
              stroke="#22c55e" 
              strokeWidth={4} 
              fill="url(#energyGrad)" 
              hide={!isWellbeing}
              isAnimationActive={true} 
              animationDuration={1500}
              filter="url(#premiumGlow)"
            />
            <Area 
              name="Focus" 
              type="monotone" 
              dataKey="Mental" 
              stroke="#a855f7" 
              strokeWidth={4} 
              fill="url(#focusGrad)" 
              hide={!isWellbeing}
              isAnimationActive={true} 
              animationDuration={2000}
              filter="url(#premiumGlow)"
            />
            <Area 
              name="Sleep" 
              type="monotone" 
              dataKey="Sleep" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              fill="url(#sleepGrad)" 
              hide={!isWellbeing}
              isAnimationActive={true} 
              animationDuration={2500}
              filter="url(#premiumGlow)"
            />

            {/* Efficiency Areas */}
            <Area 
              name="Weight" 
              type="monotone" 
              dataKey="Weight" 
              stroke="#60a5fa" 
              strokeWidth={4} 
              fill="url(#weightGrad)" 
              hide={isWellbeing}
              isAnimationActive={true} 
              animationDuration={1500}
              filter="url(#premiumGlow)"
            />
            <Area 
              name="Cravings" 
              type="monotone" 
              dataKey="Cravings" 
              stroke="#ef4444" 
              strokeWidth={4} 
              fill="url(#cravingsGrad)" 
              hide={isWellbeing}
              isAnimationActive={true} 
              animationDuration={2000}
              filter="url(#premiumGlow)"
            />
            <Area 
              name="Body Fat" 
              type="monotone" 
              dataKey="BodyFat" 
              stroke="#f59e0b" 
              strokeWidth={4} 
              fill="url(#bodyFatGrad)" 
              hide={isWellbeing}
              isAnimationActive={true} 
              animationDuration={2500}
              filter="url(#premiumGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Decorative Legend */}
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-6 relative z-10">
        <div className="flex flex-wrap gap-8">
          {isWellbeing ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_10px_#22c55e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">High Energy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_10px_#a855f7]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Mental Focus</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Deep Sleep</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] shadow-[0_0_10px_#60a5fa]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Weight Loss</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">No Cravings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Lean Body</span>
              </div>
            </>
          )}
        </div>
        
        <div className="hidden sm:block">
          <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em]">Advanced Metabolic Tracking System 2.0</p>
        </div>
      </div>
    </div>
  );
}