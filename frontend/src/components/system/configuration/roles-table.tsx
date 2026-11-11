"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { rolesApi } from "@/api/configuration/roles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createDataTableColumnHelper, DataTable } from "@/components/ui/data-table"

type Role = {
  id: number
  name: string
  description: string | null
  _count: { users: number }
  createdAt: string
  updatedAt: string
}

type FormState = {
  name: string
  description: string
}

const emptyForm: FormState = { name: "", description: "" }

const columnHelper = createDataTableColumnHelper<Role>()

export function RolesTable() {
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [baseline, setBaseline] = useState<FormState>(emptyForm)
  const [form, setForm] = useState<FormState>(emptyForm)

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: rolesApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (payload: FormState) =>
      rolesApi.create({ name: payload.name, description: payload.description || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Role created successfully")
      setOpen(false)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to create role")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: { name?: string; description?: string | null }
    }) => rolesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Role updated successfully")
      setOpen(false)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to update role")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: rolesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Role deleted")
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to delete role")
    },
  })

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (role: Role) => {
    const next = { name: role.name, description: role.description ?? "" }
    setEditingId(role.id)
    setForm(next)
    setBaseline(next)
    setOpen(true)
  }

  const handleSave = () => {
    if (editingId == null) {
      if (!form.name.trim()) {
        toast.error("Role name is required")
        return
      }
      createMutation.mutate(form)
      return
    }

    const payload: { name?: string; description?: string | null } = {}
    if (form.name.trim() && form.name.trim() !== baseline.name.trim()) {
      payload.name = form.name.trim()
    }
    if ((form.description ?? "") !== (baseline.description ?? "")) {
      payload.description = form.description.trim() || null
    }
    if (Object.keys(payload).length === 0) {
      toast.error("No changes to save")
      return
    }
    updateMutation.mutate({ id: editingId, payload })
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: "no",
          header: "No",
          cell: ({ row }) => (
            <span className="font-bold text-primary">
              #{String(row.original.id).padStart(2, "0")}
            </span>
          ),
        }),
        columnHelper.accessor("name", {
          header: "Role Name",
          cell: ({ row }) => (
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {row.original.name}
            </span>
          ),
        }),
        columnHelper.accessor("description", {
          header: "Description",
          cell: ({ row }) => (
            <span className="block max-w-[320px] truncate text-muted-foreground">
              {row.original.description ?? <span className="italic opacity-50">No description</span>}
            </span>
          ),
        }),
        columnHelper.display({
          id: "users",
          header: "Users",
          cell: ({ row }) => (
            <Badge variant="secondary" className="rounded-full">
              {row.original._count?.users ?? 0} user{(row.original._count?.users ?? 0) !== 1 ? "s" : ""}
            </Badge>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => openEdit(row.original)}
              >
                <IconPencil className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => deleteMutation.mutate(row.original.id)}
                disabled={deleteMutation.isPending}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
          ),
        }),
      ]),
    [],
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Configuration</Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Roles</h2>
          <p className="text-sm text-muted-foreground">
            Define admin roles and access levels for your team.
          </p>
        </div>
        <Button type="button" onClick={openCreate} className="rounded-lg px-5">
          <IconPlus className="size-4" />
          Add role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles List</CardTitle>
          <CardDescription>
            {isLoading ? "Loading roles..." : `${roles.length} role${roles.length !== 1 ? "s" : ""} configured`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={roles}
            searchKey="name"
            searchPlaceholder="Search roles..."
          />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId == null ? "Add Role" : "Edit Role"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="role-name">
                Role Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role-name"
                placeholder="e.g. Administrator"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <textarea
                id="role-description"
                placeholder="Briefly describe what this role can do..."
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="flex min-h-20 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : editingId == null ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
