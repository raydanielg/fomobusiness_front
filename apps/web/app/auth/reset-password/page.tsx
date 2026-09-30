"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { api, ApiError } from "@/lib/api"

function ResetForm() {
  const router = useRouter()
  const token = useSearchParams().get("token") ?? ""
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      await api.resetPassword(token, password)
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Password updated</CardTitle>
          <CardDescription>You can sign in with your new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => router.push("/auth/login")}>
            Sign in
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center">
          <Image src="/fomo_icon.png" alt="Fomo" width={64} height={64} />
        </div>
        <CardTitle className="text-xl">New password</CardTitle>
        <CardDescription>Choose a strong password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="pw">New password</FieldLabel>
              <Input id="pw" type="password" required minLength={8}
                autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="pw2">Confirm</FieldLabel>
              <Input id="pw2" type="password" required minLength={8}
                autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </Field>
            {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
            <Field>
              <Button type="submit" disabled={loading || !token}>
                {loading ? "Updating…" : "Update password"}
              </Button>
            </Field>
            {!token && (
              <p className="text-destructive text-xs">Missing reset token in the link.</p>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </div>
  )
}
