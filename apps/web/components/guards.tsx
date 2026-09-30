"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, destinationFor } from "@/lib/auth"

export function FullPageLoader({ label = "Signing you in…" }: { label?: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <div className="size-9 animate-spin rounded-full border-2 border-lime-400 border-t-transparent motion-reduce:animate-none" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}

/** Page that needs any authenticated session. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!state.loading && !state.authenticated) router.replace("/auth/login")
    if (!state.loading && state.status === "SUSPENDED") router.replace("/suspended")
  }, [state, router])
  if (state.loading || !state.authenticated || state.status === "SUSPENDED") {
    return <FullPageLoader />
  }
  return <>{children}</>
}

/** Platform-admin-only area. Non-admins get redirected away. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (state.loading) return
    if (!state.authenticated) router.replace("/auth/login")
    else if (!state.isPlatformAdmin) router.replace("/forbidden")
  }, [state, router])
  if (state.loading || !state.authenticated) return <FullPageLoader />
  if (!state.isPlatformAdmin) return <FullPageLoader label="Checking access…" />
  return <>{children}</>
}

/** Post-login router — shows a transition, never flashes wrong UI. */
export function PostLoginRedirect() {
  const { state } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (state.loading) return
    if (!state.authenticated) return
    router.replace(destinationFor(state))
  }, [state, router])
  return <FullPageLoader label="Welcome to Fomo" />
}
