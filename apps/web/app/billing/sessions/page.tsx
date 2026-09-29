"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { billing, CheckoutSession } from "@/lib/api"
import { money, dateTime } from "@/lib/format"
import { Button } from "@workspace/ui/components/button"

const STATUSES = ["open", "completed", "expired", "cancelled"]

export default function SessionsPage() {
  return (
    <DataPage<CheckoutSession>
      title="Checkout Sessions"
      description="Hosted checkout sessions (Snippe Sessions)."
      fetcher={billing.sessions}
      columns={["Session", "Business", "Customer", "Amount", "Status", "Created", "Checkout"]}
      statusOptions={STATUSES}
      searchPlaceholder="Session reference…"
      emptyTitle="No checkout sessions"
      row={(s) => (
        <tr key={s.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-mono text-xs">{s.session_reference}</td>
          <td className="px-4 py-3">{s.business_name || "—"}</td>
          <td className="px-4 py-3">{s.customer_name || "—"}</td>
          <td className="px-4 py-3 font-medium tabular-nums">{money(s.amount, s.currency)}</td>
          <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(s.created_at)}</td>
          <td className="px-4 py-3">
            {s.checkout_url ? (
              <Button variant="ghost" size="sm"
                render={<a href={s.checkout_url} target="_blank" rel="noreferrer" />}>
                Open
              </Button>
            ) : "—"}
          </td>
        </tr>
      )}
    />
  )
}
