"use client"

import Link from "next/link"
import { IconArrowRight, IconRefresh } from "@tabler/icons-react"

import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { DashboardCharts } from "@/components/system/dashboard-charts"
import { DashboardMiniCharts } from "@/components/system/dashboard-mini-charts"
import { SectionCards } from "@/components/system/section-cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardStats()

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
            {error && (
              <p className="text-sm text-destructive">
                {error} &mdash;{" "}
                <button
                  onClick={refetch}
                  className="underline hover:no-underline"
                >
                  retry
                </button>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refetch}
              disabled={isLoading}
              title="Refresh dashboard"
            >
              <IconRefresh
                className={isLoading ? "animate-spin" : ""}
                aria-hidden
              />
            </Button>
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
      </div>

      {/* ── Stats cards ───────────────────────────── */}
      <SectionCards stats={data?.stats} isLoading={isLoading} />

      {/* ── Mini charts ──────────────────────────── */}
      <div className="px-4 lg:px-6">
        <DashboardMiniCharts
          clientGrowthData={data?.clientGrowthData}
          contactMessagesData={data?.contactMessagesData}
          blogCategories={data?.blogCategories}
          isLoading={isLoading}
        />
      </div>

      {/* ── Bottom charts ────────────────────────── */}
      <div className="px-4 lg:px-6">
        <DashboardCharts
          domainsHostingData={data?.domainsHostingData}
          servicesMixData={data?.servicesMixData}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
