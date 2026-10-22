"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { usersApi } from "@/api/configuration/users"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createDataTableColumnHelper, DataTable } from "@/components/ui/data-table"

type User = {
  id: number
  fullName: string
  email: string
  roleId: number
  role: { id: number; name: string }
  createdAt: string
  updatedAt: string
}

type FormState = {
  fullName: string
  email: string
  password: string
  confirmPass: string
  roleId: string
}

const emptyForm: FormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPass: "",
  roleId: "",
}

const columnHelper = createDataTableColumnHelper<User>()

export function UsersTable() {
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
  })

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: rolesApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (payload: FormState) =>
      usersApi.create({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        confirmPass: payload.confirmPass,
        roleId: Number(payload.roleId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User created successfully")
      setOpen(false)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to create user")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormState }) =>
      usersApi.update(id, {
        fullName: payload.fullName || undefined,
        email: payload.email || undefined,
        password: payload.password || undefined,
        confirmPass: payload.confirmPass || undefined,
        roleId: payload.roleId ? Number(payload.roleId) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User updated successfully")
      setOpen(false)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to update user")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User deleted")
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to delete user")
    },
  })

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingId(user.id)
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      confirmPass: "",
      roleId: String(user.roleId),
    })
    setOpen(true)
  }

  const handleSave = () => {
    if (!form.fullName.trim()) { toast.error("Full name is required"); return }
    if (!form.email.trim()) { toast.error("Email is required"); return }
    if (!form.roleId) { toast.error("Role is required"); return }
    if (editingId == null) {
      if (!form.password) { toast.error("Password is required"); return }
      if (form.password !== form.confirmPass) { toast.error("Passwords do not match"); return }
    }
    if (editingId == null) {
      createMutation.mutate(form)
    } else {
      updateMutation.mutate({ id: editingId, payload: form })
    }
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
        columnHelper.accessor("fullName", {
          header: "Full Name",
          cell: ({ row }) => (
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {row.original.fullName}
            </span>
          ),
        }),
        columnHelper.accessor("email", {
          header: "Email",
          cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.email}</span>
          ),
        }),
        columnHelper.display({
          id: "role",
          header: "Role",
          cell: ({ row }) => (
            <Badge variant="secondary" className="rounded-full">
              {row.original.role?.name ?? "—"}
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
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage admin users and assign them to roles.
          </p>
        </div>
        <Button type="button" onClick={openCreate} className="rounded-lg px-5">
          <IconPlus className="size-4" />
          Add user
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>
            {isLoading ? "Loading users..." : `${users.length} user${users.length !== 1 ? "s" : ""} registered`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchKey="fullName"
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId == null ? "Add User" : "Edit User"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="user-fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-fullName"
                placeholder="e.g. Ahmed Hassan"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-email"
                type="email"
                autoComplete="off"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.roleId}
                onValueChange={(val) => setForm((prev) => ({ ...prev, roleId: val }))}
              >
                <SelectTrigger id="user-role" className="h-11 rounded-xl">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role: { id: number; name: string }) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-password">
                Password{editingId != null && <span className="ml-1 text-muted-foreground text-xs">(leave blank to keep current)</span>}
                {editingId == null && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                id="user-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-confirmPass">
                Confirm Password{editingId == null && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                id="user-confirmPass"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirmPass}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPass: e.target.value }))}
                className="h-11 rounded-xl"
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
