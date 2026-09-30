"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Envelope } from "@phosphor-icons/react"
import { api, ApiError } from "@/lib/api"
import { IconInput } from "@/components/icon-input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.forgotPassword(email)
      setSent(true)
    } catch (e2) {
      setError(e2 instanceof ApiError ? e2.message : "Request failed.")
    } finally {
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
            <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
            <p className="text-muted-foreground text-sm">
              We&apos;ll send a reset link to your email.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-600">
                Check your inbox — a reset link is on its way to{" "}
                <strong>{email}</strong>.
              </p>
              <Button variant="outline" className="w-full" size="lg"
                nativeButton={false} render={<Link href="/auth/login" />}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <FieldGroup>
                {error && (
                  <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">
                    {error}
                  </p>
                )}
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <IconInput icon={<Envelope />} type="email"
                    placeholder="you@example.com" autoComplete="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field>
                  <Button type="submit" size="lg" className="h-12 text-base" disabled={loading}>
                    {loading ? "Sending…" : "Send reset link"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          <p className="text-muted-foreground text-center text-sm">
            Remember your password?{" "}
            <Link href="/auth/login" className="font-medium underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
