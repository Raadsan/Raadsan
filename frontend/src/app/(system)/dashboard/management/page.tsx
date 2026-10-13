import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { getPageModule, managementItems } from "@/lib/dashboard-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ManagementPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="space-y-2">
        <Badge
          variant="outline"
          className="border-secondary/40 bg-secondary/15 text-foreground"
        >
          Management
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Website pages
        </h2>
        <p className="text-sm text-muted-foreground">
          Open a page, then manage its sections (for example Home → Services,
          Achievements, FAQ).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {managementItems.map((item) => {
          const page = getPageModule(item.module)
          const sectionCount = page?.sections.length ?? 0

          return (
            <Card
              key={item.url}
              className="border-border/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{item.title}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {sectionCount} sections
                  </Badge>
                </div>
                <CardDescription>
                  Manage {item.title.toLowerCase()} page sections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={item.url}>
                    Open {item.title}
                    <IconArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
