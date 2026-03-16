"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { type WeightPoint } from "../lib/stats"

export function WeightTrendsChart({ data }: { data: WeightPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[280px] rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 flex flex-col items-center justify-center">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-2">
          Weight Trends
        </h3>
        <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
          No data available
        </p>
      </div>
    )
  }

  // Calculate min/max for YAxis domain with padding
  const weights = data.map((d) => d.weight)
  const minWeight = Math.min(...weights)
  const maxWeight = Math.max(...weights)
  const padding = (maxWeight - minWeight) * 0.1 || 5

  return (
    <div className="w-full flex flex-col rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 sm:p-8">
      <div className="mb-8">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-1">
          Weight Trends
        </h3>
        <p className="text-[10px] text-primary/60 font-medium uppercase tracking-wider">
          History over {data.length} days
        </p>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700 }}
              dy={10}
              // Show fewer ticks to prevent overlap if many data points
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.15)", fontSize: 10, fontWeight: 700 }}
              domain={[Math.floor(minWeight - padding), Math.ceil(maxWeight + padding)]}
              dx={-5}
            />
            <Tooltip
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-white/10 bg-black/95 px-4 py-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
                        {payload[0].payload.date}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                        <span className="text-[11px] font-black text-[#3b82f6]">
                          {payload[0].value} kg
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={4}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
