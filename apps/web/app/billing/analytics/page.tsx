"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { billing, BillingOverview, ApiError, Payment } from "@/lib/api"
import { money } from "@/lib/format"

/** Analytics wall — server-computed only; no frontend-mental math on money. */
export default function AnalyticsPage() {
  const [ov, setOv] = useState<BillingOverview | null>(null)
  const [byStatus, setByStatus] = useState<Record<string, number>>({})
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const o = await billing.overview()
        setOv(o)
        // status distribution from payments list pages
        const all = await billing.payments("?page_size=100")
        const dist: Record<string, number> = {}
        for (const p of all.results) dist[p.status] = (dist[p.status] ?? 0) + 1
        setByStatus(dist)
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Failed.")
      }
    }
    void load()
  }, [])

  const total = Object.values(byStatus).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Revenue, volumes and rates computed server-side.
        </p>
      </div>

      {error && (
        <Card className="border-red-500/40">
          <CardContent className="p-4 text-sm text-red-500">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Payment status split</CardTitle></CardHeader>
          <CardContent>
            {!ov ? <Skeleton className="h-40" /> : total === 0 ? (
              <p className="text-muted-foreground text-sm">No payment data yet.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(byStatus).map(([s, c]) => (
                  <div key={s}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="capitalize">{s}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {c} · {Math.round((c / total) * 100)}%
                      </span>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className={
                          s === "completed" ? "h-full bg-emerald-500" :
                          s === "failed" ? "h-full bg-red-500" :
                          s === "pending" ? "h-full bg-amber-500" :
                          "h-full bg-zinc-500"
                        }
                        style={{ width: `${(c / total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Success rate</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            {!ov ? <Skeleton className="size-36 rounded-full" /> : (() => {
              const done = byStatus["completed"] ?? 0
              const settled = (byStatus["completed"] ?? 0) + (byStatus["failed"] ?? 0)
              const pct = settled ? Math.round((done / settled) * 1000) / 10 : null
              const r = 56, circ = 2 * Math.PI * r
              return (
                <div className="text-center">
                  <svg width="150" height="150" className="mx-auto">
                    <circle cx="75" cy="75" r={r} fill="none" strokeWidth="10"
                      className="stroke-muted" />
                    {pct != null && (
                      <circle cx="75" cy="75" r={r} fill="none" strokeWidth="10"
                        stroke="#a3e635" strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ - (pct / 100) * circ}
                        transform="rotate(-90 75 75)" />
                    )}
                  </svg>
                  <p className="mt-2 text-3xl font-bold tabular-nums">
                    {pct == null ? "—" : `${pct}%`}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {settled ? `${done} of ${settled} settled payments` : "awaiting payments"}
                  </p>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
