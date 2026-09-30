import Link from "next/link"
import Image from "next/image"

export const metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated — draft</p>
        <p>
          We collect only what is needed to run your business: account
          details, business data you enter, and usage analytics.
        </p>
        <h2>Data we collect</h2>
        <ul>
          <li>Account information (name, email, phone)</li>
          <li>Business data (sales, inventory, customers)</li>
          <li>Payment metadata (amounts, status — never card details)</li>
        </ul>
        <h2>Your rights</h2>
        <p>You can export or delete your data by contacting support.</p>
      </main>
    </div>
  )
}
