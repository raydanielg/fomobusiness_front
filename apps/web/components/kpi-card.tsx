import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDown, ArrowUp, Minus } from "@phosphor-icons/react"

interface Props {
  label: string
  value: string
  sub?: string
  delta?: number | null // percentage vs previous period; null = no baseline
  accent?: "default" | "success" | "warning" | "danger"
}

const ACCENTS = {
  default: "",
  success: "border-emerald-500/40",
  warning: "border-amber-500/40",
  danger: "border-red-500/40",
}

export function KpiCard({ label, value, sub, delta, accent = "default" }: Props) {
  return (
    <Card className={cn("relative overflow-hidden", ACCENTS[accent])}>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
        <div className="mt-1 flex items-center gap-1.5">
          {delta != null && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                delta > 0 && "text-emerald-500",
                delta < 0 && "text-red-500",
                delta === 0 && "text-muted-foreground"
              )}
            >
              {delta > 0 ? <ArrowUp size={12} weight="bold" /> : delta < 0 ? <ArrowDown size={12} weight="bold" /> : <Minus size={12} />}
              {Math.abs(delta)}%
            </span>
          )}
          {sub && <span className="text-muted-foreground text-xs">{sub}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
