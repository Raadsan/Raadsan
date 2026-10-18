import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { getSectionUrl, type PageModule } from "@/lib/dashboard-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PageSectionsOverview({ page }: { page: PageModule }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="space-y-2">
        <Badge
          variant="outline"
          className="border-secondary/40 bg-secondary/15 text-foreground"
        >
          Management / {page.title}
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {page.title} sections
        </h2>
      </div>

      {page.sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
          No {page.title.toLowerCase()} registered yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {page.sections.map((section) => (
            <Card
              key={section.slug}
              className="border-border/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={getSectionUrl(page.key, section.slug)}>
                    Open {section.title}
                    <IconArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
