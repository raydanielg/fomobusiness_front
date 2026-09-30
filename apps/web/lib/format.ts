/** Consistent TZS/date formatting — single source for every money display. */

export function money(value: string | number | null | undefined, currency = "TZS"): string {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0
  if (!Number.isFinite(n)) return `${currency} 0`
  const formatted = n === Math.round(n)
    ? n.toLocaleString("en-TZ")
    : n.toLocaleString("en-TZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${currency} ${formatted}`
}

export function moneyCompact(value: string | number, currency = "TZS"): string {
  const n = typeof value === "string" ? parseFloat(value) : value
  if (!Number.isFinite(n)) return `${currency} 0`
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${currency} ${(n / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${currency} ${(n / 1_000).toFixed(1)}K`
  return money(n, currency)
}

export function date(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function dateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "never"
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

/** Compact non-money counts — 1,234 → "1.2K". */
export function numCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString()
}
