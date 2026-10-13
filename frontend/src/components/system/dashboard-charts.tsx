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

const activityData = [
  { month: "Jan", domains: 18, hosting: 12 },
  { month: "Feb", domains: 22, hosting: 15 },
  { month: "Mar", domains: 28, hosting: 19 },
  { month: "Apr", domains: 24, hosting: 21 },
  { month: "May", domains: 32, hosting: 25 },
  { month: "Jun", domains: 36, hosting: 28 },
]

const servicesData = [
  { name: "Hosting", value: 38, fill: "var(--color-hosting)" },
  { name: "Software", value: 24, fill: "var(--color-software)" },
  { name: "Mobile Apps", value: 18, fill: "var(--color-mobile)" },
  { name: "AI Solutions", value: 12, fill: "var(--color-ai)" },
  { name: "Training", value: 8, fill: "var(--color-training)" },
]

const activityConfig = {
  domains: {
    label: "Domains",
    color: "#116cc6",
  },
  hosting: {
    label: "Hosting",
    color: "#ffbc11",
  },
} satisfies ChartConfig

const servicesConfig = {
  hosting: { label: "Hosting", color: "#116cc6" },
  software: { label: "Software", color: "#2b8cf0" },
  mobile: { label: "Mobile Apps", color: "#0b559e" },
  ai: { label: "AI Solutions", color: "#ffbc11" },
  training: { label: "Training", color: "#f59e0b" },
} satisfies ChartConfig

export function DashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="border-border/80 shadow-sm lg:col-span-3">
        <CardHeader>
          <CardTitle>Domains & Hosting</CardTitle>
          <CardDescription>Monthly registrations and hosting packages</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle>Services Mix</CardTitle>
          <CardDescription>Share of active service requests</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
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
        </CardContent>
      </Card>
    </div>
  )
}
