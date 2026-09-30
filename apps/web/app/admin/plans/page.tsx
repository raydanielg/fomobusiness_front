"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Check } from "@phosphor-icons/react"
import { admin, AdminPlan, ApiError } from "@/lib/api"
import { money } from "@/lib/format"

export default function PlansPage() {
  const [plans, setPlans] = useState<AdminPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setPlans(await admin.plans())
      setError("")
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load plans.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
          <p className="text-muted-foreground text-sm">
            Subscription tiers — entitlements are data-driven, not hardcoded.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/40">
          <CardContent className="p-4 text-sm text-red-500">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52" />)
          : plans.map((p) => (
              <Card key={p.id} className={p.is_public ? "" : "opacity-70"}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-muted-foreground text-xs">{p.code}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {!p.is_active && <Badge variant="secondary">inactive</Badge>}
                      {!p.is_public && <Badge variant="outline">hidden</Badge>}
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold tabular-nums">
                      {money(p.price_monthly, p.currency)}
                      <span className="text-muted-foreground text-sm font-normal">/mo</span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {money(p.price_yearly, p.currency)}/yr · {p.interval}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-emerald-500" />
                    {p.active_subscriptions} active subscription{p.active_subscriptions === 1 ? "" : "s"}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}
