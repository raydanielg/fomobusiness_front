"use client"

import { cn } from "@workspace/ui/lib/utils"
import type { Point } from "@/lib/api"

/** Tiny inline area chart — pure SVG, no chart library. */
export function Sparkline({
  data,
  className,
  stroke = "stroke-emerald-500",
  fill = "fill-emerald-500/15",
}: {
  data: Point[]
  className?: string
  stroke?: string
  fill?: string
}) {
  const W = 120
  const H = 36
  const vals = data.map((d) => d.value)
  const max = Math.max(...vals, 1)
  const step = W / Math.max(vals.length - 1, 1)
  const pts = vals.map((v, i) => [i * step, H - (v / max) * (H - 4) - 2] as const)
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ")
  const area = `${line} L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-9 w-full", className)} preserveAspectRatio="none">
      <path d={area} className={fill} />
      <path d={line} fill="none" strokeWidth={1.5} className={stroke} />
    </svg>
  )
}
