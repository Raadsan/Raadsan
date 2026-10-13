import api from "@/api/axios"

export const faqsApi = {
  getAll: async () => {
    const { data } = await api.get("/api/faqs")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/faqs/${id}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/faqs", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/faqs/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/faqs/${id}`)
  },
}
