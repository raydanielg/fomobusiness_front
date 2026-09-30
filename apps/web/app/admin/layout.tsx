"use client"

import {
  SidebarProvider, SidebarInset, SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { RequireAdmin } from "@/components/guards"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAdmin>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <p className="text-sm font-medium">Fomo Admin</p>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </RequireAdmin>
  )
}
