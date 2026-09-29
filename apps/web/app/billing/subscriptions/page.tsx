"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { api, Paged } from "@/lib/api"
import { money, date, dateTime } from "@/lib/format"

interface Sub {
  id: string
  business: string
  plan: string
  plan_code: string
  amount: string
  currency: string
  interval: string
  status: string
  period_end: string | null
  is_active: boolean
  created_at: string
}

const STATUSES = ["trialing", "active", "past_due", "cancelled", "expired"]

export default function SubscriptionsPage() {
  return (
    <DataPage<Sub>
      title="Subscriptions"
      description="Business subscriptions and billing cycles across the platform."
      fetcher={(q) => api.get<Paged<Sub>>(`/billing/admin/subscriptions/${q}`)}
      columns={["Business", "Plan", "Amount", "Cycle", "Status", "Renews", "Created"]}
      statusOptions={STATUSES}
      searchPlaceholder="Business…"
      emptyTitle="No subscriptions yet"
      row={(s) => (
        <tr key={s.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-medium">{s.business}</td>
          <td className="px-4 py-3">{s.plan}</td>
          <td className="px-4 py-3 font-medium tabular-nums">{money(s.amount, s.currency)}</td>
          <td className="px-4 py-3 capitalize">{s.interval}</td>
          <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{date(s.period_end)}</td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(s.created_at)}</td>
        </tr>
      )}
    />
  )
}
