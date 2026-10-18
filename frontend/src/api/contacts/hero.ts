import api from "@/api/axios"

export const contactHeroApi = {
  getAll: async () => {
    const { data } = await api.get("/api/contact-hero")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/contact-hero/${id}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/contact-hero", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/contact-hero/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/contact-hero/${id}`)
  },
}
