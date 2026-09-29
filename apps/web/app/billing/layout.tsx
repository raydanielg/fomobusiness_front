"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  SidebarProvider, SidebarInset, SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { getToken } from "@/lib/api"

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    if (getToken()) setAuthed(true)
    else router.replace("/login")
  }, [router])

  if (authed !== true) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <p className="text-sm font-medium">Fomo Financial Command Center</p>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
