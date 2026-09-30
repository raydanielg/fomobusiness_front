import Link from "next/link"
import Image from "next/image"

export const metadata = { title: "Terms of Service" }

export default function TermsPage() {
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
      <main className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-16">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated — draft</p>
        <p>
          By using Fomo you agree to these terms. Fomo provides business
          management software — sales, inventory, invoicing and payments —
          delivered primarily through our mobile applications.
        </p>
        <h2>Accounts</h2>
        <p>You are responsible for your credentials and the activity under your account.</p>
        <h2>Acceptable use</h2>
        <p>No unlawful, fraudulent or abusive activity.</p>
        <h2>Contact</h2>
        <p><Link href="/contact">Contact us</Link> for questions about these terms.</p>
      </main>
    </div>
  )
}
