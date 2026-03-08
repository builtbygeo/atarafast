# SVG Glow Filter Artifact Fix

## Problem
SVG `feGaussianBlur` filter causes rendering artifacts on arc paths at specific angles (around 180°). 

### Symptoms
- Glow appears "flat" or "not curved" in the middle of the arc
- Only affects certain plans (e.g., 20:4 where transition phase passes through 180°)
- The artifact is in the glow layer, not the main stroke

### Root Cause
SVG filters with `feGaussianBlur` can create visual artifacts when:
- The arc passes through certain angles (especially 180° / bottom of circle)
- The filter bounds interact with path geometry in unexpected ways

## Solution
Replace SVG filter with **multi-layer glow technique** - render multiple copies of the path with increasing strokeWidth and decreasing opacity.

### Before (Broken)
```tsx
<defs>
  <filter id="arc-glow" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="7" result="blur" />
  </filter>
</defs>

<path filter="url(#arc-glow)" ... />
```

### After (Fixed)
```tsx
{/* Arc Glow Layers - no SVG filter */}
{arcs.map(arc => (
  <g key={`${arc.id}-glow-group`}>
    <path stroke={arc.color} strokeWidth={strokeWidth + 20} strokeOpacity="0.08" strokeLinecap="round" ... />
    <path stroke={arc.color} strokeWidth={strokeWidth + 12} strokeOpacity="0.12" strokeLinecap="round" ... />
    <path stroke={arc.color} strokeWidth={strokeWidth + 6} strokeOpacity="0.18" strokeLinecap="round" ... />
  </g>
))}

{/* Main arc on top */}
{arcs.map(arc => (
  <path stroke={arc.color} strokeWidth={strokeWidth} strokeLinecap="round" ... />
))}
```

## Benefits
- No SVG filter artifacts
- Smooth, consistent glow at all angles
- More control over glow intensity via layer count/opacity
- Better performance (no filter computation)

## File Modified
- `components/circular-progress.tsx`

## Date
2026-03-08
