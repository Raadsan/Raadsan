import api from "@/api/axios"

export type MenuItem = {
  id: number
  title: string
  url: string | null
  icon: string | null
  order: number
  parentId: number | null
  parent?: { id: number; title: string } | null
  children?: MenuItem[]
  _count?: { children: number }
  createdAt: string
  updatedAt: string
}

export type MenuPayload = {
  title: string
  url?: string | null
  icon?: string | null
  order?: number
  parentId?: number | null
}

export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const { data } = await api.get("/api/menus")
    return data
  },

  getTree: async (roleId?: number): Promise<MenuItem[]> => {
    const params = new URLSearchParams({ tree: "true" })
    if (roleId != null && roleId > 0) {
      params.set("roleId", String(roleId))
    }
    const { data } = await api.get(`/api/menus?${params.toString()}`)
    return data
  },

  getById: async (id: number): Promise<MenuItem> => {
    const { data } = await api.get(`/api/menus/${id}`)
    return data
  },

  create: async (payload: MenuPayload): Promise<MenuItem> => {
    const { data } = await api.post("/api/menus", payload)
    return data
  },

  update: async (id: number, payload: Partial<MenuPayload>): Promise<MenuItem> => {
    const { data } = await api.put(`/api/menus/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/api/menus/${id}`)
    return data
  },

  seedDefaults: async (): Promise<{ message: string }> => {
    const { data } = await api.post("/api/menus/seed-defaults")
    return data
  },
}
