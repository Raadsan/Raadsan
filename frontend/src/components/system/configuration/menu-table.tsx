"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  IconChevronDown,
  IconChevronRight,
  IconCornerDownRight,
  IconFolderPlus,
  IconLayersLinked,
  IconPencil,
  IconPlus,
  IconRoute,
  IconTrash,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { menuApi, type MenuItem, type MenuPayload } from "@/api/configuration/menu"
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
import {
  createDataTableColumnHelper,
  DataTable,
} from "@/components/ui/data-table"

type MenuLevel = "level1" | "level2" | "level3"

type FormState = {
  title: string
  url: string
  icon: string
  order: string
  parentId: string
}

const emptyForm: FormState = {
  title: "",
  url: "",
  icon: "",
  order: "0",
  parentId: "none",
}

function menuPayload(form: FormState, level: MenuLevel): MenuPayload {
  return {
    title: form.title.trim(),
    url: form.url.trim() || null,
    icon: form.icon.trim() || null,
    order: Number(form.order) || 0,
    parentId:
      level === "level1" || form.parentId === "none" ? null : Number(form.parentId),
  }
}

function changedMenuFields(next: MenuPayload, previous: MenuPayload) {
  const partial: Partial<MenuPayload> = {}
  for (const key of Object.keys(next) as (keyof MenuPayload)[]) {
    if (JSON.stringify(next[key]) !== JSON.stringify(previous[key])) {
      partial[key] = next[key]
    }
  }
  return partial
}

export type FlattenedMenuItem = MenuItem & {
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

const columnHelper = createDataTableColumnHelper<FlattenedMenuItem>()

export function MenuTable() {
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [baseline, setBaseline] = useState<FormState>(emptyForm)
  const [baselineLevel, setBaselineLevel] = useState<MenuLevel>("level1")
  const [form, setForm] = useState<FormState>(emptyForm)
  const [levelFilter, setLevelFilter] = useState<"all" | "level1" | "level2" | "level3">("all")

  const { data: menuTree = [], isLoading } = useQuery({
    queryKey: ["menus", "tree"],
    queryFn: menuApi.getTree,
  })

  const { data: flatMenus = [] } = useQuery({
    queryKey: ["menus", "flat"],
    queryFn: menuApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (payload: MenuPayload) => menuApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] })
      toast.success("Menu created successfully")
      setOpen(false)
      setForm(emptyForm)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to create menu")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<MenuPayload> }) =>
      menuApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] })
      toast.success("Menu updated successfully")
      setOpen(false)
      setForm(emptyForm)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to update menu")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: menuApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] })
      toast.success("Menu deleted")
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to delete menu")
    },
  })

  const flattenedItems = useMemo(() => {
    return flattenMenuTree(menuTree)
  }, [menuTree])

  // Count by level
  const counts = useMemo(() => {
    const l1 = flattenedItems.filter((m) => m.depth === 0).length
    const l2 = flattenedItems.filter((m) => m.depth === 1).length
    const l3 = flattenedItems.filter((m) => m.depth >= 2).length
    return { all: flattenedItems.length, l1, l2, l3 }
  }, [flattenedItems])

  // Filtered items based on active level tab
  const filteredData = useMemo(() => {
    if (levelFilter === "level1") {
      return flattenedItems.filter((m) => m.depth === 0)
    }
    if (levelFilter === "level2") {
      return flattenedItems.filter((m) => m.depth === 1)
    }
    if (levelFilter === "level3") {
      return flattenedItems.filter((m) => m.depth >= 2)
    }
    return flattenedItems
  }, [flattenedItems, levelFilter])

  const [selectedLevel, setSelectedLevel] = useState<MenuLevel>("level1")

  const filteredParentOptions = useMemo(() => {
    if (selectedLevel === "level2") {
      // ONLY Level 1 items (Main Menus: Dashboard, Management, Configuration)
      return flattenedItems.filter((m) => m.depth === 0 && m.id !== editingId)
    }
    if (selectedLevel === "level3") {
      // ONLY Level 2 items (Submenus: Home, About, Products, Contacts)
      return flattenedItems.filter((m) => m.depth === 1 && m.id !== editingId)
    }
    return []
  }, [flattenedItems, selectedLevel, editingId])

  const handleLevelSelect = (level: MenuLevel) => {
    setSelectedLevel(level)
    if (level === "level1") {
      setForm((prev) => ({
        ...prev,
        parentId: "none",
      }))
    } else if (level === "level2") {
      const l1Items = flattenedItems.filter((m) => m.depth === 0 && m.id !== editingId)
      const currentParentIsL1 = l1Items.some((m) => String(m.id) === form.parentId)
      setForm((prev) => ({
        ...prev,
        parentId: currentParentIsL1 ? prev.parentId : (l1Items[0] ? String(l1Items[0].id) : "none"),
      }))
    } else if (level === "level3") {
      const l2Items = flattenedItems.filter((m) => m.depth === 1 && m.id !== editingId)
      const currentParentIsL2 = l2Items.some((m) => String(m.id) === form.parentId)
      setForm((prev) => ({
        ...prev,
        parentId: currentParentIsL2 ? prev.parentId : (l2Items[0] ? String(l2Items[0].id) : "none"),
      }))
    }
  }

  const openCreate = (parentId?: number) => {
    setEditingId(null)
    if (parentId) {
      const parent = flattenedItems.find((m) => m.id === parentId)
      if (parent && parent.depth === 0) {
        setSelectedLevel("level2")
      } else {
        setSelectedLevel("level3")
      }
      setForm({
        ...emptyForm,
        parentId: String(parentId),
      })
    } else {
      setSelectedLevel("level1")
      setForm({
        ...emptyForm,
        parentId: "none",
      })
    }
    setOpen(true)
  }

  const openEdit = (item: FlattenedMenuItem) => {
    const level: MenuLevel =
      item.depth === 0 ? "level1" : item.depth === 1 ? "level2" : "level3"
    const next: FormState = {
      title: item.title,
      url: item.url ?? "",
      icon: item.icon ?? "",
      order: String(item.order ?? 0),
      parentId: item.parentId ? String(item.parentId) : "none",
    }
    setEditingId(item.id)
    setSelectedLevel(level)
    setBaselineLevel(level)
    setForm(next)
    setBaseline(next)
    setOpen(true)
  }

  const handleSave = () => {
    if (editingId == null) {
      if (!form.title.trim()) {
        toast.error("Menu title is required")
        return
      }
      if (selectedLevel !== "level1" && form.parentId === "none") {
        toast.error(
          `Please select a parent menu for this ${
            selectedLevel === "level2" ? "Level 2 submenu" : "Level 3 sub-item"
          }`,
        )
        return
      }
      createMutation.mutate(menuPayload(form, selectedLevel))
      return
    }

    const partial = changedMenuFields(
      menuPayload(form, selectedLevel),
      menuPayload(baseline, baselineLevel),
    )
    if (partial.title !== undefined && !String(partial.title).trim()) {
      delete partial.title
    }
    if (Object.keys(partial).length === 0) {
      toast.error("No changes to save")
      return
    }
    updateMutation.mutate({ id: editingId, payload: partial })
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
        columnHelper.accessor("title", {
          header: "Menu Title",
          cell: ({ row }) => {
            const item = row.original
            const indent = levelFilter === "all" ? item.depth * 20 : 0
            return (
              <div
                className="flex items-center gap-2"
                style={{ paddingLeft: `${indent}px` }}
              >
                {levelFilter === "all" && item.depth > 0 && (
                  <IconCornerDownRight className="size-4 shrink-0 text-muted-foreground/60" />
                )}
                <span
                  className={
                    item.depth === 0
                      ? "font-semibold text-slate-900 dark:text-slate-100"
                      : "text-slate-700 dark:text-slate-300"
                  }
                >
                  {item.title}
                </span>
                {item.children && item.children.length > 0 && (
                  <Badge variant="secondary" className="rounded-full text-[11px] px-2 font-normal">
                    {item.children.length} sub
                  </Badge>
                )}
              </div>
            )
          },
        }),
        columnHelper.display({
          id: "level",
          header: "Level",
          cell: ({ row }) => {
            const item = row.original
            if (item.depth === 0) {
              return (
                <Badge className="bg-primary text-primary-foreground font-semibold text-xs shadow-xs">
                  Level 1 (Main Menu)
                </Badge>
              )
            }
            if (item.depth === 1) {
              return (
                <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/20 text-xs">
                  Level 2 (Submenu)
                </Badge>
              )
            }
            return (
              <Badge variant="outline" className="text-muted-foreground text-xs">
                Level 3 (Sub-item)
              </Badge>
            )
          },
        }),
        columnHelper.display({
          id: "parent",
          header: "Parent Menu",
          cell: ({ row }) => {
            const item = row.original
            if (!item.parentId || !item.parent) {
              return (
                <span className="text-xs text-muted-foreground font-medium italic">
                  Root (Top Level)
                </span>
              )
            }
            return (
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.parent.title}
              </span>
            )
          },
        }),
        columnHelper.accessor("url", {
          header: "Route / URL",
          cell: ({ row }) => (
            <span className="block max-w-[240px] truncate font-mono text-xs text-muted-foreground">
              {row.original.url ?? <span className="italic opacity-50">None</span>}
            </span>
          ),
        }),
        columnHelper.accessor("order", {
          header: "Order",
          cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
              {row.original.order}
            </span>
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
    [deleteMutation.isPending, levelFilter],
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Configuration
            </Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Menu</h2>
          <p className="text-sm text-muted-foreground">
            Configure navigation menus available in the admin panel.
          </p>
        </div>
        <Button type="button" onClick={() => openCreate()} className="rounded-lg px-5">
          <IconPlus className="size-4" />
          Add menu
        </Button>
      </div>

      {/* Main Table Card using DataTable */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Menu List</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading menus..."
                  : `${filteredData.length} menu${filteredData.length !== 1 ? "s" : ""} shown`}
              </CardDescription>
            </div>

            {/* Level Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setLevelFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  levelFilter === "all"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter("level1")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  levelFilter === "level1"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Level 1: Main Menus ({counts.l1})
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter("level2")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  levelFilter === "level2"
                    ? "bg-sky-500 text-white shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Level 2: Submenus ({counts.l2})
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter("level3")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  levelFilter === "level3"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Level 3: Sub-items ({counts.l3})
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            searchKey="title"
            searchPlaceholder="Search menus..."
          />
        </CardContent>
      </Card>

      {/* Add / Edit Dialog matching user Image 1 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto w-[92vw] max-w-xl sm:max-w-2xl">
          <DialogHeader className="pb-3 border-b">
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingId == null ? "Add New Menu" : "Edit Menu"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Level Selector: 1-click Level 1, Level 2, Level 3 */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Menu Level
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleLevelSelect("level1")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                    selectedLevel === "level1"
                      ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary shadow-xs"
                      : "border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <span className="text-xs font-bold">Level 1</span>
                  <span className="text-[11px] text-muted-foreground">Main Menu (Root)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLevelSelect("level2")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                    selectedLevel === "level2"
                      ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary shadow-xs"
                      : "border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <span className="text-xs font-bold">Level 2</span>
                  <span className="text-[11px] text-muted-foreground">Submenu</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLevelSelect("level3")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                    selectedLevel === "level3"
                      ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary shadow-xs"
                      : "border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <span className="text-xs font-bold">Level 3</span>
                  <span className="text-[11px] text-muted-foreground">Sub-item (Leaf)</span>
                </button>
              </div>
            </div>

            {/* Row 1: Menu Title & Icon Name in 2 columns (exact Image 1 layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menu-title">
                  Menu Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="menu-title"
                  placeholder="e.g. Analytics, Settings"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="menu-icon">Icon Name</Label>
                <Input
                  id="menu-icon"
                  placeholder="e.g., settings, dashboard"
                  value={form.icon}
                  onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Row 2: URL Path (exact Image 1 layout) */}
            <div className="space-y-2">
              <Label htmlFor="menu-url">URL Path</Label>
              <Input
                id="menu-url"
                placeholder="/path/to/page"
                value={form.url}
                onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                className="h-11 rounded-xl font-mono text-xs"
              />
            </div>

            {/* Parent Menu: Only shown when Level 2 or Level 3 is selected */}
            {selectedLevel !== "level1" && (
              <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                <Label htmlFor="menu-parent" className="font-semibold text-primary text-xs">
                  {selectedLevel === "level2"
                    ? "Select Parent Main Menu (Level 1)"
                    : "Select Parent Submenu (Level 2)"}
                  <span className="text-destructive"> *</span>
                </Label>
                <Select
                  value={form.parentId}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, parentId: val }))}
                >
                  <SelectTrigger id="menu-parent" className="h-11 rounded-xl w-full bg-background">
                    <SelectValue
                      placeholder={
                        selectedLevel === "level2"
                          ? "Select a Level 1 Main Menu"
                          : "Select a Level 2 Submenu"
                      }
                      className="truncate text-left"
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredParentOptions.map((parent) => (
                      <SelectItem key={parent.id} value={String(parent.id)}>
                        {parent.title}
                        <span className="text-xs text-muted-foreground ml-2">
                          (Level {parent.depth + 1})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-5"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
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
