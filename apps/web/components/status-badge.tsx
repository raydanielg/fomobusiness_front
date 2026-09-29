import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

/** Normalized status → color. Both themes readable; label carries meaning
 * (never color-only). */
const TONE: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  paid: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  matched: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  verified: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  processed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  trialing: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  received: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  open: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  manual_review: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  past_due: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  failed: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  overdue: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  invalid: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  mismatch: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  reversed: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  expired: "bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
  voided: "bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
  cancelled: "bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
  disabled: "bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
  refunded: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  duplicate: "bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
  replay_rejected: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  missing_provider: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  missing_internal: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", TONE[status] ?? "border-border", className)}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  )
}
