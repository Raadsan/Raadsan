import api from "@/api/axios"

export const contactInformationApi = {
  getAll: async () => {
    const { data } = await api.get("/api/contact-information")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/contact-information/${id}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/contact-information", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/contact-information/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/contact-information/${id}`)
  },
}
