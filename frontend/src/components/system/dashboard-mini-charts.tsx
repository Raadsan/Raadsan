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

const clientsData = [
  { week: "W1", clients: 32 },
  { week: "W2", clients: 38 },
  { week: "W3", clients: 35 },
  { week: "W4", clients: 44 },
  { week: "W5", clients: 49 },
  { week: "W6", clients: 54 },
]

const messagesData = [
  { day: "Mon", messages: 12 },
  { day: "Tue", messages: 18 },
  { day: "Wed", messages: 9 },
  { day: "Thu", messages: 22 },
  { day: "Fri", messages: 16 },
  { day: "Sat", messages: 11 },
  { day: "Sun", messages: 8 },
]

const blogCategoryData = [
  { name: "Technology", value: 28, fill: "#116cc6" },
  { name: "AI", value: 22, fill: "#2b8cf0" },
  { name: "Business", value: 18, fill: "#0b559e" },
  { name: "Guides", value: 14, fill: "#ffbc11" },
]

const clientsConfig = {
  clients: { label: "Clients", color: "#116cc6" },
} satisfies ChartConfig

const messagesConfig = {
  messages: { label: "Messages", color: "#ffbc11" },
} satisfies ChartConfig

const blogCategoryConfig = {
  Technology: { label: "Technology", color: "#116cc6" },
  AI: { label: "AI", color: "#2b8cf0" },
  Business: { label: "Business", color: "#0b559e" },
  Guides: { label: "Guides", color: "#ffbc11" },
} satisfies ChartConfig

export function DashboardMiniCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Client Growth</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            New clients over the last 6 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={clientsConfig} className="h-[180px] w-full">
            <LineChart data={clientsData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
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
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Contact Messages</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Inquiries received this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={messagesConfig} className="h-[180px] w-full">
            <AreaChart data={messagesData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
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
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm md:col-span-2 xl:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Blog Category</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
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
        </CardContent>
      </Card>
    </div>
  )
}
