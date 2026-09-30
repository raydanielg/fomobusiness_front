"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@workspace/ui/components/empty"

export default function Page() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground text-sm">Tickets and conversations.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyTitle>Coming soon</EmptyTitle>
              <EmptyDescription>This section is under construction.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}
