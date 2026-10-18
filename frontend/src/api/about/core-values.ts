import api from "@/api/axios"

export const aboutCoreValuesApi = {
  getAll: async () => {
    const { data } = await api.get("/api/about-core-values")
    return data
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/about-core-values", payload)
    return data
  },
  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/about-core-values/${id}`, payload)
    return data
  },
  remove: async (id: number) => {
    await api.delete(`/api/about-core-values/${id}`)
  },
}
