"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { cn } from "cn"
import { Button } from "@workspace/ui/components/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { api, setTokens, ApiError } from "@/lib/api"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError("")
    try {
      const res = await api.login(email.trim(), password)
      if (!res.user?.is_staff && !res.user?.is_superuser) {
        setError("This account does not have admin access.")
        return
      }
      setTokens(res.access, res.refresh)
      router.push("/billing")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign in failed — check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-lime-400/90 shadow-sm">
            <Image src="/fomo_icon.png" alt="Fomo" width={44} height={44} />
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your Fomo account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@fomo.app"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              {error && (
                <p className="text-destructive text-sm" role="alert">{error}</p>
              )}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs">
        Fomo — Your Business, Simplified.
      </FieldDescription>
    </div>
  )
}
