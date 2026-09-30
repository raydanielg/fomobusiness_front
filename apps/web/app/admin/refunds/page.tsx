"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { billing, Refund } from "@/lib/api"
import { money, dateTime } from "@/lib/format"

const STATUSES = ["pending", "completed", "failed"]

export default function RefundsPage() {
  return (
    <DataPage<Refund>
      title="Refunds"
      description="Refunded provider payments."
      fetcher={billing.refunds}
      columns={["Refund", "Payment", "Amount", "Reason", "Status", "Created", "Completed"]}
      statusOptions={STATUSES}
      searchPlaceholder="Reference…"
      emptyTitle="No refunds"
      row={(r) => (
        <tr key={r.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-mono text-xs">{r.reference}</td>
          <td className="px-4 py-3 font-mono text-xs">{r.payment_reference}</td>
          <td className="px-4 py-3 font-medium tabular-nums">{money(r.amount, r.currency)}</td>
          <td className="max-w-52 truncate px-4 py-3 text-xs">{r.reason || "—"}</td>
          <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(r.created_at)}</td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(r.completed_at)}</td>
        </tr>
      )}
    />
  )
}
