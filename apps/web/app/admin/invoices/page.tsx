"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { api, Paged } from "@/lib/api"
import { money, date, dateTime } from "@/lib/format"

interface Inv {
  id: string
  invoice_number: string
  business: string
  customer: string
  total: string
  paid: string
  balance_due: string
  currency: string
  status: string
  due_date: string | null
  created_at: string
}

const STATUSES = ["draft", "issued", "partially_paid", "paid", "overdue", "cancelled"]

export default function InvoicesPage() {
  return (
    <DataPage<Inv>
      title="Invoices"
      description="All invoices issued by businesses on the platform."
      fetcher={(q) => api.get<Paged<Inv>>(`/billing/admin/invoices/${q}`)}
      columns={["Invoice", "Business", "Customer", "Total", "Paid", "Balance", "Status", "Due"]}
      statusOptions={STATUSES}
      searchPlaceholder="Invoice #, business, customer…"
      emptyTitle="No invoices"
      row={(i) => (
        <tr key={i.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-mono text-xs">{i.invoice_number}</td>
          <td className="px-4 py-3">{i.business}</td>
          <td className="px-4 py-3">{i.customer || "—"}</td>
          <td className="px-4 py-3 font-medium tabular-nums">{money(i.total, i.currency)}</td>
          <td className="px-4 py-3 tabular-nums text-emerald-600 dark:text-emerald-400">
            {money(i.paid, i.currency)}
          </td>
          <td className="px-4 py-3 tabular-nums">
            {money(i.balance_due, i.currency)}
          </td>
          <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{date(i.due_date)}</td>
        </tr>
      )}
    />
  )
}
