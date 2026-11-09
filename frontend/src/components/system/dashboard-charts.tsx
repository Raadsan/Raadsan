"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

// ── Fallback (while loading) ──────────────────────────────────────
const fallbackActivityData = [
  { month: "Jan", domains: 0, hosting: 0 },
  { month: "Feb", domains: 0, hosting: 0 },
  { month: "Mar", domains: 0, hosting: 0 },
  { month: "Apr", domains: 0, hosting: 0 },
  { month: "May", domains: 0, hosting: 0 },
  { month: "Jun", domains: 0, hosting: 0 },
]

const fallbackServicesData = [{ name: "Loading…", value: 1, fill: "#e2e8f0" }]

// ── Static chart configs ──────────────────────────────────────────
const activityConfig = {
  domains: { label: "Domains", color: "#116cc6" },
  hosting: { label: "Hosting", color: "#ffbc11" },
} satisfies ChartConfig

const servicesConfig = {} satisfies ChartConfig

// ── Props ─────────────────────────────────────────────────────────
interface DashboardChartsProps {
  domainsHostingData?: { month: string; domains: number; hosting: number }[]
  servicesMixData?: { name: string; value: number; fill: string }[]
  isLoading?: boolean
}

export function DashboardCharts({
  domainsHostingData,
  servicesMixData,
  isLoading,
}: DashboardChartsProps) {
  const activityData =
    !isLoading && domainsHostingData ? domainsHostingData : fallbackActivityData
  const servicesData =
    !isLoading && servicesMixData && servicesMixData.length > 0
      ? servicesMixData
      : fallbackServicesData

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* ── Domains & Hosting bar chart ───── */}
      <Card className="border-border/80 shadow-sm lg:col-span-3">
        <CardHeader>
          <CardTitle>Domains &amp; Hosting</CardTitle>
          <CardDescription>
            Monthly registrations and hosting packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <ChartContainer config={activityConfig} className="h-[280px] w-full">
              <BarChart data={activityData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="domains"
                  fill="var(--color-domains)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="hosting"
                  fill="var(--color-hosting)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Services mix donut ────────────── */}
      <Card className="border-border/80 shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle>Services Mix</CardTitle>
          <CardDescription>Share of active service requests</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          {isLoading ? (
            <Skeleton className="mx-auto h-[280px] w-[280px] rounded-full" />
          ) : (
            <ChartContainer
              config={servicesConfig}
              className="mx-auto h-[280px] w-full max-w-[280px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={servicesData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={96}
                  strokeWidth={2}
                >
                  {servicesData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-1 flex-wrap gap-2"
                />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
