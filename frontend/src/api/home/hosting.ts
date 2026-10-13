import api from "@/api/axios"

export const hostingApi = {
  getAll: async () => {
    const { data } = await api.get("/api/hosting-plans")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/hosting-plans/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/api/hosting-plans/slug/${slug}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/hosting-plans", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/hosting-plans/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/hosting-plans/${id}`)
  },
}
