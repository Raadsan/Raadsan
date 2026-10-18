import api from "@/api/axios"

export const aboutCompanyApi = {
  getAll: async () => {
    const { data } = await api.get("/api/about-company")
    return data
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/about-company", payload)
    return data
  },
  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/about-company/${id}`, payload)
    return data
  },
  remove: async (id: number) => {
    await api.delete(`/api/about-company/${id}`)
  },
}
