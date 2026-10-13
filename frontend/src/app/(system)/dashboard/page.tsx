import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { DashboardCharts } from "@/components/system/dashboard-charts"
import { DashboardMiniCharts } from "@/components/system/dashboard-mini-charts"
import { SectionCards } from "@/components/system/section-cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-6 py-4 md:gap-8 md:py-6">
      <div className="flex flex-col gap-3 px-4 lg:px-6">
        <Badge className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
          Raadsan Admin
        </Badge>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Welcome back
            </h2>
          </div>
          <Button
            asChild
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Link href="/dashboard/management">
              Open Management
              <IconArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      <SectionCards />

      <div className="px-4 lg:px-6">
        <DashboardMiniCharts />
      </div>

      <div className="px-4 lg:px-6">
        <DashboardCharts />
      </div>
    </div>
  )
}
