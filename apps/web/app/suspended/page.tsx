import Link from "next/link"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"

export default function SuspendedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 px-4 text-center">
      <Image src="/fomo_icon.png" alt="Fomo" width={56} height={56} />
      <div>
        <h1 className="text-2xl font-bold">Account Suspended</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
          This account currently can&apos;t access Fomo. If you believe this is
          a mistake, please reach out.
        </p>
      </div>
      <Button render={<Link href="/contact" />}>
        Contact Support
      </Button>
    </div>
  )
}
