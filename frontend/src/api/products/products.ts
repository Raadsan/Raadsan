import api from "@/api/axios"

export const productsApi = {
  getAll: async () => {
    const { data } = await api.get("/api/products")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/products/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/api/products/slug/${slug}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/products", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/products/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/products/${id}`)
  },
}
