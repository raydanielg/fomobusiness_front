"use client"

import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { admin, AdminUser } from "@/lib/api"
import { date, dateTime } from "@/lib/format"

export default function UsersPage() {
  return (
    <DataPage<AdminUser>
      title="Users"
      description="Every account on the platform."
      searchPlaceholder="Search name or email…"
      statusOptions={["active", "inactive", "staff"]}
      fetcher={(q) => admin.users(q)}
      columns={["User", "Phone", "Status", "Businesses", "Roles", "Last login", "Joined"]}
      row={(u) => (
        <tr key={u.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3">
            <p className="font-medium">{u.full_name || u.email}</p>
            <p className="text-muted-foreground text-xs">{u.email}</p>
          </td>
          <td className="px-4 py-3 text-sm">{u.phone || "—"}</td>
          <td className="px-4 py-3">
            <StatusBadge status={u.is_active ? "active" : "suspended"} />
            {u.is_superuser && (
              <span className="ms-1 rounded bg-violet-500/15 px-1.5 py-0.5 text-xs font-medium text-violet-600">
                admin
              </span>
            )}
          </td>
          <td className="px-4 py-3 text-sm">
            {u.businesses.map((b) => b.name).join(", ") || "—"}
          </td>
          <td className="px-4 py-3">
            {u.roles.slice(0, 2).map((r) => (
              <span key={r} className="me-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                {r}
              </span>
            ))}
          </td>
          <td className="px-4 py-3 text-muted-foreground text-xs">
            {u.last_login ? dateTime(u.last_login) : "Never"}
          </td>
          <td className="px-4 py-3 text-muted-foreground text-xs">{date(u.date_joined)}</td>
        </tr>
      )}
      emptyTitle="No users yet"
    />
  )
}
