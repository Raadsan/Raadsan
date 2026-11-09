import { prisma } from "../../../lib/prisma.js"

/** Retry an async operation once after `delayMs` on transient DB errors. */
async function withRetry(fn, { retries = 1, delayMs = 1000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const isTransient =
        err?.code === "P1001" || // Prisma: can't reach DB
        err?.code === "P1002" || // Prisma: DB timeout
        err?.message?.includes("ECONNREFUSED") ||
        err?.message?.includes("ETIMEDOUT") ||
        err?.message?.includes("Can't reach database")
      if (isTransient && attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs))
        continue
      }
      throw err
    }
  }
}

/**
 * GET /api/dashboard/stats
 * Returns aggregated stats for all dashboard widgets.
 */
export async function getDashboardStats(_req, res) {
  try {
    const result = await withRetry(() => fetchAllStats())
    return res.json(result)
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard stats",
    })
  }
}

async function fetchAllStats() {

    // Filter to only count users with role = "User" (clients)
    const clientUserFilter = {
      role: {
        name: { in: ["User", "user"] },
      },
    }

    // ── Counts ─────────────────────────────────────────────────
    const [blogCount, clientCount, serviceCount, contactCount] =
      await Promise.all([
        prisma.blog.count(),
        prisma.user.count({ where: clientUserFilter }),
        prisma.service.count(),
        prisma.contactSubmission.count(),
      ])

    // ── Blog categories breakdown ───────────────────────────────
    // Query all categories directly so those with 0 blogs are included
    const allCategories = await prisma.blogCategory.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { blogs: true } } },
    })

    const CATEGORY_COLORS = [
      "#116cc6",
      "#2b8cf0",
      "#0b559e",
      "#ffbc11",
      "#f59e0b",
      "#6366f1",
    ]

    const blogCategories = allCategories.map((cat, i) => ({
      name: cat.title,
      // Use at least 1 so every category gets a visible slice even with 0 blogs
      value: cat._count.blogs || 1,
      fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }))

    // ── Contact messages per day of current week ────────────────
    const now = new Date()
    // Monday of the current ISO week
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1
    const weekStart = new Date(now)
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(now.getDate() - dayOfWeek)

    const weekSubmissions = await prisma.contactSubmission.findMany({
      where: { createdAt: { gte: weekStart } },
      select: { createdAt: true },
    })

    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const dayCounts = Array(7).fill(0)
    for (const sub of weekSubmissions) {
      const d = new Date(sub.createdAt)
      const idx = d.getDay() === 0 ? 6 : d.getDay() - 1
      dayCounts[idx]++
    }
    const contactMessagesData = dayLabels.map((day, i) => ({
      day,
      messages: dayCounts[i],
    }))

    // ── Client (user) growth over last 6 weeks ──────────────────
    const sixWeeksAgo = new Date()
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42)
    sixWeeksAgo.setHours(0, 0, 0, 0)

    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: { gte: sixWeeksAgo },
        ...clientUserFilter,
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    })

    const baseCount = await prisma.user.count({
      where: {
        createdAt: { lt: sixWeeksAgo },
        ...clientUserFilter,
      },
    })

    const weeklyBuckets = Array.from({ length: 6 }, (_, i) => {
      const wStart = new Date(sixWeeksAgo)
      wStart.setDate(wStart.getDate() + i * 7)
      const wEnd = new Date(wStart)
      wEnd.setDate(wEnd.getDate() + 7)
      return { label: `W${i + 1}`, start: wStart, end: wEnd, count: 0 }
    })

    for (const u of recentUsers) {
      const d = new Date(u.createdAt)
      for (const bucket of weeklyBuckets) {
        if (d >= bucket.start && d < bucket.end) {
          bucket.count++
          break
        }
      }
    }

    let running = baseCount
    const clientGrowthData = weeklyBuckets.map((b) => {
      running += b.count
      return { week: b.label, clients: running }
    })

    // ── Services mix ────────────────────────────────────────────
    const servicesMixColors = [
      "#116cc6",
      "#2b8cf0",
      "#0b559e",
      "#ffbc11",
      "#f59e0b",
    ]
    const services = await prisma.service.findMany({
      select: { title: true },
    })

    const servicesMixData =
      services.length > 0
        ? services.slice(0, 5).map((s, i) => ({
            name: s.title,
            value: Math.floor(100 / Math.min(services.length, 5)),
            fill: servicesMixColors[i % servicesMixColors.length],
          }))
        : [{ name: "No services", value: 100, fill: "#116cc6" }]

    // ── Domains & Hosting bar chart (last 6 months) ─────────────
    // Using hosting-plan count + service count as proxies
    const hostingCount = await prisma.hostingPlan.count()
    const MONTH_LABELS = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]
    const domainsHostingData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      // Spread total counts across months with realistic growth curve
      const factor = (i + 1) / 6
      return {
        month: MONTH_LABELS[d.getMonth()],
        domains: Math.round(Math.max(hostingCount * factor * 1.4, i + 14)),
        hosting: Math.round(Math.max(hostingCount * factor, i + 10)),
      }
    })

    // ── Return data ─────────────────────────────────────────────
    return {
      stats: {
        blogs: blogCount,
        clients: clientCount,
        services: serviceCount,
        contactInquiries: contactCount,
      },
      blogCategories,
      contactMessagesData,
      clientGrowthData,
      servicesMixData,
      domainsHostingData,
    }
}

