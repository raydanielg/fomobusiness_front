"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ArrowClockwise } from "@phosphor-icons/react"
import { admin, ApiError, PlatformDashboard } from "@/lib/api"
import { numCompact, money } from "@/lib/format"
import { Sparkline } from "@/components/sparkline"
import { StatusBadge } from "@/components/status-badge"
import { KpiCard } from "@/components/kpi-card"

export default function AdminDashboard() {
  const [data, setData] = useState<PlatformDashboard | null>(null)
  const [activity, setActivity] = useState<{ id: string; action: string; actor: string | null; business: string | null; time: string }[]>([])
  const [health, setHealth] = useState<Record<string, { status: string; workers?: number }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [d, a, h] = await Promise.all([
        admin.dashboard(),
        admin.activity(30),
        admin.systemHealth(),
      ])
      setData(d)
      setActivity(a.items)
      setHealth(h.services)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load dashboard.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="border-red-500/40">
        <CardContent className="flex items-center justify-between p-6">
          <p className="text-sm text-red-500">{error || "No data"}</p>
          <Button variant="outline" onClick={() => void load()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  const k = data

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground text-sm">
            Live platform snapshot — {new Date(k.generated_at).toLocaleString()}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <ArrowClockwise size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* alert strip */}
      {k.alerts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {k.alerts.map((a) => (
            <Link key={a.title} href={a.href}>
              <Badge
                variant={a.severity === "high" ? "destructive" : "secondary"}
                className="cursor-pointer"
              >
                {a.title}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* KPI grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Businesses" value={numCompact(k.businesses.total)}
          sub={`${k.businesses.active} active · ${k.businesses.new_30d} new`} />
        <KpiCard label="Users" value={numCompact(k.users.total)}
          sub={`${k.users.dau} today · ${k.users.mau} monthly`} />
        <KpiCard label="Revenue" value={money(k.revenue.total)}
          sub={`${money(k.revenue.last_30d)} last 30d`} accent="success" />
        <KpiCard label="Sales" value={numCompact(k.sales.total)}
          sub={`${k.sales.today} today`} />
        <KpiCard label="Subscriptions" value={numCompact(k.subscriptions.active)}
          sub={`${k.subscriptions.trialing} trial · ${k.subscriptions.expiring_7d} expiring`} />
        <KpiCard label="Payments" value={numCompact(k.revenue.payments.completed)}
          sub={`${k.revenue.payments.failed} failed`} accent={k.revenue.payments.failed ? "danger" : "success"} />
        <KpiCard label="Notifications" value={numCompact(k.notifications.total)}
          sub={`${k.notifications.unread} unread`} />
        <KpiCard label="Webhooks" value={numCompact(k.webhooks.total)}
          sub={`${k.webhooks.failed} failed`} accent={k.webhooks.failed ? "danger" : "success"} />
      </div>

      {/* charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Business growth (14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Sparkline data={k.businesses.trend} stroke="stroke-lime-500" fill="fill-lime-500/15" className="h-32" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{k.businesses.trend[0]?.date}</span>
              <span>{k.businesses.trend.at(-1)?.date}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue (14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Sparkline data={k.revenue.trend} stroke="stroke-emerald-500" fill="fill-emerald-500/15" className="h-32" />
          </CardContent>
        </Card>
      </div>

      {/* plan distribution + system health + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Plan distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {k.subscriptions.by_plan.map((p) => (
              <div key={p.plan__code} className="flex items-center justify-between text-sm">
                <span>{p.plan__name ?? p.plan__code}</span>
                <Badge variant="secondary">{p.n}</Badge>
              </div>
            ))}
            {k.subscriptions.by_plan.length === 0 && (
              <p className="text-muted-foreground text-sm">No subscriptions yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">System health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(health).map(([name, s]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="capitalize">{name.replace(/_/g, " ")}</span>
                <StatusBadge status={s.status} />
              </div>
            ))}
            {Object.keys(health).length === 0 && (
              <p className="text-muted-foreground text-sm">Checking…</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Live activity</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 space-y-2 overflow-auto">
            {activity.map((a) => (
              <div key={a.id} className="border-b pb-2 text-xs last:border-0">
                <p className="font-medium">{a.action}</p>
                <p className="text-muted-foreground">
                  {a.actor ?? "system"} {a.business ? `· ${a.business}` : ""}
                </p>
                <p className="text-muted-foreground/70">
                  {new Date(a.time).toLocaleTimeString()}
                </p>
              </div>
            ))}
            {activity.length === 0 && (
              <p className="text-muted-foreground text-sm">No activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
