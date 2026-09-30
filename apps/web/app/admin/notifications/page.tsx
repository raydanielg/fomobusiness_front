"use client"

import { DataPage } from "@/components/data-page"
import { admin, AdminNotification } from "@/lib/api"
import { dateTime } from "@/lib/format"
import { Badge } from "@workspace/ui/components/badge"

export default function NotificationsPage() {
  return (
    <DataPage<AdminNotification>
      title="Notifications"
      description="Every notification sent across the platform."
      searchPlaceholder="Search user, title…"
      fetcher={(q) => admin.notifications(q)}
      columns={["Time", "To", "Type", "Title", "Business", "Status"]}
      row={(n) => (
        <tr key={n.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
            {dateTime(n.created_at)}
          </td>
          <td className="px-4 py-3 text-sm">{n.user_email}</td>
          <td className="px-4 py-3">
            <Badge variant="secondary" className="capitalize">
              {n.type.replace(/_/g, " ")}
            </Badge>
          </td>
          <td className="px-4 py-3">
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-muted-foreground line-clamp-1 text-xs">{n.message}</p>
          </td>
          <td className="px-4 py-3 text-sm">{n.business_name ?? "—"}</td>
          <td className="px-4 py-3">
            {n.read_at ? (
              <Badge variant="secondary">read</Badge>
            ) : (
              <Badge variant="outline">unread</Badge>
            )}
          </td>
        </tr>
      )}
      emptyTitle="No notifications sent yet"
    />
  )
}
