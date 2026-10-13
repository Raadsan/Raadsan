import api from "@/api/axios"

export const testimonialsApi = {
  getAll: async () => {
    const { data } = await api.get("/api/testimonials")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/testimonials/${id}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/testimonials", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/testimonials/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/testimonials/${id}`)
  },
}
