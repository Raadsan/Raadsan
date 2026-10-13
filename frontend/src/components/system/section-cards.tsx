import {
  IconArticle,
  IconUsers,
  IconServer,
  IconUser,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const cards = [
  {
    label: "Blogs",
    value: "128",
    hint: "Published blog posts",
    change: "+8.2%",
    icon: IconArticle,
  },
  {
    label: "Clients",
    value: "54",
    hint: "Accounts in client area",
    change: "+3.1%",
    icon: IconUsers,
  },
  {
    label: "Services",
    value: "12",
    hint: "Published service pages",
    change: "+2",
    icon: IconServer,
  },
  {
    label: "User",
    value: "19",
    hint: "New contact inquiries",
    change: "+5",
    icon: IconUser,
  },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <card.icon className="size-4 text-primary" />
              {card.label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge className="bg-secondary/20 text-foreground hover:bg-secondary/30">
                {card.change}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {card.hint}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
