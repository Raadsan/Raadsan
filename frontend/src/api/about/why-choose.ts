import api from "@/api/axios"

export const aboutWhyChooseApi = {
  getAll: async () => {
    const { data } = await api.get("/api/about-why-choose")
    return data
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/about-why-choose", payload)
    return data
  },
  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/about-why-choose/${id}`, payload)
    return data
  },
  remove: async (id: number) => {
    await api.delete(`/api/about-why-choose/${id}`)
  },
}
