"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ArrowLeft } from "@phosphor-icons/react"
import { admin, AdminBusinessDetail, ApiError } from "@/lib/api"
import { StatusBadge } from "@/components/status-badge"
import { KpiCard } from "@/components/kpi-card"
import { date, dateTime } from "@/lib/format"

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [b, setB] = useState<AdminBusinessDetail | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setB(await admin.business(id))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load business.")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { void load() }, [load])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    )
  }

  if (error || !b) {
    return (
      <Card className="border-red-500/40">
        <CardContent className="p-6 text-sm text-red-500">{error || "Not found"}</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{b.name}</h1>
            <StatusBadge status={b.status} />
            {b.plan_code && (
              <Badge variant="secondary">{b.plan_code}</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {b.business_type} · {b.city || "—"}, {b.region || "—"} · joined {date(b.created_at)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Sales" value={String(b.stats.sales)} />
        <KpiCard label="Products" value={String(b.stats.products)} />
        <KpiCard label="Customers" value={String(b.stats.customers)} />
        <KpiCard label="Suppliers" value={String(b.stats.suppliers)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Owner</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{b.owner_name}</p>
            <p className="text-muted-foreground">{b.owner_email}</p>
            {b.phone && <p className="text-muted-foreground">{b.phone}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Subscription</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            {b.plan_code ? (
              <>
                <p className="font-medium">{b.plan_code}</p>
                <StatusBadge status={b.subscription_status ?? "unknown"} />
              </>
            ) : (
              <p className="text-muted-foreground">No subscription</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members ({b.member_count})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground border-b text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2">Member</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {b.members.map((m) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-4 py-2.5">
                    <p className="font-medium">{m.user}</p>
                    <p className="text-muted-foreground text-xs">{m.email}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.role}</span>
                  </td>
                  <td className="px-4 py-2.5"><StatusBadge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-xs">
        Last updated {dateTime(b.updated_at)} · id {b.id}
      </p>
    </div>
  )
}
