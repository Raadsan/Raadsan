"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

// ── Fallback static data (shown while loading) ────────────────────
const fallbackClientsData = [
  { week: "W1", clients: 0 },
  { week: "W2", clients: 0 },
  { week: "W3", clients: 0 },
  { week: "W4", clients: 0 },
  { week: "W5", clients: 0 },
  { week: "W6", clients: 0 },
]

const fallbackMessagesData = [
  { day: "Mon", messages: 0 },
  { day: "Tue", messages: 0 },
  { day: "Wed", messages: 0 },
  { day: "Thu", messages: 0 },
  { day: "Fri", messages: 0 },
  { day: "Sat", messages: 0 },
  { day: "Sun", messages: 0 },
]

const fallbackBlogCategoryData = [
  { name: "Loading…", value: 1, fill: "#e2e8f0" },
]

// ── Chart configs (static) ────────────────────────────────────────
const clientsConfig = {
  clients: { label: "Clients", color: "#116cc6" },
} satisfies ChartConfig

const messagesConfig = {
  messages: { label: "Messages", color: "#ffbc11" },
} satisfies ChartConfig

const blogCategoryConfig = {} satisfies ChartConfig

// ── Props ─────────────────────────────────────────────────────────
interface DashboardMiniChartsProps {
  clientGrowthData?: { week: string; clients: number }[]
  contactMessagesData?: { day: string; messages: number }[]
  blogCategories?: { name: string; value: number; fill: string }[]
  isLoading?: boolean
}

export function DashboardMiniCharts({
  clientGrowthData,
  contactMessagesData,
  blogCategories,
  isLoading,
}: DashboardMiniChartsProps) {
  const clientsData =
    !isLoading && clientGrowthData ? clientGrowthData : fallbackClientsData
  const messagesData =
    !isLoading && contactMessagesData
      ? contactMessagesData
      : fallbackMessagesData
  const blogCategoryData =
    !isLoading && blogCategories && blogCategories.length > 0
      ? blogCategories
      : fallbackBlogCategoryData

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {/* ── Client Growth ────────────────────── */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Client Growth</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            New clients over the last 6 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[180px] w-full" />
          ) : (
            <ChartContainer config={clientsConfig} className="h-[180px] w-full">
              <LineChart data={clientsData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="clients"
                  stroke="var(--color-clients)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--color-clients)" }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Contact Messages ─────────────────── */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Contact Messages</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Inquiries received this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[180px] w-full" />
          ) : (
            <ChartContainer
              config={messagesConfig}
              className="h-[180px] w-full"
            >
              <AreaChart data={messagesData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="var(--color-messages)"
                  fill="var(--color-messages)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Blog Categories ──────────────────── */}
      <Card className="border-border/80 shadow-sm md:col-span-2 xl:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Blog Category</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Distribution by category
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="mx-auto h-[180px] w-[180px] rounded-full" />
          ) : (
            <ChartContainer
              config={blogCategoryConfig}
              className="mx-auto h-[180px] w-full max-w-[200px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={blogCategoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={72}
                  strokeWidth={2}
                >
                  {blogCategoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
