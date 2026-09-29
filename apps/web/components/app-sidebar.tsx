"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarHeader, SidebarFooter, SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  Gauge, CreditCard, FileText, ListChecks, Link as LinkIcon,
  MonitorArrowUp, ArrowCounterClockwise, ArrowsLeftRight,
  Warning, Scales, Lightning, Plugs, ChartLine, Gear,
  SignOut,
} from "@phosphor-icons/react"
import { clearTokens } from "@/lib/api"

const billingNav = [
  { title: "Overview", href: "/billing", icon: Gauge },
  { title: "Payments", href: "/billing/payments", icon: CreditCard },
  { title: "Subscriptions", href: "/billing/subscriptions", icon: ListChecks },
  { title: "Invoices", href: "/billing/invoices", icon: FileText },
  { title: "Payment Links", href: "/billing/payment-links", icon: LinkIcon },
  { title: "Checkout Sessions", href: "/billing/sessions", icon: MonitorArrowUp },
  { title: "Refunds", href: "/billing/refunds", icon: ArrowCounterClockwise },
  { title: "Payouts", href: "/billing/payouts", icon: ArrowsLeftRight },
  { title: "Failed Payments", href: "/billing/failed", icon: Warning },
  { title: "Reconciliation", href: "/billing/reconciliation", icon: Scales },
  { title: "Payment Events", href: "/billing/events", icon: Lightning },
  { title: "Webhooks", href: "/billing/webhooks", icon: Plugs },
  { title: "Providers", href: "/billing/providers", icon: Gear },
  { title: "Analytics", href: "/billing/analytics", icon: ChartLine },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-lime-400 font-bold text-black">
            F
          </div>
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold">Fomo</p>
            <p className="text-muted-foreground text-xs">Admin Console</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Billing &amp; Payments</SidebarGroupLabel>
          <SidebarMenu>
            {billingNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.href === "/billing"
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={() => {
                clearTokens()
                window.location.href = "/login"
              }}
            >
              <SignOut size={18} />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
