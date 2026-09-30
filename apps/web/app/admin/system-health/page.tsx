"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ArrowClockwise } from "@phosphor-icons/react"
import { admin, ApiError, SystemHealth } from "@/lib/api"
import { StatusBadge } from "@/components/status-badge"
import { dateTime } from "@/lib/format"

const ORDER = ["api", "database", "redis", "celery", "snippe", "webhooks"]

export default function SystemHealthPage() {
  const [data, setData] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setData(await admin.systemHealth())
      setError("")
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Health check failed.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground text-sm">
            {data ? `Checked ${dateTime(data.checked_at)}` : "Checking services…"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <ArrowClockwise size={14} className={loading ? "animate-spin" : ""} />
          Recheck
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/40">
          <CardContent className="p-4 text-sm text-red-500">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))
          : ORDER.map((key) => {
              const s = data?.services[key]
              if (!s) return null
              return (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base capitalize">
                      {key.replace(/_/g, " ")}
                      <StatusBadge status={s.status} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    {s.workers != null && <p>{s.workers} worker{s.workers === 1 ? "" : "s"}</p>}
                    {s.error && <p className="text-red-500 text-xs">{s.error}</p>}
                    {!s.error && s.status === "operational" && <p>All checks passing.</p>}
                  </CardContent>
                </Card>
              )
            })}
      </div>
    </div>
  )
}
