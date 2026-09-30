"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ArrowClockwise } from "@phosphor-icons/react"
import { admin, ActivityItem, ApiError } from "@/lib/api"
import { timeAgo } from "@/lib/format"

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true)
    try {
      const res = await admin.activity(50)
      setItems(res.items)
      setError("")
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load activity.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(true)
    if (autoRefresh) {
      timer.current = setInterval(() => void load(false), 15_000)
      return () => { if (timer.current) clearInterval(timer.current) }
    }
    return undefined
  }, [load, autoRefresh])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Activity</h1>
          <p className="text-muted-foreground text-sm">
            Latest platform events — refreshes every 15s.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"
            onClick={() => setAutoRefresh((v) => !v)}>
            {autoRefresh ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => void load(true)} disabled={loading}>
            <ArrowClockwise size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-500/40">
          <CardContent className="p-4 text-sm text-red-500">{error}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Event stream</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && items.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activity yet.</p>
          ) : (
            <ul className="divide-y">
              {items.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.action}</code>
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {a.actor ?? "system"}
                      {a.business ? ` · ${a.business}` : ""}
                      {a.resource ? ` · ${a.resource}` : ""}
                    </p>
                  </div>
                  <span className="text-muted-foreground whitespace-nowrap text-xs">
                    {timeAgo(a.time)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
