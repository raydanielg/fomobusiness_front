"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { billing, Recon } from "@/lib/api"
import { money, dateTime } from "@/lib/format"

const STATUSES = ["matched", "mismatch", "missing_provider", "missing_internal", "pending", "manual_review"]

export default function ReconciliationPage() {
  return (
    <DataPage<Recon>
      title="Reconciliation Center"
      description="Fomo records vs provider records — mismatches are flagged."
      fetcher={billing.reconciliation}
      columns={["Internal Ref", "Provider Ref", "Fomo Amt", "Provider Amt", "Statuses", "Result", "Checked"]}
      statusOptions={STATUSES}
      searchPlaceholder="Reference…"
      emptyTitle="No reconciliation records"
      row={(r) => (
        <tr key={r.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-mono text-xs">{r.internal_reference}</td>
          <td className="px-4 py-3 font-mono text-xs">{r.external_reference || "—"}</td>
          <td className="px-4 py-3 tabular-nums">{r.internal_amount ? money(r.internal_amount) : "—"}</td>
          <td className="px-4 py-3 tabular-nums">{r.external_amount ? money(r.external_amount) : "—"}</td>
          <td className="px-4 py-3 text-xs">
            <div>{r.internal_status || "—"}</div>
            <div className="text-muted-foreground">→ {r.external_status || "—"}</div>
          </td>
          <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(r.checked_at)}</td>
        </tr>
      )}
    />
  )
}
