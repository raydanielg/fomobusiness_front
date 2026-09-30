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
    request<AuthResponse>(
      "/auth/login/",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  me: () => request<Omit<AuthResponse, "access" | "refresh">>("/auth/me/"),

  register: (data: RegisterPayload) =>
    request<{ user: AuthUser }>(
      "/auth/register/",
      { method: "POST", body: JSON.stringify(data) }
    ),

  forgotPassword: (email: string) =>
    request<{ detail: string }>(
      "/auth/password-reset/",
      { method: "POST", body: JSON.stringify({ email }) }
    ),

  resetPassword: (token: string, password: string) =>
    request<{ detail: string }>(
      "/auth/password-reset/confirm/",
      { method: "POST", body: JSON.stringify({ token, new_password: password, new_password_confirm: password }) }
    ),

  verifyEmail: (token: string) =>
    request<{ detail: string }>(
      "/auth/verify-email/",
      { method: "POST", body: JSON.stringify({ token }) }
    ),

  logout: () =>
    request("/auth/logout/", { method: "POST" }).catch(() => {}),
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

/** Platform admin — whole-platform command endpoints. */
export const admin = {
  dashboard: () => api.get<PlatformDashboard>("/platform/dashboard/"),
  growth: (months = 12) =>
    api.get<GrowthSeries>(`/platform/growth/?months=${months}`),
  businesses: (q = "") =>
    api.get<Paged<AdminBusiness>>(`/platform/businesses/${q}`),
  business: (id: string) =>
    api.get<AdminBusinessDetail>(`/platform/businesses/${id}/`),
  users: (q = "") => api.get<Paged<AdminUser>>(`/platform/users/${q}`),
  auditLogs: (q = "") =>
    api.get<Paged<AuditEntry>>(`/platform/audit-logs/${q}`),
  notifications: (q = "") =>
    api.get<Paged<AdminNotification>>(`/platform/notifications/${q}`),
  systemHealth: () => api.get<SystemHealth>("/platform/system-health/"),
  activity: (limit = 40) =>
    api.get<{ items: ActivityItem[] }>(`/platform/activity/?limit=${limit}`),
  plans: () => api.get<AdminPlan[]>("/platform/plans/"),
}

export interface PlatformDashboard {
  businesses: { total: number; active: number; suspended: number; new_30d: number; trend: Point[] }
  users: { total: number; active: number; new_30d: number; staff: number; dau: number; mau: number; trend: Point[] }
  subscriptions: {
    active: number; trialing: number; expired: number; cancelled: number
    past_due: number; expiring_7d: number
    by_plan: { plan__code: string; plan__name: string; n: number }[]
  }
  revenue: {
    total: number; last_30d: number
    payments: { total: number; completed: number; failed: number; pending: number }
    trend: Point[]
  }
  sales: { total: number; today: number; volume: number; trend: Point[] }
  notifications: { total: number; unread: number; today: number }
  webhooks: { failed: number; total: number }
  alerts: { severity: string; title: string; href: string }[]
  generated_at: string
}

export interface Point { date: string; value: number }

export interface GrowthSeries {
  businesses: { month: string; value: number }[]
  users: { month: string; value: number }[]
  sales: { month: string; value: number }[]
}

export interface AdminBusiness {
  id: string
  name: string
  slug: string
  business_type: string
  status: string
  phone: string
  email: string
  city: string
  region: string
  country: string
  currency: string
  logo: string | null
  owner_email: string
  owner_name: string
  member_count: number
  branch_count: number
  plan_code: string | null
  subscription_status: string | null
  created_at: string
  updated_at: string
}

export interface AdminBusinessDetail extends AdminBusiness {
  members: { id: string; user: string; email: string; role: string; status: string }[]
  stats: { customers: number; products: number; suppliers: number; sales: number }
}

export interface AdminUser {
  id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  full_name: string
  avatar: string | null
  is_active: boolean
  is_verified: boolean
  is_staff: boolean
  is_superuser: boolean
  date_joined: string
  last_login: string | null
  businesses: { id: string; name: string; status: string }[]
  roles: string[]
}

export interface AuditEntry {
  id: string
  action: string
  resource_type: string
  resource_id: string
  actor_email: string | null
  actor_name: string | null
  business_name: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string
  request_id: string
  created_at: string
}

export interface AdminNotification {
  id: string
  user_email: string
  business_name: string
  type: string
  title: string
  message: string
  read_at: string | null
  created_at: string
}

export interface SystemHealth {
  checked_at: string
  services: Record<string, { status: string; error?: string; workers?: number; balance?: unknown }>
}

export interface ActivityItem {
  id: string
  action: string
  actor: string | null
  business: string | null
  resource: string
  time: string
}

export interface AdminPlan {
  id: string
  code: string
  name: string
  price_monthly: number
  price_yearly: number
  currency: string
  interval: string
  is_active: boolean
  is_public: boolean
  active_subscriptions: number
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
  customer_email: string
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
  customer_name: string
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
  is_primary: boolean
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

// ── auth ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  full_name?: string
  avatar?: string | null
  is_verified?: boolean
}

export interface AuthResponse {
  access: string
  refresh: string
  user: AuthUser
  role: string            // SUPER_ADMIN | ADMIN | OWNER | MANAGER | ... | CUSTOMER
  status: string          // ACTIVE | SUSPENDED
  permissions: string[]
  is_platform_admin: boolean
  requires_email_verification: boolean
  requires_mfa: boolean
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  phone?: string
  password: string
  password_confirm: string
}
