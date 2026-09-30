"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { api, ApiError } from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError("")
    try {
      await api.forgotPassword(email.trim())
      setSent(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Request failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center">
              <Image src="/fomo_icon.png" alt="Fomo" width={64} height={64} />
            </div>
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              {sent
                ? "If that email exists, a reset link is on its way."
                : "Enter your email and we'll send a reset link."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <Button className="w-full" onClick={() => history.back()}>
                Back to sign in
              </Button>
            ) : (
              <form onSubmit={submit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" required autoComplete="email"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Field>
                  {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
                  <Field>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Sending…" : "Send reset link"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Remembered it? <Link href="/auth/login" className="underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
