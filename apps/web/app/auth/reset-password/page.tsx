"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { LockKey } from "@phosphor-icons/react"
import { api, ApiError } from "@/lib/api"
import { IconInput } from "@/components/icon-input"
import { Suspense } from "react"

function ResetForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get("token") ?? ""
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (!token) {
      setError("Invalid or missing reset token.")
      return
    }
    setLoading(true)
    try {
      await api.resetPassword(token, password)
      router.push("/auth/login")
    } catch (e2) {
      setError(e2 instanceof ApiError ? e2.message : "Reset failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </p>
        )}
        <Field>
          <FieldLabel>New password</FieldLabel>
          <IconInput icon={<LockKey />} type="password"
            placeholder="Min. 8 characters" autoComplete="new-password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel>Confirm new password</FieldLabel>
          <IconInput icon={<LockKey />} type="password"
            placeholder="Repeat password" autoComplete="new-password" required
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <Field>
          <Button type="submit" size="lg" className="h-12 text-base" disabled={loading}>
            {loading ? "Resetting…" : "Reset password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-bold">
              <Image src="/fomo_icon.png" alt="Fomo" width={32} height={32} />
              Fomo
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Choose a new password</h1>
            <p className="text-muted-foreground text-sm">
              Enter and confirm your new password.
            </p>
          </div>
          <Suspense fallback={null}>
            <ResetForm />
          </Suspense>
          <p className="text-muted-foreground text-center text-sm">
            <Link href="/auth/login" className="font-medium underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
