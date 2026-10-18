import api from "@/api/axios"

export const aboutVisionMissionApi = {
  getAll: async () => {
    const { data } = await api.get("/api/about-vision-mission")
    return data
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/about-vision-mission", payload)
    return data
  },
  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/about-vision-mission/${id}`, payload)
    return data
  },
  remove: async (id: number) => {
    await api.delete(`/api/about-vision-mission/${id}`)
  },
}
