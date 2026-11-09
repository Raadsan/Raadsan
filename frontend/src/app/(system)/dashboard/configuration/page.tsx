import Link from "next/link"
import {
  IconArrowRight,
  IconLock,
  IconMenu2,
  IconShield,
  IconUsers,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const configModules = [
  {
    title: "Roles",
    url: "/configuration/roles",
    description: "Define system roles and access levels for team members.",
    icon: IconShield,
    tag: "Access Control",
  },
  {
    title: "Users",
    url: "/configuration/users",
    description: "Manage admin users, credentials, and role assignments.",
    icon: IconUsers,
    tag: "Accounts",
  },
  {
    title: "Menu",
    url: "/configuration/menu",
    description: "Configure navigation hierarchy, submenus, and admin routes.",
    icon: IconMenu2,
    tag: "Navigation",
  },
  {
    title: "Role Permission",
    url: "/configuration/role-permission",
    description: "Configure granular permissions and privileges for roles.",
    icon: IconLock,
    tag: "Security",
  },
]

export default function ConfigurationPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="space-y-2">
        <Badge
          variant="outline"
          className="border-secondary/40 bg-secondary/15 text-foreground"
        >
          Configuration
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          System Configuration
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage system roles, admin users, menu navigation, and permissions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {configModules.map((item) => {
          const Icon = item.icon

          return (
            <Card
              key={item.url}
              className="border-border/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {item.tag}
                  </Badge>
                </div>
                <CardDescription className="pt-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={item.url}>
                    Open {item.title}
                    <IconArrowRight className="ml-1 size-4" />
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
