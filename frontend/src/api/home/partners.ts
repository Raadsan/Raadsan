import api from "@/api/axios"

export const partnersApi = {
  getAll: async () => {
    const { data } = await api.get("/api/partners")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/partners/${id}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/partners", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/partners/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/partners/${id}`)
  },
}
