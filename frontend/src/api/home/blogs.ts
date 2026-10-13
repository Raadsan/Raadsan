import api from "@/api/axios"

export const blogsApi = {
  getAll: async () => {
    const { data } = await api.get("/api/blogs")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/api/blogs/${id}`)
    return data
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/api/blogs/slug/${slug}`)
    return data
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/blogs", payload)
    return data
  },

  update: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/blogs/${id}`, payload)
    return data
  },

  remove: async (id: number) => {
    await api.delete(`/api/blogs/${id}`)
  },

  getCategories: async () => {
    const { data } = await api.get("/api/blogs/categories")
    return data
  },

  createCategory: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/blogs/categories", payload)
    return data
  },

  updateCategory: async (id: number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/api/blogs/categories/${id}`, payload)
    return data
  },

  removeCategory: async (id: number) => {
    await api.delete(`/api/blogs/categories/${id}`)
  },
}
