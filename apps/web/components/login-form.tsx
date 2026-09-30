"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { cn } from "cn"
import { Button } from "@workspace/ui/components/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { api, ApiError } from "@/lib/api"
import { useAuth, destinationFor } from "@/lib/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState<"form" | "welcome">("form")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError("")
    try {
      const res = await api.login(email.trim(), password)
      signIn(res)
      setPhase("welcome")
      // brief branded transition, then the backend-decided destination
      setTimeout(() => {
        router.replace(destinationFor({
          status: res.status,
          isPlatformAdmin: res.is_platform_admin,
        }))
      }, 600)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign in failed.")
      setLoading(false)
    }
  }

  if (phase === "welcome") {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="size-9 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
        <p className="font-medium">Welcome to Fomo</p>
        <p className="text-muted-foreground text-sm">Taking you to the right place…</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center">
            <Image src="/fomo_icon.png" alt="Fomo" width={64} height={64} />
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Fomo account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email" type="email" placeholder="you@example.com"
                  autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link href="/auth/forgot-password"
                    className="ms-auto text-sm underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password" type="password" autoComplete="current-password"
                  required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                  />
                  Remember me
                </label>
              </Field>
              {error && (
                <p className="text-destructive text-sm" role="alert">{error}</p>
              )}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="underline underline-offset-4">
          Create account
        </Link>
      </p>
    </div>
  )
}
