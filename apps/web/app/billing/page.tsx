"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { ArrowsClockwise } from "@phosphor-icons/react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@workspace/ui/components/table"
import { billing, BillingOverview, Payment, ApiError } from "@/lib/api"
import { KpiCard } from "@/components/kpi-card"
import { StatusBadge } from "@/components/status-badge"
import { money, dateTime, timeAgo } from "@/lib/format"

export default function BillingOverviewPage() {
  const [ov, setOv] = useState<BillingOverview | null>(null)
  const [recent, setRecent] = useState<Payment[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError("")
    try {
      const [o, p] = await Promise.all([
        billing.overview(),
        billing.payments("?page_size=8"),
      ])
      setOv(o)
      setRecent(p.results)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load overview.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const k = ov?.kpis

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Billing &amp; Payments
          </h1>
          <p className="text-muted-foreground text-sm">
            Monitor subscriptions, collections, invoices and payment activity
            across the Fomo platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs">
            {ov?.date ?? ""} · updated{" "}
            {ov?.last_event_at ? timeAgo(ov.last_event_at) : "—"}
          </span>
          <Badge
            variant="outline"
            className="gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            LIVE
          </Badge>
          <Button
            variant="outline" size="sm"
            onClick={() => void load()} disabled={loading}
          >
            <ArrowsClockwise size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-500/40">
          <CardContent className="p-4 text-sm text-red-500">{error}</CardContent>
        </Card>
      )}

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loading && !ov ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))
        ) : (
          <>
            <KpiCard label="Total revenue" value={money(k?.total_revenue)}
              accent="success" />
            <KpiCard label="MRR" value={money(k?.mrr)}
              delta={k?.month_change_pct} sub="vs previous month" />
            <KpiCard label="Today's collections"
              value={money(k?.today_collections)} />
            <KpiCard label="Successful payments"
              value={String(k?.successful ?? 0)} accent="success" />
            <KpiCard label="Pending" value={String(k?.pending ?? 0)}
              accent="warning" />
            <KpiCard label="Failed" value={String(k?.failed ?? 0)}
              accent="danger" />
            <KpiCard label="Refunds" value={money(k?.refunds)} />
            <KpiCard label="Outstanding invoices"
              value={money(k?.outstanding_invoices)} accent="warning" />
          </>
        )}
      </div>

      {/* sparkline + activity summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue — last 14 days</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !ov ? (
            <Skeleton className="h-32" />
          ) : ov && ov.sparkline.length > 0 ? (
            <Sparkline data={ov.sparkline} />
          ) : (
            <p className="text-muted-foreground text-sm">
              No provider payments yet. Collections through Snippe will appear
              here.
            </p>
          )}
        </CardContent>
      </Card>

      {/* recent payments */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Recent payments</CardTitle>
          <a href="/billing/payments" className="text-sm text-primary">
            View all →
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}
                    className="text-muted-foreground py-8 text-center">
                    {loading ? "Loading…" : "No payments yet"}
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">
                      {p.reference}
                    </TableCell>
                    <TableCell>{p.business_name || "—"}</TableCell>
                    <TableCell className="capitalize">
                      {p.channel_detail || p.channel}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {money(p.amount, p.currency)}
                    </TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-muted-foreground text-right text-xs">
                      {dateTime(p.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/** Pure-SVG sparkline — no chart lib needed for a KPI spark. */
function Sparkline({ data }: { data: { date: string; total: number }[] }) {
  const w = 600, h = 120, pad = 8
  const vals = data.map((d) => d.total)
  const max = Math.max(...vals, 1)
  const step = (w - pad * 2) / Math.max(data.length - 1, 1)
  const pts = vals.map((v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)])
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ")
  const area = `${line} L${pts[pts.length - 1]?.[0] ?? w},${h} L${pts[0]?.[0] ?? pad},${h} Z`
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full" role="img"
        aria-label="Revenue sparkline">
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#spark)" />
        <path d={line} fill="none" stroke="#a3e635" strokeWidth="2"
          strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#a3e635" />
        ))}
      </svg>
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}
