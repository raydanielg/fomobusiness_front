"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@workspace/ui/components/empty"

export default function Page() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Platform configuration.</p>
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
