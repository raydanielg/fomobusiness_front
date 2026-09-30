"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  ShoppingCart, Package, Users, Wallet, FileText, ChartBar,
  CreditCard, UserGear, GitBranch, DeviceMobile, ShieldCheck,
  ArrowRight, Check, Star,
} from "@phosphor-icons/react/dist/ssr"
import {
  PhoneMockup, HeroScreenshotCycle, ScreenshotGallery,
} from "@/components/phone-mockup"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Fomo",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Android, iOS",
  description:
    "Sales, inventory, customers, expenses, invoices and payments in one platform.",
}

const FEATURES = [
  { icon: ShoppingCart, title: "Sales & POS", desc: "Fast checkout, receipts, refunds — built for real counters." },
  { icon: Package, title: "Inventory", desc: "Live stock levels, low-stock alerts, movement history." },
  { icon: Users, title: "Customers", desc: "Profiles, balances and purchase history in one place." },
  { icon: Wallet, title: "Expenses", desc: "Track every cost, categorized and auditable." },
  { icon: FileText, title: "Invoices", desc: "Issue, track and get paid — status-aware." },
  { icon: CreditCard, title: "Payments", desc: "Mobile-money collections via Snippe." },
  { icon: ChartBar, title: "Reports", desc: "Profit, sales and stock analytics." },
  { icon: UserGear, title: "Staff & Roles", desc: "Branch-level permissions per employee." },
  { icon: GitBranch, title: "Branches", desc: "Multiple shops, one source of truth." },
]

const SHOWCASE = [
  {
    label: "Sales",
    headline: "Sell faster. Keep every transaction organized.",
    desc: "Record a sale, pick a payment method, print a receipt — every transaction tied to a customer and branch.",
    points: ["Receipt-level audit trail", "Cash & mobile money", "Per-branch totals", "Instant refunds"],
    shot: { src: "/screens/sales.png", alt: "Fomo sales history with receipts, totals and payment status" },
  },
  {
    label: "Inventory",
    headline: "Know what you have before you run out.",
    desc: "Live stock levels per branch, low-stock alerts before you sell out, and a full movement history.",
    points: ["Low-stock alerts", "Stock movements", "Barcode-ready catalog", "Branch transfers"],
    shot: { src: "/screens/inventory.png", alt: "Fomo inventory showing stock levels and low-stock badges" },
  },
  {
    label: "Customers",
    headline: "Know your customers. Build better relationships.",
    desc: "Every customer gets a profile — purchase history, outstanding balance, and contact in one place.",
    points: ["Purchase history", "Credit balances", "Contact records", "Top-customer insights"],
    shot: { src: "/screens/customers.png", alt: "Fomo customer list with balances and purchase history" },
  },
  {
    label: "Reports",
    headline: "Turn business activity into useful insight.",
    desc: "Sales, expenses, profit and stock — visualized so you can act on it, not just record it.",
    points: ["Profit & loss", "Sales by period", "Expense categories", "Exportable data"],
    shot: { src: "/screens/reports.png", alt: "Fomo reports showing sales and profit charts" },
  },
]

const GALLERY = [
  { label: "Dashboard", src: "/screens/home.png", alt: "Dashboard — today's sales, expenses and profit" },
  { label: "Sales", src: "/screens/sales.png", alt: "Sales list with receipts and status" },
  { label: "New Sale", src: "/screens/pos.png", alt: "POS checkout with product grid" },
  { label: "Products", src: "/screens/products.png", alt: "Product catalog with stock badges" },
  { label: "Inventory", src: "/screens/inventory.png", alt: "Inventory stock levels and low-stock" },
  { label: "Customers", src: "/screens/customers.png", alt: "Customer list" },
  { label: "Expenses", src: "/screens/expenses.png", alt: "Expense tracking" },
  { label: "Reports", src: "/screens/reports.png", alt: "Reports and analytics" },
]

const FAQS = [
  { q: "Do I need a computer to run Fomo?", a: "No — Fomo is mobile-first. The full business experience lives in the Android and iOS app." },
  { q: "How do payments work?", a: "Customers pay via mobile money through our payment partner. Webhooks confirm status in real time." },
  { q: "Can I manage multiple businesses?", a: "Yes — switch between businesses from one account, each with its own branches, staff and reports." },
  { q: "Is my data secure?", a: "Tenant isolation at the database level, role-based staff access, and payment credentials never leave our servers." },
]

const PLANS = [
  {
    name: "Starter", price: "Free", tag: "Solo founders",
    features: ["1 business · 1 branch", "POS & sales", "Basic reports", "Community support"],
    cta: "Start free", featured: false,
  },
  {
    name: "Growth", price: "TZS 29,000", tag: "Most popular",
    features: ["3 branches", "Staff roles", "Inventory alerts", "Advanced reports", "Priority support"],
    cta: "Get Growth", featured: true,
  },
  {
    name: "Business", price: "TZS 79,000", tag: "Scaling teams",
    features: ["Unlimited branches", "Multi-business", "Payment links", "API access", "Dedicated support"],
    cta: "Get Business", featured: false,
  },
]

export function Landing() {
  return (
    <div className="bg-background min-h-svh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Navbar ── */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image src="/fomo_icon.png" alt="Fomo" width={28} height={28} />
            Fomo
          </Link>
          <div className="text-muted-foreground hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="hover:text-foreground">Product</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#showcase" className="hover:text-foreground">Solutions</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">Help</a>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/auth/login" />}>
              Log in
            </Button>
            <Button size="sm" nativeButton={false} render={<Link href="/auth/register" />}>
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_oklch(0.9_0.12_120_/_0.3),_transparent_60%)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 md:py-28 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge variant="secondary" className="gap-1.5">
              <Star size={12} weight="fill" className="text-lime-500" />
              Built for African business
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your Business,{" "}
              <span className="bg-gradient-to-r from-lime-500 to-emerald-500 bg-clip-text text-transparent">
                Simplified.
              </span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg">
              Sales, products, inventory, customers, expenses, invoices,
              payments, reports, staff and branches — one platform, always in
              your pocket.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" nativeButton={false} render={<Link href="/auth/register" />}>
                Get Started <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<a href="#showcase" />}>
                Explore Fomo
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Free to start · No credit card · Android &amp; iOS
            </p>
          </div>

          {/* hero — real app screenshot cycling */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-lime-400/20 to-emerald-500/10 blur-3xl" />
            <HeroScreenshotCycle
              shots={[
                { src: "/screens/home.png", alt: "Fomo dashboard showing today's sales, expenses and estimated profit", label: "Dashboard" },
                { src: "/screens/sales.png", alt: "Fomo sales screen listing receipts", label: "Sales" },
                { src: "/screens/inventory.png", alt: "Fomo inventory showing stock levels", label: "Inventory" },
                { src: "/screens/reports.png", alt: "Fomo reports with sales charts", label: "Reports" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-muted/30 border-y">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 text-center md:grid-cols-4">
          {[["1k+", "Businesses"], ["TZS 500M+", "Processed"], ["99.9%", "Uptime"], ["24/7", "Support"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-3xl font-bold tracking-tight">{v}</p>
              <p className="text-muted-foreground mt-1 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything your business needs, in one place
          </h2>
          <p className="text-muted-foreground mt-3">
            From the first sale to full-scale operations — one toolkit.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-lime-400/15">
                  <f.icon size={22} className="text-lime-600" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Alternating feature showcase ── */}
      <section id="showcase" className="bg-muted/20 border-y">
        <div className="mx-auto max-w-6xl px-4 py-24">
          {SHOWCASE.map((f, i) => (
            <div
              key={f.label}
              className={`grid items-center gap-12 py-16 lg:grid-cols-2 ${
                i !== 0 ? "border-t" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <Badge variant="secondary" className="mb-4">{f.label}</Badge>
                <h3 className="text-3xl font-bold tracking-tight">{f.headline}</h3>
                <p className="text-muted-foreground mt-3">{f.desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm">
                      <Check size={15} className="shrink-0 text-emerald-500" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-6"
                  render={<Link href="/auth/register" />}>
                  Try it free <ArrowRight size={14} />
                </Button>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <PhoneMockup src={f.shot.src} alt={f.shot.alt} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Screenshot gallery ── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">See Fomo in action</h2>
          <p className="text-muted-foreground mt-2">
            Real screens from the actual app — not mockups.
          </p>
        </div>
        <ScreenshotGallery groups={GALLERY} />
      </section>

      {/* ── Business management ── */}
      <section className="bg-muted/20 border-y">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-4">Business Management</Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Built for the way your business actually works
            </h2>
            <p className="text-muted-foreground mt-3">
              Staff roles, branches, notifications and settings — the operational
              layer most POS apps skip.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                "Role-based staff access",
                "Multi-branch switching",
                "Push notifications",
                "Subscription & billing in-app",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={15} className="shrink-0 text-emerald-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center gap-4">
            <PhoneMockup src="/screens/staff.png" alt="Fomo staff management" className="hidden sm:block" tilt={-3} />
            <PhoneMockup src="/screens/branches.png" alt="Fomo branches" tilt={3} />
          </div>
        </div>
      </section>

      {/* ── Mobile app section ── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-3 gap-1.5">
            <DeviceMobile size={14} /> Mobile-first
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">
            Run your business from anywhere
          </h2>
          <p className="text-muted-foreground mt-2">
            The whole platform, in your pocket.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <PhoneMockup src="/screens/home.png" alt="Fomo dashboard" tilt={-6} className="md:mt-8" />
          <PhoneMockup src="/screens/pos.png" alt="Fomo point of sale" tilt={-2} />
          <PhoneMockup src="/screens/products.png" alt="Fomo product catalog" tilt={2} />
          <PhoneMockup src="/screens/reports.png" alt="Fomo reports" tilt={6} className="md:mt-8" />
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/mobile-app" />}>
            Download on Android
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/mobile-app" />}>
            Download on iOS
          </Button>
        </div>
      </section>

      {/* ── Security ── */}
      <section className="bg-muted/20 border-y">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-3">
          <div>
            <ShieldCheck size={40} className="text-lime-500" />
            <h2 className="mt-4 text-2xl font-bold">Enterprise-grade security</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Tenant isolation, signed webhooks, audit trails.
            </p>
          </div>
          <ul className="space-y-3 text-sm lg:col-span-2">
            {[
              "End-to-end TLS on every request",
              "Role-based access — staff only see what you allow",
              "Payment credentials never leave our servers",
              "Full audit trail for every sensitive action",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check size={16} className="shrink-0 text-emerald-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Simple pricing</h2>
          <p className="text-muted-foreground mt-2">
            Start free. Upgrade when you grow.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <Card key={p.name}
              className={p.featured ? "border-lime-400 ring-1 ring-lime-400/50" : ""}>
              <CardContent className="space-y-5 p-6">
                <div>
                  <Badge variant={p.featured ? "default" : "secondary"}>{p.tag}</Badge>
                  <h3 className="mt-3 text-xl font-semibold">{p.name}</h3>
                  <p className="mt-1 text-3xl font-bold tracking-tight">
                    {p.price}
                    {p.price !== "Free" && (
                      <span className="text-muted-foreground text-sm font-normal">/mo</span>
                    )}
                  </p>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check size={15} className="shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={p.featured ? "default" : "outline"}
                  render={<Link href="/auth/register" />}>
                  {p.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
          Questions, answered
        </h2>
        <Accordion>
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t bg-gradient-to-br from-lime-400/10 to-emerald-500/10">
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-24 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Start simplifying your business today.
          </h2>
          <p className="text-muted-foreground text-lg">
            Free to start. Set up in minutes. Runs on the phone you already have.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/auth/register" />}>
              Get Started <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/auth/login" />}>
              Log in
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 md:grid-cols-5">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold">
              <Image src="/fomo_icon.png" alt="Fomo" width={26} height={26} />
              Fomo
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              Your Business, Simplified.
            </p>
          </div>
          <FooterCol title="Product" links={[
            ["Features", "#features"], ["Pricing", "#pricing"],
            ["Mobile app", "/mobile-app"], ["Reports", "#showcase"],
          ]} />
          <FooterCol title="Company" links={[
            ["About", "/contact"], ["Contact", "/contact"],
          ]} />
          <FooterCol title="Resources" links={[
            ["Help Center", "/contact"], ["User Guide", "/contact"], ["FAQ", "#faq"],
          ]} />
          <FooterCol title="Account" links={[
            ["Login", "/auth/login"], ["Create account", "/auth/register"],
            ["Terms", "/terms"], ["Privacy", "/privacy"],
          ]} />
        </div>
        <div className="text-muted-foreground border-t py-5 text-center text-xs">
          © {new Date().getFullYear()} Fomo. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{title}</p>
      <ul className="text-muted-foreground space-y-2 text-sm">
        {links.map(([l, h]) => (
          <li key={l}><Link href={h} className="hover:text-foreground">{l}</Link></li>
        ))}
      </ul>
    </div>
  )
}
