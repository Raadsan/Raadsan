"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  IconCheck,
  IconCornerDownRight,
  IconDeviceFloppy,
  IconEye,
  IconPencil,
  IconPlus,
  IconSearch,
  IconShield,
  IconTrash,
  IconX,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { rolesApi } from "@/api/configuration/roles"
import { menuApi, type MenuItem } from "@/api/configuration/menu"
import {
  rolePermissionApi,
  type RolePermissionItem,
  type RolePermissionSummary,
} from "@/api/configuration/role-permission"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type FlattenedMenuItem = MenuItem & {
  depth: number
  pathTitle: string
}

function flattenMenuTree(
  items: MenuItem[],
  depth = 0,
  parentPath = "",
): FlattenedMenuItem[] {
  const result: FlattenedMenuItem[] = []

  for (const item of items) {
    const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title
    result.push({
      ...item,
      depth,
      pathTitle: currentPath,
    })

    if (item.children && item.children.length > 0) {
      result.push(...flattenMenuTree(item.children, depth + 1, currentPath))
    }
  }

  return result
}

type PermissionMap = Record<
  number,
  { canView: boolean; canCreate: boolean; canEdit: boolean; canDelete: boolean }
>

const EMPTY_SAVED_PERMISSIONS: RolePermissionItem[] = []

function buildPermissionMap(
  flattenedMenus: FlattenedMenuItem[],
  saved: RolePermissionItem[],
  roleName: string | undefined,
): PermissionMap {
  const initial: PermissionMap = {}
  const permLookup = new Map<number, RolePermissionItem>()
  saved.forEach((p) => permLookup.set(p.menuId, p))

  const isAdministrator = roleName?.toLowerCase().includes("admin")

  flattenedMenus.forEach((menu) => {
    const existing = permLookup.get(menu.id)
    if (existing) {
      initial[menu.id] = {
        canView: Boolean(existing.canView),
        canCreate: Boolean(existing.canCreate),
        canEdit: Boolean(existing.canEdit),
        canDelete: Boolean(existing.canDelete),
      }
    } else {
      initial[menu.id] = {
        canView: Boolean(isAdministrator),
        canCreate: Boolean(isAdministrator),
        canEdit: Boolean(isAdministrator),
        canDelete: Boolean(isAdministrator),
      }
    }
  })

  return initial
}

export function RolePermissionManager() {
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<{ id: number; name: string; description: string | null } | null>(null)
  const [permissions, setPermissions] = useState<PermissionMap>({})
  const [isDirty, setIsDirty] = useState(false)
  const [search, setSearch] = useState("")

  // 1. Fetch permissions summary for all roles (cards data)
  const { data: roleSummaries = [], isLoading: isSummaryLoading } = useQuery({
    queryKey: ["role-permissions", "summary"],
    queryFn: rolePermissionApi.getSummary,
  })

  // 2. Fetch all menus in hierarchical tree
  const { data: menuTree = [] } = useQuery({
    queryKey: ["menus", "tree"],
    queryFn: menuApi.getTree,
  })

  const flattenedMenus = useMemo(() => {
    return flattenMenuTree(menuTree)
  }, [menuTree])

  // 3. Fetch permissions for the currently edited role
  const selectedRoleId = selectedRole?.id || null
  const {
    data: savedPermissions,
    isLoading: isPermissionsLoading,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["role-permissions", selectedRoleId],
    queryFn: () =>
      selectedRoleId ? rolePermissionApi.getByRole(selectedRoleId) : Promise.resolve([]),
    enabled: Boolean(selectedRoleId && dialogOpen),
  })

  const selectedRoleName = selectedRole?.name

  // Sync local checkboxes when the dialog opens and role permissions have loaded
  useEffect(() => {
    if (!dialogOpen || !flattenedMenus.length || !selectedRoleId) return
    if (isPermissionsLoading) return

    const saved = savedPermissions ?? EMPTY_SAVED_PERMISSIONS
    setPermissions(buildPermissionMap(flattenedMenus, saved, selectedRoleName))
    setIsDirty(false)
  }, [
    dialogOpen,
    selectedRoleId,
    selectedRoleName,
    flattenedMenus,
    isPermissionsLoading,
    dataUpdatedAt,
  ])

  // Open modal for a specific role
  const handleEditRole = (role: { id: number; name: string; description: string | null }) => {
    setSelectedRole(role)
    setSearch("")
    setDialogOpen(true)
  }

  // Mutation to save permissions
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRoleId) return
      const payloadList = Object.entries(permissions).map(([menuId, perms]) => ({
        menuId: Number(menuId),
        canView: perms.canView,
        canCreate: perms.canCreate,
        canEdit: perms.canEdit,
        canDelete: perms.canDelete,
      }))

      return rolePermissionApi.saveBulk({
        roleId: selectedRoleId,
        permissions: payloadList,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] })
      toast.success(`Permissions updated for ${selectedRole?.name}`)
      setIsDirty(false)
      setDialogOpen(false)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to save permissions")
    },
  })

  // Toggle single permission checkbox
  const togglePermission = (
    menuId: number,
    field: "canView" | "canCreate" | "canEdit" | "canDelete",
  ) => {
    setPermissions((prev) => {
      const current = prev[menuId] || {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      }
      const updated = { ...current, [field]: !current[field] }

      // If granting create/edit/delete, ensure view is also enabled
      if ((field === "canCreate" || field === "canEdit" || field === "canDelete") && updated[field]) {
        updated.canView = true
      }
      // If revoking view, also revoke create/edit/delete
      if (field === "canView" && !updated.canView) {
        updated.canCreate = false
        updated.canEdit = false
        updated.canDelete = false
      }

      return { ...prev, [menuId]: updated }
    })
    setIsDirty(true)
  }

  // Row toggle: All / None for a specific menu item
  const toggleRowAll = (menuId: number) => {
    setPermissions((prev) => {
      const current = prev[menuId]
      const allChecked =
        current?.canView &&
        current?.canCreate &&
        current?.canEdit &&
        current?.canDelete

      const nextVal = !allChecked
      return {
        ...prev,
        [menuId]: {
          canView: nextVal,
          canCreate: nextVal,
          canEdit: nextVal,
          canDelete: nextVal,
        },
      }
    })
    setIsDirty(true)
  }

  // Bulk actions
  const grantAll = () => {
    setPermissions((prev) => {
      const updated: PermissionMap = {}
      flattenedMenus.forEach((m) => {
        updated[m.id] = { canView: true, canCreate: true, canEdit: true, canDelete: true }
      })
      return updated
    })
    setIsDirty(true)
  }

  const grantViewOnly = () => {
    setPermissions((prev) => {
      const updated: PermissionMap = {}
      flattenedMenus.forEach((m) => {
        updated[m.id] = { canView: true, canCreate: false, canEdit: false, canDelete: false }
      })
      return updated
    })
    setIsDirty(true)
  }

  const revokeAll = () => {
    setPermissions((prev) => {
      const updated: PermissionMap = {}
      flattenedMenus.forEach((m) => {
        updated[m.id] = { canView: false, canCreate: false, canEdit: false, canDelete: false }
      })
      return updated
    })
    setIsDirty(true)
  }

  // Filtered menus in modal by search
  const displayedMenus = useMemo(() => {
    if (!search.trim()) return flattenedMenus
    const term = search.toLowerCase()
    return flattenedMenus.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        (m.url && m.url.toLowerCase().includes(term)),
    )
  }, [flattenedMenus, search])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Header matching brand design */}
      <div className="flex items-start gap-3.5">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15 border border-primary/20">
          <IconShield className="size-6 stroke-[1.8]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Role Permissions
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage access privileges and module permissions for system roles.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
        {isSummaryLoading ? (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            Loading role cards...
          </div>
        ) : roleSummaries.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            No roles configured yet.
          </div>
        ) : (
          roleSummaries.map((role: RolePermissionSummary) => (
            <Card
              key={role.roleId}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:shadow-md hover:border-primary/40"
            >
              <CardContent className="p-0 space-y-5">
                {/* Role Header */}
                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 border border-primary/20">
                    <IconShield className="size-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {role.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {role.description || "System Role"}
                    </p>
                  </div>
                </div>

                {/* Badges / Chips Row using brand primary color */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs transition-transform hover:scale-105"
                    title={`Create permissions: ${role.createCount}`}
                  >
                    <IconPlus className="size-3.5 stroke-[2.2]" />
                  </div>
                  <div
                    className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs transition-transform hover:scale-105"
                    title={`View permissions: ${role.viewCount}`}
                  >
                    <IconEye className="size-3.5 stroke-[2.2]" />
                  </div>
                  <div
                    className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs transition-transform hover:scale-105"
                    title={`Edit permissions: ${role.editCount}`}
                  >
                    <IconPencil className="size-3.5 stroke-[2.2]" />
                  </div>
                  <div
                    className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs transition-transform hover:scale-105"
                    title={`Delete permissions: ${role.deleteCount}`}
                  >
                    <IconTrash className="size-3.5 stroke-[2.2]" />
                  </div>

                  <span className="ml-1.5 text-sm font-semibold text-muted-foreground">
                    {role.totalPermissions} total
                  </span>
                </div>

                {/* Edit Permissions Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl text-sm font-semibold border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground transition-all gap-2 cursor-pointer shadow-2xs"
                  onClick={() =>
                    handleEditRole({
                      id: role.roleId,
                      name: role.name,
                      description: role.description,
                    })
                  }
                >
                  <IconPencil className="size-4" />
                  Edit Permissions
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Permissions Modal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] w-[92vw] max-w-3xl sm:max-w-3xl lg:max-w-[850px] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <span>Edit Permissions</span>
                  <Badge variant="secondary" className="font-semibold text-sm">
                    {selectedRole?.name}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Configure access permissions for the {selectedRole?.name} role.
                </DialogDescription>
              </div>

              {isDirty && (
                <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-xs">
                  Unsaved changes
                </Badge>
              )}
            </div>

            {/* Quick Actions & Search */}
            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg text-xs"
                  onClick={grantAll}
                >
                  <IconCheck className="size-3 mr-1 text-emerald-500" />
                  Grant All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg text-xs"
                  onClick={grantViewOnly}
                >
                  View Only
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg text-xs text-muted-foreground hover:text-destructive"
                  onClick={revokeAll}
                >
                  <IconX className="size-3 mr-1" />
                  Revoke All
                </Button>
              </div>

              <div className="relative w-full sm:w-64">
                <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter modules..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 rounded-lg text-xs"
                />
              </div>
            </div>
          </DialogHeader>

          {/* Permissions Table inside dialog */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[280px]">Menu / Module</TableHead>
                  <TableHead className="w-24 text-center">Level</TableHead>
                  <TableHead className="text-center w-16">View</TableHead>
                  <TableHead className="text-center w-16">Create</TableHead>
                  <TableHead className="text-center w-16">Edit</TableHead>
                  <TableHead className="text-center w-16">Delete</TableHead>
                  <TableHead className="text-right w-16 pr-3">Row</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPermissionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                      Loading permissions...
                    </TableCell>
                  </TableRow>
                ) : displayedMenus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                      No modules found matching &quot;{search}&quot;.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedMenus.map((item) => {
                    const isRoot = item.depth === 0
                    const isSubmenu = item.depth === 1
                    const perm = permissions[item.id] || {
                      canView: false,
                      canCreate: false,
                      canEdit: false,
                      canDelete: false,
                    }
                    const isRowAllChecked =
                      perm.canView && perm.canCreate && perm.canEdit && perm.canDelete

                    return (
                      <TableRow
                        key={item.id}
                        className={
                          isRoot
                            ? "bg-muted/40 font-semibold"
                            : isSubmenu
                            ? "bg-background font-medium"
                            : "bg-background/50 hover:bg-muted/20"
                        }
                      >
                        <TableCell>
                          <div
                            className="flex items-center gap-1.5"
                            style={{ paddingLeft: `${item.depth * 18}px` }}
                          >
                            {item.depth > 0 && (
                              <IconCornerDownRight className="size-3.5 shrink-0 text-muted-foreground/60" />
                            )}
                            <span
                              className={`truncate ${
                                isRoot
                                  ? "text-sm font-bold text-foreground"
                                  : isSubmenu
                                  ? "text-xs font-semibold text-foreground/90"
                                  : "text-xs text-foreground/75"
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          {isRoot ? (
                            <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px] font-semibold px-1.5 py-0">
                              Level 1
                            </Badge>
                          ) : isSubmenu ? (
                            <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/20 text-[10px] px-1.5 py-0">
                              Level 2
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0">
                              Level 3
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={perm.canView}
                              onCheckedChange={() => togglePermission(item.id, "canView")}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={perm.canCreate}
                              onCheckedChange={() => togglePermission(item.id, "canCreate")}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={perm.canEdit}
                              onCheckedChange={() => togglePermission(item.id, "canEdit")}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={perm.canDelete}
                              onCheckedChange={() => togglePermission(item.id, "canDelete")}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="text-right pr-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[11px] font-normal text-muted-foreground hover:text-foreground"
                            onClick={() => toggleRowAll(item.id)}
                          >
                            {isRowAllChecked ? "Clear" : "All"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="p-4 border-t gap-2 sm:gap-0 bg-muted/20">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl px-5"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
