"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { billing, Payment } from "@/lib/api"
import { money, dateTime } from "@/lib/format"
import Link from "next/link"

const STATUSES = ["pending", "completed", "failed", "voided", "expired", "cancelled", "refunded"]

export default function PaymentsPage() {
  return (
    <DataPage<Payment>
      title="Payments"
      description="Normalized provider payments across all businesses."
      fetcher={billing.payments}
      columns={["Reference", "Business", "Customer", "Channel", "Amount", "Status", "Created"]}
      statusOptions={STATUSES}
      searchPlaceholder="Reference, customer, phone…"
      emptyTitle="No payments found"
      row={(p) => (
        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3">
            <Link href={`/billing/payments/${p.id}`}
              className="font-mono text-xs text-primary hover:underline">
              {p.reference}
            </Link>
          </td>
          <td className="px-4 py-3">{p.business_name || "—"}</td>
          <td className="px-4 py-3">
            <div>{p.customer_name || "—"}</div>
            <div className="text-muted-foreground text-xs">{p.customer_phone}</div>
          </td>
          <td className="px-4 py-3 capitalize">{p.channel_detail || p.channel}</td>
          <td className="px-4 py-3 font-medium tabular-nums">{money(p.amount, p.currency)}</td>
          <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(p.created_at)}</td>
        </tr>
      )}
    />
  )
}
