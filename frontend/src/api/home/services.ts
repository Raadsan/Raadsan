import api from "@/api/axios"

export const servicesApi = {
  getAll: async () => {
    const { data } = await api.get("/api/services")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/services/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/api/services/slug/${slug}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/services", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/services/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/services/${id}`)
  },
}
