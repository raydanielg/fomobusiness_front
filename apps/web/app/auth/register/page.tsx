"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { api, ApiError } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    password: "", password_confirm: "",
  })
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError("")
    if (!terms) {
      setError("Please accept the Terms of Service.")
      return
    }
    setLoading(true)
    try {
      await api.register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        password_confirm: form.password_confirm,
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to <strong>{form.email}</strong>.
              Verify it, then sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/auth/login")} className="w-full">
              Go to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center">
              <Image src="/fomo_icon.png" alt="Fomo" width={64} height={64} />
            </div>
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>Fomo — Your Business, Simplified.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="fn">First name</FieldLabel>
                    <Input id="fn" required value={form.first_name} onChange={set("first_name")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="ln">Last name</FieldLabel>
                    <Input id="ln" required value={form.last_name} onChange={set("last_name")} />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="em">Email</FieldLabel>
                  <Input id="em" type="email" required autoComplete="email"
                    value={form.email} onChange={set("email")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="ph">Phone <span className="text-muted-foreground">(optional)</span></FieldLabel>
                  <Input id="ph" type="tel" autoComplete="tel"
                    value={form.phone} onChange={set("phone")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="pw">Password</FieldLabel>
                  <Input id="pw" type="password" required minLength={8}
                    autoComplete="new-password"
                    value={form.password} onChange={set("password")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="pw2">Confirm password</FieldLabel>
                  <Input id="pw2" type="password" required minLength={8}
                    autoComplete="new-password"
                    value={form.password_confirm} onChange={set("password_confirm")} />
                </Field>
                <Field>
                  <label className="flex items-start gap-2 text-sm">
                    <Checkbox
                      checked={terms}
                      onCheckedChange={(v) => setTerms(v === true)}
                      className="mt-0.5"
                    />
                    <span>
                      I agree to the <Link href="/terms" className="underline">Terms of Service</Link>{" "}
                      and <Link href="/privacy" className="underline">Privacy Policy</Link>
                    </span>
                  </label>
                </Field>
                {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
