"use client"

import { DataPage } from "@/components/data-page"
import { admin, AuditEntry } from "@/lib/api"
import { dateTime } from "@/lib/format"

export default function AuditPage() {
  return (
    <DataPage<AuditEntry>
      title="Audit Logs"
      description="Immutable trail of every sensitive action."
      searchPlaceholder="Search actor, action, resource…"
      fetcher={(q) => admin.auditLogs(q)}
      columns={["Time", "Actor", "Action", "Resource", "Business", "IP"]}
      row={(l) => (
        <tr key={l.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
            {dateTime(l.created_at)}
          </td>
          <td className="px-4 py-3">
            <p className="text-sm">{l.actor_name ?? "system"}</p>
            <p className="text-muted-foreground text-xs">{l.actor_email}</p>
          </td>
          <td className="px-4 py-3">
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{l.action}</code>
          </td>
          <td className="px-4 py-3 text-sm">
            {l.resource_type}
            {l.resource_id && (
              <p className="text-muted-foreground text-xs">{l.resource_id.slice(0, 12)}…</p>
            )}
          </td>
          <td className="px-4 py-3 text-sm">{l.business_name ?? "—"}</td>
          <td className="px-4 py-3 text-muted-foreground text-xs">{l.ip_address ?? "—"}</td>
        </tr>
      )}
      emptyTitle="No audit events yet"
    />
  )
}
