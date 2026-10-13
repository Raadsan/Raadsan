import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type DashboardPageShellProps = {
  title: string
  description: string
  badge?: string
  actionLabel?: string
  children?: React.ReactNode
}

export function DashboardPageShell({
  title,
  description,
  badge = "Frontend only",
  actionLabel = "Add new",
  children,
}: DashboardPageShellProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-secondary/40 bg-secondary/15 text-foreground"
          >
            {badge}
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus />
          {actionLabel}
        </Button>
      </div>

      {children ?? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>{title} content</CardTitle>
            <CardDescription>
              This screen is ready for UI content. Backend wiring comes later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-primary/20 bg-primary/5 px-6 text-center text-sm text-muted-foreground">
              Drop tables, forms, or editors here for {title.toLowerCase()}.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
