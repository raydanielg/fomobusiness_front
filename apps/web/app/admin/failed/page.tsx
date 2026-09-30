"use client"

import { useEffect, useState } from "react"
import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { KpiCard } from "@/components/kpi-card"
import { billing, Payment, ApiError } from "@/lib/api"
import { money, dateTime } from "@/lib/format"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function FailedPaymentsPage() {
  const [kpi, setKpi] = useState<{ count: number; amount: number } | null>(null)

  useEffect(() => {
    billing.payments("?status=failed&page_size=100")
      .then((r) => setKpi({
        count: r.count,
        amount: r.results.reduce((s, p) => s + parseFloat(p.amount || "0"), 0),
      }))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {kpi ? (
          <>
            <KpiCard label="Failed payments" value={String(kpi.count)} accent="danger" />
            <KpiCard label="Amount at risk" value={money(kpi.amount)} accent="danger" />
            <KpiCard label="Retry queue" value="Backend-driven" sub="provider decides" />
          </>
        ) : (
          <>
            <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
          </>
        )}
      </div>
      <DataPage<Payment>
        title="Failed Payments"
        description="Every failed collection — reason normalized from the provider."
        fetcher={(q) => billing.payments(`${q}&status=failed`)}
        columns={["Reference", "Business", "Customer", "Amount", "Reason", "Created"]}
        searchPlaceholder="Reference, customer…"
        emptyTitle="No failed payments"
        row={(p) => (
          <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40">
            <td className="px-4 py-3 font-mono text-xs">{p.reference}</td>
            <td className="px-4 py-3">{p.business_name || "—"}</td>
            <td className="px-4 py-3">
              <div>{p.customer_name || "—"}</div>
              <div className="text-muted-foreground font-mono text-xs">{p.customer_phone}</div>
            </td>
            <td className="px-4 py-3 font-medium tabular-nums">{money(p.amount, p.currency)}</td>
            <td className="max-w-56 px-4 py-3">
              <StatusBadge status={p.status} />
              {p.status_reason && (
                <p className="text-muted-foreground mt-0.5 truncate text-xs" title={p.status_reason}>
                  {p.status_reason}
                </p>
              )}
            </td>
            <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(p.created_at)}</td>
          </tr>
        )}
      />
    </div>
  )
}
