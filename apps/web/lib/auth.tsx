"use client"

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react"
import { useRouter } from "next/navigation"
import {
  api, AuthResponse, AuthUser, clearTokens, getToken, setTokens,
} from "@/lib/api"

export interface AuthState {
  user: AuthUser | null
  role: string | null
  status: string | null
  permissions: string[]
  isPlatformAdmin: boolean
  loading: boolean
  authenticated: boolean
}

const initial: AuthState = {
  user: null,
  role: null,
  status: null,
  permissions: [],
  isPlatformAdmin: false,
  loading: true,
  authenticated: false,
}

const Ctx = createContext<{
  state: AuthState
  signIn: (res: AuthResponse) => void
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}>({ state: initial, signIn: () => {}, signOut: async () => {}, refresh: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initial)

  const apply = useCallback((d: Omit<AuthResponse, "access" | "refresh">) => {
    setState({
      user: d.user,
      role: d.role,
      status: d.status,
      permissions: d.permissions ?? [],
      isPlatformAdmin: d.is_platform_admin,
      loading: false,
      authenticated: true,
    })
  }, [])

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setState((s) => ({ ...s, loading: false, authenticated: false }))
      return
    }
    try {
      apply(await api.me())
    } catch {
      clearTokens()
      setState({ ...initial, loading: false })
    }
  }, [apply])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const signIn = useCallback((res: AuthResponse) => {
    setTokens(res.access, res.refresh)
    apply(res)
  }, [apply])

  const signOut = useCallback(async () => {
    await api.logout()
    clearTokens()
    setState({ ...initial, loading: false })
  }, [])

  const value = useMemo(() => ({ state, signIn, signOut, refresh }),
    [state, signIn, signOut, refresh])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)

/** Centralized authorization — backend sends role/permissions;
 *  frontend only consumes them. */
export function isPlatformAdmin(s: Pick<AuthState, "isPlatformAdmin">) {
  return s.isPlatformAdmin
}

export function hasPermission(s: AuthState, perm: string) {
  return s.permissions.includes("*") || s.permissions.includes(perm)
}

/** Where an authenticated identity belongs on the web. */
export function destinationFor(s: Pick<AuthState, "status" | "isPlatformAdmin">) {
  if (s.status === "SUSPENDED") return "/suspended"
  if (s.isPlatformAdmin) return "/admin/dashboard"
  return "/mobile-app"
}
