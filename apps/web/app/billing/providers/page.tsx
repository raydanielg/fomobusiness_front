"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { CheckCircle, XCircle, ArrowsClockwise } from "@phosphor-icons/react"
import { billing, Provider, ProviderHealth, ApiError } from "@/lib/api"
import { StatusBadge } from "@/components/status-badge"
import { money, dateTime } from "@/lib/format"

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [health, setHealth] = useState<ProviderHealth | null>(null)
  const [balance, setBalance] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    setError("")
    try {
      const [p, h] = await Promise.all([
        billing.providers(),
        billing.snippeHealth().catch(() => null),
      ])
      setProviders(p.results)
      setHealth(h)
      if (h?.ok) {
        try {
          setBalance(await billing.snippeBalance())
        } catch {
          setBalance(null)
        }
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load providers.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const bal = (balance?.data as Record<string, unknown> | undefined)
  const avail = bal?.available as { value?: number; currency?: string } | undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Providers</h1>
          <p className="text-muted-foreground text-sm">
            Connection, version and health of configured providers.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <ArrowsClockwise size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/40">
          <CardContent className="p-4 text-sm text-red-500">{error}</CardContent>
        </Card>
      )}

      {/* Snippe card — live health */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-lime-400 font-bold text-black">
              S
            </div>
            <div>
              <CardTitle className="text-lg">Snippe</CardTitle>
              <p className="text-muted-foreground font-mono text-xs">
                api.snippe.sh · v{providers[0]?.api_version || "2026-01-25"}
              </p>
            </div>
          </div>
          {health && (
            <Badge variant="outline"
              className={health.ok
                ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                : "border-red-500/40 text-red-600 dark:text-red-400"}>
              {health.ok
                ? <><CheckCircle size={13} weight="fill" className="mr-1" /> Live · {health.latency_ms}ms</>
                : <><XCircle size={13} weight="fill" className="mr-1" /> {health.configured === false ? "Not configured" : "Error"}</>}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">Available balance</p>
            <p className="mt-1 text-xl font-bold tabular-nums">
              {loading ? <Skeleton className="h-7 w-28" />
                : avail ? money(avail.value, avail.currency)
                : health?.ok ? "—" : "unreachable"}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">Environment</p>
            <p className="mt-1 text-xl font-semibold capitalize">
              {loading ? <Skeleton className="h-7 w-20" /> : providers[0]?.environment ?? "sandbox"}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">Last success</p>
            <p className="mt-1 text-sm font-medium">
              {loading ? <Skeleton className="h-5 w-24" /> : dateTime(providers[0]?.last_success_at ?? health?.ok ? undefined : null)}
            </p>
            {providers[0]?.last_error && (
              <p className="mt-1 truncate text-xs text-red-500" title={providers[0].last_error}>
                {providers[0].last_error}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* provider table */}
      <Card>
        <CardHeader><CardTitle className="text-base">All providers</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground border-b text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Environment</th>
                <th className="px-4 py-3">API</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Primary</th>
                <th className="px-4 py-3">Last error</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-3"><Skeleton className="h-4 w-48" /></td></tr>
              ) : providers.length === 0 ? (
                <tr><td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                  No providers configured
                </td></tr>
              ) : providers.map((p) => (
                <tr key={p.code} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 capitalize">{p.environment}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.api_version}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">{p.is_primary ? "Yes" : "—"}</td>
                  <td className="text-muted-foreground max-w-48 truncate px-4 py-3 text-xs">
                    {p.last_error || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
