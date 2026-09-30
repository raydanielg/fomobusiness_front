"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  Gauge, ChartLine, Buildings, Users, UserGear, GitBranch,
  Package, Archive, Receipt, CreditCard, FileText,
  ListChecks, Link as LinkIcon, MonitorArrowUp, ArrowCounterClockwise,
  ArrowsLeftRight, Warning, Scales, Lightning, Plugs, Gear,
  ChartBar, Bell, Lifebuoy, ShieldCheck, PuzzlePiece, Flag, Heartbeat,
  BookOpen, Pulse,
} from "@phosphor-icons/react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavSecondary } from "@/components/nav-secondary"
import { useAuth, hasPermission } from "@/lib/auth"

type Item = {
  title: string
  url: string
  icon: React.ReactNode
  perm?: string
  items?: { title: string; url: string }[]
}

const NAV: { label: string; items: Item[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: <Gauge size={18} />, perm: "dashboard.view" },
      { title: "Analytics", url: "/admin/analytics", icon: <ChartLine size={18} />, perm: "analytics.view" },
      { title: "Live Activity", url: "/admin/activity", icon: <Pulse size={18} /> },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Businesses", url: "/admin/businesses", icon: <Buildings size={18} />, perm: "businesses.view" },
      { title: "Users", url: "/admin/users", icon: <Users size={18} />, perm: "users.view" },
      { title: "Staff", url: "/admin/staff", icon: <UserGear size={18} />, perm: "staff.view" },
      { title: "Branches", url: "/admin/branches", icon: <GitBranch size={18} />, perm: "branches.view" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { title: "Products", url: "/admin/products", icon: <Package size={18} />, perm: "products.view" },
      { title: "Inventory", url: "/admin/inventory", icon: <Archive size={18} />, perm: "inventory.view" },
      { title: "Transactions", url: "/admin/transactions", icon: <Receipt size={18} />, perm: "payments.view" },
    ],
  },
  {
    label: "Billing & Payments",
    items: [
      {
        title: "Payments",
        url: "/admin/payments",
        icon: <CreditCard size={18} />,
        perm: "payments.view",
        items: [
          { title: "All payments", url: "/admin/payments" },
          { title: "Failed payments", url: "/admin/failed" },
          { title: "Refunds", url: "/admin/refunds" },
        ],
      },
      {
        title: "Revenue",
        url: "/admin/subscriptions",
        icon: <ListChecks size={18} />,
        perm: "subscriptions.view",
        items: [
          { title: "Subscriptions", url: "/admin/subscriptions" },
          { title: "Invoices", url: "/admin/invoices" },
          { title: "Payment links", url: "/admin/payment-links" },
          { title: "Checkout sessions", url: "/admin/sessions" },
        ],
      },
      {
        title: "Money movement",
        url: "/admin/payouts",
        icon: <ArrowsLeftRight size={18} />,
        perm: "payouts.view",
        items: [
          { title: "Payouts", url: "/admin/payouts" },
          { title: "Reconciliation", url: "/admin/reconciliation" },
        ],
      },
      {
        title: "Operations",
        url: "/admin/webhooks",
        icon: <Lightning size={18} />,
        items: [
          { title: "Webhooks", url: "/admin/webhooks" },
          { title: "Payment events", url: "/admin/events" },
        ],
      },
      { title: "Providers", url: "/admin/providers", icon: <Gear size={18} /> },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Reports", url: "/admin/reports", icon: <ChartBar size={18} />, perm: "reports.view" },
      { title: "Plans", url: "/admin/plans", icon: <ListChecks size={18} />, perm: "subscriptions.view" },
      { title: "Exports", url: "/admin/exports", icon: <FileText size={18} />, perm: "reports.view" },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Notifications", url: "/admin/notifications", icon: <Bell size={18} />, perm: "notifications.view" },
      { title: "Help Center", url: "/admin/help-center", icon: <BookOpen size={18} />, perm: "help.view" },
      { title: "Support", url: "/admin/support", icon: <Lifebuoy size={18} />, perm: "support.view" },
    ],
  },
  {
    label: "Security",
    items: [
      { title: "Audit Logs", url: "/admin/audit", icon: <FileText size={18} />, perm: "audit.view" },
      { title: "Security Events", url: "/admin/security", icon: <ShieldCheck size={18} />, perm: "security.view" },
      { title: "Sessions", url: "/admin/sessions-security", icon: <Users size={18} />, perm: "security.view" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Integrations", url: "/admin/integrations", icon: <PuzzlePiece size={18} />, perm: "integrations.view" },
      { title: "Feature Flags", url: "/admin/feature-flags", icon: <Flag size={18} />, perm: "feature_flags.view" },
      { title: "System Health", url: "/admin/system-health", icon: <Heartbeat size={18} />, perm: "system_health.view" },
      { title: "Settings", url: "/admin/settings", icon: <Gear size={18} />, perm: "settings.view" },
    ],
  },
]

const secondary = [
  { title: "API docs", url: "https://fomoapi.158-220-114-187.sslip.io/api/docs/", icon: <BookOpen size={18} /> },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useAuth()

  // Hide sections the admin lacks permission for — backend still enforces.
  const groups = NAV
    .map((g) => ({
      ...g,
      items: g.items
        .filter((i) => !i.perm || hasPermission(state, i.perm))
        .map((i) => ({
          ...i,
          isActive: i.url === "/admin/dashboard"
            ? pathname === i.url
            : pathname.startsWith(i.url),
        })),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/admin/dashboard" />}>
              <div className="flex size-8 items-center justify-center rounded-lg bg-lime-400">
                <Image src="/fomo_icon.png" alt="Fomo" width={24} height={24} />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">Fomo</span>
                <span className="text-muted-foreground truncate text-xs">
                  Admin Console
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g) => (
          <NavMain key={g.label} label={g.label} items={g.items} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavSecondary items={secondary} />
        <NavUser
          user={{
            name: state.user?.full_name ?? state.user?.email ?? "Admin",
            email: state.user?.email ?? "",
            avatar: state.user?.avatar ?? "/fomo_icon.png",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
