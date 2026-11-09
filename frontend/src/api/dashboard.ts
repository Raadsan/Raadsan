import api from "@/api/axios"

export interface DashboardStats {
  blogs: number
  clients: number
  services: number
  contactInquiries: number
}

export interface ChartPoint {
  [key: string]: string | number
}

export interface DashboardData {
  stats: DashboardStats
  blogCategories: { name: string; value: number; fill: string }[]
  contactMessagesData: { day: string; messages: number }[]
  clientGrowthData: { week: string; clients: number }[]
  servicesMixData: { name: string; value: number; fill: string }[]
  domainsHostingData: { month: string; domains: number; hosting: number }[]
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardData> => {
    const { data } = await api.get("/api/dashboard/stats")
    return data
  },
}
