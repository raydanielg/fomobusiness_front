"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ArrowLeft, CheckCircle, Clock, XCircle } from "@phosphor-icons/react"
import { billing, Payment, PaymentEvent, ApiError } from "@/lib/api"
import { StatusBadge } from "@/components/status-badge"
import { money, dateTime } from "@/lib/format"
import Link from "next/link"

const STAGE_ORDER = [
  "payment.created", "payment.initiated", "payment.pending",
  "payment.completed", "payment.failed", "payment.expired",
  "payment.voided", "refund.initiated", "refund.completed",
]

function eventIcon(type: string) {
  if (type.includes("completed")) return <CheckCircle size={16} weight="fill" className="text-emerald-500" />
  if (type.includes("failed") || type.includes("voided")) return <XCircle size={16} weight="fill" className="text-red-500" />
  return <Clock size={16} className="text-amber-500" />
}

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [timeline, setTimeline] = useState<PaymentEvent[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    billing.payment(id)
      .then((d) => { setPayment(d.payment); setTimeline(d.timeline) })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed."))
  }, [id])

  if (error) {
    return <p className="p-6 text-sm text-red-500">{error}</p>
  }
  if (!payment) {
    return <div className="space-y-4 p-6"><Skeleton className="h-24" /><Skeleton className="h-48" /></div>
  }

  const rows: [string, string][] = [
    ["Business", payment.business_name || "—"],
    ["Customer", payment.customer_name || "—"],
    ["Phone", payment.customer_phone || "—"],
    ["Email", payment.customer_email || "—"],
    ["Provider", payment.provider],
    ["Channel", `${payment.channel}${payment.channel_detail ? ` · ${payment.channel_detail}` : ""}`],
    ["External reference", payment.external_reference || "—"],
    ["Created", dateTime(payment.created_at)],
    ["Completed", dateTime(payment.completed_at)],
    ["Failure reason", payment.status_reason || "—"],
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/payments" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-mono text-xl font-bold tracking-tight">{payment.reference}</h1>
          <p className="text-muted-foreground text-sm">Provider payment</p>
        </div>
        <div className="ml-auto"><StatusBadge status={payment.status} /></div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Amount</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{money(payment.amount, payment.currency)}</p>
            <div className="text-muted-foreground mt-3 space-y-1 text-xs">
              <div className="flex justify-between"><span>Fee</span><span>{money(payment.fee, payment.currency)}</span></div>
              <div className="flex justify-between"><span>Net</span><span>{money(payment.net_amount, payment.currency)}</span></div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0">
            <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border/50 py-1.5 text-sm last:border-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium break-all">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <p className="text-muted-foreground text-sm">No events recorded yet.</p>
          ) : (
            <ol className="relative space-y-6 border-l border-border pl-6">
              {[...timeline]
                .sort((a, b) => {
                  const ai = STAGE_ORDER.indexOf(a.event_type)
                  const bi = STAGE_ORDER.indexOf(b.event_type)
                  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
                })
                .map((e) => (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[31px] flex size-5 items-center justify-center rounded-full bg-card ring-1 ring-border">
                      {eventIcon(e.event_type)}
                    </span>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-mono text-sm font-medium">{e.event_type}</p>
                      <p className="text-muted-foreground text-xs">
                        {dateTime(e.created_at)} · via {e.source}
                      </p>
                    </div>
                    {e.detail && (
                      <p className="text-muted-foreground text-xs">{e.detail}</p>
                    )}
                  </li>
                ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
