import Link from "next/link"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 px-4 text-center">
      <Image src="/fomo_icon.png" alt="Fomo" width={56} height={56} />
      <div>
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You don&apos;t have permission to access this area.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" nativeButton={false} render={<Link href="javascript:history.back()" />}>
          Go Back
        </Button>
        <Button nativeButton={false} render={<Link href="/mobile-app" />}>
          Open Mobile App Info
        </Button>
      </div>
    </div>
  )
}
