import api from "@/api/axios"

export const rolesApi = {
  getAll: async () => {
    const { data } = await api.get("/api/roles")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/roles/${id}`)
    return data
  },

  create: async (payload: { name: string; description?: string }) => {
    const { data } = await api.post("/api/roles", payload)
    return data
  },

  update: async (
    id: number,
    payload: { name?: string; description?: string | null },
  ) => {
    const { data } = await api.put(`/api/roles/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/roles/${id}`)
  },
}
