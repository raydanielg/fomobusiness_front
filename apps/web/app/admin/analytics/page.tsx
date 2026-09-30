"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@workspace/ui/components/select"
import { admin, ApiError, GrowthSeries } from "@/lib/api"

const METRICS = [
  { key: "businesses" as const, label: "New businesses", color: "stroke-lime-500 fill-lime-500/15" },
  { key: "users" as const, label: "New users", color: "stroke-sky-500 fill-sky-500/15" },
  { key: "sales" as const, label: "Sales", color: "stroke-emerald-500 fill-emerald-500/15" },
]

export default function AnalyticsPage() {
  const [data, setData] = useState<GrowthSeries | null>(null)
  const [metric, setMetric] = useState<(typeof METRICS)[number]["key"]>("businesses")
  const [months, setMonths] = useState(12)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setData(await admin.growth(months))
      setError("")
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load.")
    } finally {
      setLoading(false)
    }
  }, [months])

  useEffect(() => { void load() }, [load])

  const series = data?.[metric] ?? []
  const meta = METRICS.find((m) => m.key === metric)!
  const max = Math.max(...series.map((s) => s.value), 1)
  const W = 800, H = 260
  const step = W / Math.max(series.length - 1, 1)
  const pts = series.map((s, i) => [i * step, H - (s.value / max) * (H - 20)] as const)
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ")
  const area = `${line} L${W},${H} L0,${H} Z`

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Growth Analytics</h1>
          <p className="text-muted-foreground text-sm">Platform growth over time.</p>
        </div>
        <div className="flex gap-2">
          <Select value={metric} onValueChange={(v) => setMetric(v as typeof metric)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {METRICS.map((m) => <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={String(months)} onValueChange={(v) => setMonths(Number(v))}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[3, 6, 12, 24].map((m) => <SelectItem key={m} value={String(m)}>{m} months</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Card className="border-red-500/40">
          <CardContent className="flex items-center justify-between p-4">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void load()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{meta.label} — last {months} months</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <>
              <svg viewBox={`0 0 ${W} ${H}`} className="h-64 w-full" preserveAspectRatio="none">
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f} x1={0} x2={W} y1={H * f} y2={H * f}
                    className="stroke-border" strokeDasharray="3 3" />
                ))}
                <path d={area} className={meta.color.split(" ")[1]} />
                <path d={line} fill="none" strokeWidth={2} className={meta.color.split(" ")[0]} />
              </svg>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{series[0]?.month}</span>
                <span>{series.at(-1)?.month}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* all three series side-by-side */}
      <div className="grid gap-4 md:grid-cols-3">
        {METRICS.map((m) => {
          const s = data?.[m.key] ?? []
          const mx = Math.max(...s.map((x) => x.value), 1)
          return (
            <Card key={m.key} className={metric === m.key ? "border-lime-400" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{m.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox={`0 0 ${W} ${H / 3}`} className="h-16 w-full" preserveAspectRatio="none">
                  {s.map((p, i) => (
                    <rect key={i}
                      x={i * (W / s.length) + 2}
                      y={(H / 3) - (p.value / mx) * (H / 3 - 4)}
                      width={Math.max(2, W / s.length - 4)}
                      height={(p.value / mx) * (H / 3 - 4)}
                      className={m.color.split(" ")[1]}
                      rx={2}
                    />
                  ))}
                </svg>
                <p className="text-muted-foreground mt-1 text-xs">
                  {s.reduce((a, b) => a + b.value, 0).toLocaleString()} total
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
