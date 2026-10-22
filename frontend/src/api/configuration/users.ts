import api from "@/api/axios"

export const usersApi = {
  getAll: async () => {
    const { data } = await api.get("/api/users")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/users/${id}`)
    return data
  },

  create: async (payload: {
    fullName: string
    email: string
    password: string
    confirmPass: string
    roleId: number
  }) => {
    const { data } = await api.post("/api/users", payload)
    return data
  },

  update: async (
    id: number,
    payload: {
      fullName?: string
      email?: string
      password?: string
      confirmPass?: string
      roleId?: number
    },
  ) => {
    const { data } = await api.put(`/api/users/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/users/${id}`)
  },
}
