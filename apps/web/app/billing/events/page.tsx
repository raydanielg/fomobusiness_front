"use client"

import { DataPage } from "@/components/data-page"
import { billing, PaymentEvent } from "@/lib/api"
import { money, dateTime } from "@/lib/format"

export default function PaymentEventsPage() {
  return (
    <DataPage<PaymentEvent>
      title="Payment Events"
      description="Normalized lifecycle events — created, completed, failed, refunded, payouts."
      fetcher={billing.events}
      columns={["Type", "Payment", "Business", "Amount", "Source", "Detail", "Time"]}
      searchPlaceholder="Payment reference…"
      emptyTitle="No payment events yet"
      row={(e) => (
        <tr key={e.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-mono text-xs">{e.event_type}</td>
          <td className="px-4 py-3 font-mono text-xs">{e.payment_reference}</td>
          <td className="px-4 py-3">{e.business_name || "—"}</td>
          <td className="px-4 py-3 tabular-nums">
            {e.amount ? money(e.amount, e.currency) : "—"}
          </td>
          <td className="px-4 py-3 capitalize">{e.source}</td>
          <td className="text-muted-foreground max-w-48 truncate px-4 py-3 text-xs">
            {e.detail || "—"}
          </td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(e.created_at)}</td>
        </tr>
      )}
    />
  )
}
