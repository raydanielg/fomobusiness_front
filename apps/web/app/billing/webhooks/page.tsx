"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { billing, WebhookEvent } from "@/lib/api"
import { dateTime } from "@/lib/format"

const STATUSES = ["received", "processed", "failed", "duplicate"]

export default function WebhooksPage() {
  return (
    <DataPage<WebhookEvent>
      title="Webhook Monitor"
      description="Inbound provider events — signature verification, dedup, processing."
      fetcher={billing.webhooks}
      columns={["Event ID", "Type", "Signature", "Status", "Attempts", "ms", "Received"]}
      statusOptions={STATUSES}
      searchPlaceholder="Event ID, type, payment ref…"
      emptyTitle="No webhook events yet"
      row={(w) => (
        <tr key={w.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 font-mono text-xs">{w.event_id.slice(0, 18)}…</td>
          <td className="px-4 py-3 font-mono text-xs">{w.event_type}</td>
          <td className="px-4 py-3"><StatusBadge status={w.signature_status} /></td>
          <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
          <td className="px-4 py-3 tabular-nums">{w.attempts}</td>
          <td className="px-4 py-3 tabular-nums">{w.processing_ms}ms</td>
          <td className="text-muted-foreground px-4 py-3 text-xs">{dateTime(w.received_at)}</td>
        </tr>
      )}
    />
  )
}
