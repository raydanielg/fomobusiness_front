import type { Metadata } from "next"
import { Landing } from "@/components/landing"

export const metadata: Metadata = {
  title: "Fomo — Your Business, Simplified.",
  description:
    "Sales, inventory, customers, expenses, invoices, payments, reports, staff and branches — one platform for African businesses.",
  openGraph: {
    title: "Fomo — Your Business, Simplified.",
    description: "Everything your business needs, in one platform.",
    siteName: "Fomo",
    type: "website",
  },
}

export default function Page() {
  return <Landing />
}
