"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { billing, Payout } from "@/lib/api"
import { money, dateTime } from "@/lib/format"

const STATUSES = ["pending", "completed", "failed", "reversed"]

export default function PayoutsPage() {
  return (
    <DataPage<Payout>
      title="Payouts"
      description="Disbursements sent through the payment provider."
      fetcher={billing.payouts}
      columns={["Reference", "Business", "Recipient", "Channel", "Amount", "Fee", "Status", "Created"]}
      statusOptions={STATUSES}
      searchPlaceholder="Reference, recipient…"
      emptyTitle="No payouts yet"
      row={(p) => (
        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-mono text-xs">{p.reference}</td>
          <td className="px-4 py-3">{p.business_name || "—"}</td>
          <td className="px-4 py-3">
            <div>{p.recipient_name || "—"}</div>
            <div className="text-muted-foreground font-mono text-xs">{p.masked_phone}</div>
          </td>
          <td className="px-4 py-3 capitalize">{p.channel || "—"}</td>
          <td className="px-4 py-3 font-medium tabular-nums">{money(p.amount, p.currency)}</td>
          <td className="text-muted-foreground px-4 py-3 tabular-nums">{money(p.fee, p.currency)}</td>
          <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(p.created_at)}</td>
        </tr>
      )}
    />
  )
}
