"use client"

import Link from "next/link"
import { DataPage } from "@/components/data-page"
import { StatusBadge } from "@/components/status-badge"
import { admin, AdminBusiness } from "@/lib/api"
import { date } from "@/lib/format"

export default function BusinessesPage() {
  return (
    <DataPage<AdminBusiness>
      title="Businesses"
      description="Every tenant on the platform."
      searchPlaceholder="Search name, slug, owner…"
      statusOptions={["active", "suspended", "closed"]}
      fetcher={(q) => admin.businesses(q)}
      columns={["Business", "Owner", "Type", "Plan", "Status", "Branches", "Users", "Created"]}
      row={(b) => (
        <tr key={b.id} className="border-b last:border-0 hover:bg-muted/40">
          <td className="px-4 py-3">
            <Link href={`/admin/businesses/${b.id}`} className="font-medium hover:underline">
              {b.name}
            </Link>
            <p className="text-muted-foreground text-xs">{b.slug}</p>
          </td>
          <td className="px-4 py-3">
            <p className="text-sm">{b.owner_name}</p>
            <p className="text-muted-foreground text-xs">{b.owner_email}</p>
          </td>
          <td className="px-4 py-3 capitalize">{b.business_type}</td>
          <td className="px-4 py-3">
            {b.plan_code ? (
              <span className="rounded bg-lime-500/15 px-2 py-0.5 text-xs font-medium text-lime-600">
                {b.plan_code}
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </td>
          <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
          <td className="px-4 py-3 tabular-nums">{b.branch_count}</td>
          <td className="px-4 py-3 tabular-nums">{b.member_count}</td>
          <td className="px-4 py-3 text-muted-foreground text-xs">{date(b.created_at)}</td>
        </tr>
      )}
      emptyTitle="No businesses yet"
    />
  )
}
