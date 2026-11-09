import api from "@/api/axios"

export type RolePermissionItem = {
  id?: number
  roleId: number
  menuId: number
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  menu?: {
    id: number
    title: string
    url: string | null
    parentId: number | null
    order: number
  }
}

export type SaveRolePermissionsPayload = {
  roleId: number
  permissions: Array<{
    menuId: number
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
  }>
}

export type RolePermissionSummary = {
  roleId: number
  name: string
  description: string | null
  userCount: number
  viewCount: number
  createCount: number
  editCount: number
  deleteCount: number
  totalPermissions: number
}

export const rolePermissionApi = {
  getSummary: async (): Promise<RolePermissionSummary[]> => {
    const { data } = await api.get("/api/role-permissions/summary")
    return data
  },

  getByRole: async (roleId: number): Promise<RolePermissionItem[]> => {
    const { data } = await api.get(`/api/role-permissions?roleId=${roleId}`)
    return data
  },

  saveBulk: async (payload: SaveRolePermissionsPayload): Promise<{ message: string; count: number }> => {
    const { data } = await api.post("/api/role-permissions/bulk", payload)
    return data
  },
}
