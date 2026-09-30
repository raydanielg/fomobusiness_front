"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { AppleLogo, GooglePlayLogo, DeviceMobile, ArrowRight } from "@phosphor-icons/react"
import { useAuth, destinationFor } from "@/lib/auth"
import { FullPageLoader } from "@/components/guards"

const PERKS = [
  "Manage your account and business",
  "Track sales, stock and invoices",
  "Get real-time notifications",
  "Use Fomo wherever you are",
]

export default function MobileAppPage() {
  const { state } = useAuth()
  const router = useRouter()

  // admins landing here keep admin access — nudge them back
  useEffect(() => {
    if (!state.loading && state.authenticated && state.isPlatformAdmin) {
      // allow viewing, but show a hint
    }
    if (!state.loading && state.authenticated && state.status === "SUSPENDED") {
      router.replace("/suspended")
    }
  }, [state, router])

  if (state.loading) return <FullPageLoader label="Welcome to Fomo" />

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <nav className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image src="/fomo_icon.png" alt="Fomo" width={28} height={28} />
            Fomo
          </Link>
          {state.authenticated && state.isPlatformAdmin && (
            <Button size="sm" variant="outline" className="ml-auto"
              render={<Link href="/admin/dashboard" />}>
              Admin console <ArrowRight size={14} />
            </Button>
          )}
        </nav>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <Badge variant="secondary" className="gap-1.5">
            <DeviceMobile size={14} /> Fomo is better on mobile
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Fomo workspace lives in the app
          </h1>
          <p className="text-muted-foreground text-lg">
            {state.authenticated
              ? "Signed in — your business experience is on the Fomo mobile app."
              : "The full business experience is available through our mobile application."}
          </p>
          <ul className="space-y-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm">
                <span className="size-1.5 rounded-full bg-lime-500" />
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" variant="outline" className="gap-2">
              <GooglePlayLogo size={20} weight="fill" />
              Download on Android
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <AppleLogo size={20} weight="fill" />
              Download on iOS
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Or open the app directly if it&apos;s already installed.
          </p>
        </div>

        <PhoneMockup />
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto max-w-6xl px-4 py-6 text-center text-sm">
          Need help? <Link href="/contact" className="underline">Contact support</Link>
        </div>
      </footer>
    </div>
  )
}

function PhoneMockup() {
  return (
    <div className="mx-auto w-64">
      <div className="overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/10 bg-card shadow-2xl">
        <Image
          src="/screens/home.png"
          alt="Fomo mobile app dashboard — real screenshot"
          width={603}
          height={1311}
          className="h-auto w-full"
          priority
        />
      </div>
      <Card className="mt-6 text-center">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-xs font-medium">Scan to download</p>
          <div className="bg-muted mx-auto mt-2 flex size-28 items-center justify-center rounded-lg">
            <span className="text-muted-foreground text-xs">QR</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
