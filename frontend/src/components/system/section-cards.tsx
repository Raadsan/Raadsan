"use client"

import {
  IconArticle,
  IconLoader2,
  IconMessage,
  IconServer,
  IconUsers,
} from "@tabler/icons-react"

import type { DashboardStats } from "@/api/dashboard"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardConfig {
  label: string
  key: keyof DashboardStats
  hint: string
  icon: React.ComponentType<{ className?: string }>
}

const cardConfigs: CardConfig[] = [
  {
    label: "Blogs",
    key: "blogs",
    hint: "Published blog posts",
    icon: IconArticle,
  },
  {
    label: "Clients",
    key: "clients",
    hint: "Registered client accounts",
    icon: IconUsers,
  },
  {
    label: "Services",
    key: "services",
    hint: "Published service pages",
    icon: IconServer,
  },
  {
    label: "Contact Inquiries",
    key: "contactInquiries",
    hint: "New contact form submissions",
    icon: IconMessage,
  },
]

interface SectionCardsProps {
  stats?: DashboardStats | null
  isLoading?: boolean
}

export function SectionCards({ stats, isLoading }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardConfigs.map((card) => {
        const value = stats?.[card.key] ?? null
        return (
          <Card
            key={card.label}
            className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <card.icon className="size-4 text-primary" />
                {card.label}
              </CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {isLoading ? (
                  <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
                ) : (
                  (value ?? "—")
                )}
              </CardTitle>
              <CardAction>
                <Badge className="bg-secondary/20 text-foreground hover:bg-secondary/30">
                  {isLoading ? "..." : "Live"}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground">
              {card.hint}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
