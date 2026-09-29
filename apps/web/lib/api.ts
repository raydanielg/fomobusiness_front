"use client"

/**
 * Fomo admin API client — talks to the Django backend only.
 * Provider calls (Snippe) never happen in the browser.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://fomoapi.158-220-114-187.sslip.io/api/v1"

export class ApiError extends Error {
  code: string
  status: number
  details: Record<string, unknown>

  constructor(message: string, code = "ERROR", status = 0, details = {}) {
    super(message)
    this.code = code
    this.status = status
    this.details = details
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("fomo_access")
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem("fomo_access", access)
  if (refresh) localStorage.setItem("fomo_refresh", refresh)
}

export function clearTokens() {
  localStorage.removeItem("fomo_access")
  localStorage.removeItem("fomo_refresh")
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok || body.success === false) {
    const err = body.error ?? {}
    throw new ApiError(
      err.message ?? `Request failed (${res.status})`,
      err.code ?? "ERROR",
      res.status,
      err.details ?? {}
    )
  }
  return (body.data ?? body) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(data ?? {}) }),

  login: (email: string, password: string) =>
    request<{ access: string; refresh: string; user: { email: string; is_staff: boolean } }>(
      "/auth/login/",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),
}

/** Billing console endpoints (admin scope). */
export const billing = {
  overview: () => api.get<BillingOverview>("/billing/admin/overview/"),
  payments: (q = "") => api.get<Paged<Payment>>(`/billing/admin/payments/${q}`),
  payment: (id: string) =>
    api.get<{ payment: Payment; timeline: PaymentEvent[] }>(
      `/billing/admin/payments/${id}/`
    ),
  sessions: (q = "") =>
    api.get<Paged<CheckoutSession>>(`/billing/admin/checkout-sessions/${q}`),
  links: (q = "") =>
    api.get<Paged<PaymentLink>>(`/billing/admin/payment-links/${q}`),
  payouts: (q = "") => api.get<Paged<Payout>>(`/billing/admin/payouts/${q}`),
  refunds: (q = "") => api.get<Paged<Refund>>(`/billing/admin/refunds/${q}`),
  events: (q = "") =>
    api.get<Paged<PaymentEvent>>(`/billing/admin/payment-events/${q}`),
  webhooks: (q = "") =>
    api.get<Paged<WebhookEvent>>(`/billing/admin/webhooks/${q}`),
  reconciliation: (q = "") =>
    api.get<Paged<Recon>>(`/billing/admin/reconciliation/${q}`),
  providers: () =>
    api.get<{ configured: boolean; results: Provider[] }>(
      "/billing/admin/payment-providers/"
    ),
  snippeHealth: () =>
    api.get<ProviderHealth>("/billing/admin/payment-providers/snippe/health/"),
  snippeBalance: () =>
    api.get<Record<string, unknown>>("/billing/admin/payment-providers/snippe/balance/"),
}

// ── normalized types (match backend serializers) ─────────────────────────

export interface Paged<T> {
  count: number
  page: number
  page_size: number
  results: T[]
}

export interface BillingOverview {
  date: string
  kpis: {
    total_revenue: number
    mrr: number
    today_collections: number
    month_change_pct: number | null
    successful: number
    pending: number
    failed: number
    expired: number
    voided: number
    refunds: number
    outstanding_invoices: number
  }
  sparkline: { date: string; total: number }[]
  last_event_at: string | null
  last_webhook_at: string | null
}

export interface Payment {
  id: string
  reference: string
  external_reference: string
  business_name: string
  provider: string
  channel: string
  channel_detail: string
  customer_name: string
  customer_phone: string
  amount: string
  fee: string
  net_amount: string
  currency: string
  status: string
  status_reason: string
  created_at: string
  completed_at: string | null
}

export interface PaymentEvent {
  id: string
  event_type: string
  payment_reference: string
  business_name: string
  amount: string | null
  currency: string
  status: string
  source: string
  detail: string
  created_at: string
}

export interface CheckoutSession {
  id: string
  session_reference: string
  business_name: string
  provider: string
  checkout_url: string
  amount: string
  currency: string
  status: string
  created_at: string
  expires_at: string | null
  completed_at: string | null
}

export interface PaymentLink {
  id: string
  reference: string
  url: string
  description: string
  business_name: string
  amount: string | null
  currency: string
  custom_amount: boolean
  status: string
  payments_count: number
  total_collected: string
  created_at: string
  expires_at: string | null
}

export interface Payout {
  id: string
  reference: string
  business_name: string
  provider: string
  recipient_name: string
  masked_phone: string
  channel: string
  amount: string
  fee: string
  total: string
  currency: string
  status: string
  created_at: string
  completed_at: string | null
}

export interface Refund {
  id: string
  payment_reference: string
  reference: string
  amount: string
  currency: string
  reason: string
  status: string
  created_at: string
  completed_at: string | null
}

export interface WebhookEvent {
  id: string
  event_id: string
  event_type: string
  provider: string
  signature_status: string
  status: string
  payment_reference: string
  attempts: number
  processing_ms: number
  error: string
  received_at: string
}

export interface Recon {
  id: string
  internal_reference: string
  external_reference: string
  provider: string
  internal_amount: string | null
  external_amount: string | null
  internal_status: string
  external_status: string
  status: string
  checked_at: string
}

export interface Provider {
  code: string
  name: string
  api_version: string
  environment: string
  status: string
  last_success_at: string | null
  last_failure_at: string | null
  last_error: string
}

export interface ProviderHealth {
  ok: boolean
  configured: boolean
  latency_ms?: number
  balance?: unknown
  error?: string
}
