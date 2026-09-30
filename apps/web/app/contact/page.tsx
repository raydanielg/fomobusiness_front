"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <nav className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image src="/fomo_icon.png" alt="Fomo" width={28} height={28} />
            Fomo
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-lg px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Contact us</CardTitle>
            <p className="text-muted-foreground text-sm">
              We usually reply within a business day.
            </p>
          </CardHeader>
          <CardContent>
            {sent ? (
              <p className="text-sm text-emerald-600">Thanks — we&apos;ll be in touch.</p>
            ) : (
              <form className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
                <div className="space-y-1.5">
                  <Label htmlFor="n">Name</Label>
                  <Input id="n" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="e">Email</Label>
                  <Input id="e" type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="m">Message</Label>
                  <Textarea id="m" rows={5} required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">Send</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
