"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { api } from "@/lib/api"

function VerifyInner() {
  const router = useRouter()
  const token = useSearchParams().get("token") ?? ""
  const [state, setState] = useState<"loading" | "ok" | "fail">("loading")

  useEffect(() => {
    if (!token) {
      setState("fail")
      return
    }
    api.verifyEmail(token)
      .then(() => setState("ok"))
      .catch(() => setState("fail"))
  }, [token])

  return (
    <Card className="w-full max-w-sm text-center">
      <CardHeader>
        <div className="mx-auto mb-3 flex size-16 items-center justify-center">
          <Image src="/fomo_icon.png" alt="Fomo" width={64} height={64} />
        </div>
        <CardTitle className="text-xl">
          {state === "loading" ? "Verifying…" :
           state === "ok" ? "Email verified" : "Link expired"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state === "ok" ? (
          <>
            <p className="text-muted-foreground mb-4 text-sm">
              Your email is confirmed. Continue to sign in.
            </p>
            <Button className="w-full" onClick={() => router.push("/auth/login")}>
              Sign in
            </Button>
          </>
        ) : state === "fail" ? (
          <>
            <p className="text-muted-foreground mb-4 text-sm">
              This verification link is invalid or already used.
            </p>
            <Button variant="outline" className="w-full"
              onClick={() => router.push("/auth/login")}>
              Back to sign in
            </Button>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
      <Suspense fallback={null}>
        <VerifyInner />
      </Suspense>
    </div>
  )
}
