"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { billing, PaymentLink } from "@/lib/api"
import { money, dateTime } from "@/lib/format"
import { Button } from "@workspace/ui/components/button"
import { Copy } from "@phosphor-icons/react"

const STATUSES = ["active", "disabled", "expired"]

export default function PaymentLinksPage() {
  return (
    <DataPage<PaymentLink>
      title="Payment Links"
      description="Shareable checkout links that collect via the provider."
      fetcher={billing.links}
      columns={["Link", "Business", "Description", "Amount", "Payments", "Collected", "Status", ""]}
      statusOptions={STATUSES}
      searchPlaceholder="Reference, description…"
      emptyTitle="No payment links yet"
      row={(l) => (
        <tr key={l.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-mono text-xs">{l.reference}</td>
          <td className="px-4 py-3">{l.business_name || "—"}</td>
          <td className="max-w-40 truncate px-4 py-3">{l.description || "—"}</td>
          <td className="px-4 py-3 tabular-nums">
            {l.custom_amount ? "Custom" : money(l.amount, l.currency)}
          </td>
          <td className="px-4 py-3 tabular-nums">{l.payments_count}</td>
          <td className="px-4 py-3 tabular-nums">{money(l.total_collected, l.currency)}</td>
          <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
          <td className="px-4 py-3">
            <Button variant="ghost" size="icon" className="size-7" title="Copy link"
              onClick={() => void navigator.clipboard.writeText(l.url)}>
              <Copy size={14} />
            </Button>
          </td>
        </tr>
      )}
    />
  )
}
