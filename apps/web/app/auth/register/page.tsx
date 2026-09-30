"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  User, Envelope, Phone, LockKey,
} from "@phosphor-icons/react"
import { api, ApiError } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { IconInput } from "@/components/icon-input"

export default function RegisterPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    password: "", password_confirm: "",
  })
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (form.password !== form.password_confirm) {
      setError("Passwords do not match.")
      return
    }
    if (!terms) {
      setError("Please accept the terms to continue.")
      return
    }
    setLoading(true)
    try {
      await api.register(form)
      const res = await api.login(form.email, form.password)
      signIn(res)
      router.push(res.is_platform_admin ? "/admin/dashboard" : "/mobile-app")
    } catch (e2) {
      setError(e2 instanceof ApiError ? e2.message : "Registration failed.")
      setLoading(false)
    }
  }

  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-bold">
              <Image src="/fomo_icon.png" alt="Fomo" width={32} height={32} />
              Fomo
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-muted-foreground text-sm">
              Start simplifying your business today.
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>First name</FieldLabel>
                  <IconInput icon={<User />} placeholder="John" autoComplete="given-name"
                    required value={form.first_name} onChange={set("first_name")} />
                </Field>
                <Field>
                  <FieldLabel>Last name</FieldLabel>
                  <IconInput icon={<User />} placeholder="Doe" autoComplete="family-name"
                    required value={form.last_name} onChange={set("last_name")} />
                </Field>
              </div>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <IconInput icon={<Envelope />} type="email" placeholder="you@example.com"
                  autoComplete="email" required
                  value={form.email} onChange={set("email")} />
              </Field>
              <Field>
                <FieldLabel>Phone <span className="text-muted-foreground">(optional)</span></FieldLabel>
                <IconInput icon={<Phone />} type="tel" placeholder="+255…"
                  autoComplete="tel" value={form.phone} onChange={set("phone")} />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <IconInput icon={<LockKey />} type="password" placeholder="Min. 8 characters"
                  autoComplete="new-password" required
                  value={form.password} onChange={set("password")} />
              </Field>
              <Field>
                <FieldLabel>Confirm password</FieldLabel>
                <IconInput icon={<LockKey />} type="password" placeholder="Repeat password"
                  autoComplete="new-password" required
                  value={form.password_confirm} onChange={set("password_confirm")} />
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="terms" checked={terms}
                  onCheckedChange={(v) => setTerms(!!v)} />
                <FieldLabel htmlFor="terms" className="text-sm font-normal">
                  I agree to the{" "}
                  <Link href="/terms" className="underline">Terms</Link> and{" "}
                  <Link href="/privacy" className="underline">Privacy Policy</Link>
                </FieldLabel>
              </Field>
              <Field>
                <Button type="submit" size="lg" className="h-12 text-base" disabled={loading}>
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
