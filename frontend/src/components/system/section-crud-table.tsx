"use client"

import { useMemo, useState } from "react"
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"

import {
  createDataTableColumnHelper,
  DataTable,
} from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  HomeSectionTableConfig,
  SectionField,
  SectionRow,
} from "@/lib/home-section-tables"

const columnHelper = createDataTableColumnHelper<SectionRow>()

function emptyForm(fields: SectionField[]): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.key, ""]))
}

function rowToForm(row: SectionRow, fields: SectionField[]) {
  return Object.fromEntries(
    fields.map((field) => [field.key, String(row[field.key] ?? "")]),
  )
}

type SectionCrudTableProps = {
  title: string
  description: string
  config: HomeSectionTableConfig
}

export function SectionCrudTable({
  title,
  description,
  config,
}: SectionCrudTableProps) {
  const [rows, setRows] = useState<SectionRow[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(() => emptyForm(config.fields))

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm(config.fields))
    setOpen(true)
  }

  const openEdit = (row: SectionRow) => {
    setEditingId(row.id)
    setForm(rowToForm(row, config.fields))
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    setRows((current) => current.filter((row) => row.id !== id))
  }

  const handleSave = () => {
    const payload = Object.fromEntries(
      config.fields.map((field) => {
        const value = form[field.key] ?? ""
        if (field.type === "number") {
          return [field.key, Number(value) || 0]
        }
        return [field.key, value.trim()]
      }),
    )

    const requiredEmpty = config.fields.some((field) => {
      const value = payload[field.key]
      return value === "" || value === null || value === undefined
    })
    if (requiredEmpty) return

    if (editingId == null) {
      const nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1
      setRows((current) => [...current, { id: nextId, ...payload }])
    } else {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId ? { ...row, ...payload } : row,
        ),
      )
    }

    setOpen(false)
  }

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
        ...config.fields.slice(0, 4).map((field) =>
          columnHelper.accessor(field.key, {
            header: field.label,
            cell: ({ row }) => (
              <span className="block max-w-[240px] truncate font-medium text-slate-800 dark:text-slate-100">
                {String(row.original[field.key] ?? "")}
              </span>
            ),
          }),
        ),
        columnHelper.display({
          id: "actions",
          header: "Action",
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
                onClick={() => handleDelete(row.original.id)}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
          ),
        }),
      ]),
    [config.fields],
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <Button
          type="button"
          onClick={openCreate}
          className="rounded-lg px-5"
        >
          <IconPlus className="size-4" />
          Add {title}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        searchKey={config.searchKey}
        searchPlaceholder={`Search ${title.toLowerCase()}...`}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId == null ? `Add ${title}` : `Edit ${title}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {config.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    value={form[field.key] ?? ""}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    rows={4}
                    className="flex min-h-24 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type === "number" ? "number" : "text"}
                    value={form[field.key] ?? ""}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="h-11 rounded-xl"
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" className="rounded-xl" onClick={handleSave}>
              {editingId == null ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
