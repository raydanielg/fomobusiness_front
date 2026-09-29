"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  Gauge, CreditCard, FileText, ListChecks, Link as LinkIcon,
  MonitorArrowUp, ArrowCounterClockwise, ArrowsLeftRight,
  Warning, Scales, Lightning, Plugs, ChartLine, Gear,
} from "@phosphor-icons/react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavSecondary } from "@/components/nav-secondary"
import { BookOpen, Heartbeat } from "@phosphor-icons/react"

const nav = [
  { title: "Overview", url: "/billing", icon: <Gauge size={18} />, isActive: true },
  {
    title: "Payments",
    url: "/billing/payments",
    icon: <CreditCard size={18} />,
    items: [
      { title: "All payments", url: "/billing/payments" },
      { title: "Failed payments", url: "/billing/failed" },
      { title: "Refunds", url: "/billing/refunds" },
    ],
  },
  {
    title: "Commerce",
    url: "/billing/subscriptions",
    icon: <ListChecks size={18} />,
    items: [
      { title: "Subscriptions", url: "/billing/subscriptions" },
      { title: "Invoices", url: "/billing/invoices" },
      { title: "Payment links", url: "/billing/payment-links" },
      { title: "Checkout sessions", url: "/billing/sessions" },
    ],
  },
  {
    title: "Money movement",
    url: "/billing/payouts",
    icon: <ArrowsLeftRight size={18} />,
    items: [
      { title: "Payouts", url: "/billing/payouts" },
      { title: "Reconciliation", url: "/billing/reconciliation" },
    ],
  },
  {
    title: "Operations",
    url: "/billing/events",
    icon: <Lightning size={18} />,
    items: [
      { title: "Payment events", url: "/billing/events" },
      { title: "Webhooks", url: "/billing/webhooks" },
    ],
  },
  { title: "Providers", url: "/billing/providers", icon: <Gear size={18} /> },
  { title: "Analytics", url: "/billing/analytics", icon: <ChartLine size={18} /> },
]

const secondary = [
  { title: "API docs", url: "https://fomoapi.158-220-114-187.sslip.io/api/docs/", icon: <BookOpen size={18} /> },
  { title: "Health", url: "https://fomoapi.158-220-114-187.sslip.io/health/", icon: <Heartbeat size={18} /> },
]

export function AppSidebar() {
  const pathname = usePathname()
  // mark items active by route
  const items = nav.map((item) => ({
    ...item,
    isActive: item.url === "/billing"
      ? pathname === "/billing"
      : pathname.startsWith(item.url),
  }))

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/billing" />}>
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
        <NavMain label="Billing &amp; Payments" items={items} />
      </SidebarContent>

      <SidebarFooter>
        <NavSecondary items={secondary} />
        <NavUser
          user={{ name: "Fomo Admin", email: "admin", avatar: "/fomo_icon.png" }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
