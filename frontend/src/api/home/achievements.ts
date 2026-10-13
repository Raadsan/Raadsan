import api from "@/api/axios"

export const achievementsApi = {
  getAll: async () => {
    const { data } = await api.get("/api/achievements")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/achievements/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/api/achievements/slug/${slug}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/achievements", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/achievements/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/achievements/${id}`)
  },
}
