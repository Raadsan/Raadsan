"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { mediaUrl, uploadsApi } from "@/api/uploads"
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

export type CrudField = {
  key: string
  label: string
  type?: "text" | "textarea" | "number" | "checkbox" | "list" | "image"
  placeholder?: string
  required?: boolean
  hideInTable?: boolean
  /** Half-width fields sit 2 per row on larger screens */
  half?: boolean
}

type CrudRow = {
  id: number
  [key: string]: unknown
}

type HomeApiCrudTableProps = {
  title: string
  description: string
  queryKey: readonly string[]
  searchKey: string
  fields: CrudField[]
  getAll: () => Promise<CrudRow[]>
  create: (payload: Record<string, unknown>) => Promise<unknown>
  update: (id: number, payload: Record<string, unknown>) => Promise<unknown>
  remove: (id: number) => Promise<unknown>
  /** Optional: map API row → form strings */
  toForm?: (row: CrudRow) => Record<string, string>
  /** Optional: map form → API payload */
  toPayload?: (form: Record<string, string>) => Record<string, unknown>
  /** Optional table cell override */
  getCellValue?: (row: CrudRow, key: string) => string
}

const columnHelper = createDataTableColumnHelper<CrudRow>()

function defaultToForm(row: CrudRow, fields: CrudField[]) {
  return Object.fromEntries(
    fields.map((field) => {
      const value = row[field.key]
      if (field.type === "list" && Array.isArray(value)) {
        return [field.key, value.join("\n")]
      }
      if (field.type === "checkbox") {
        return [field.key, value ? "true" : "false"]
      }
      return [field.key, value == null ? "" : String(value)]
    }),
  )
}

function defaultToPayload(form: Record<string, string>, fields: CrudField[]) {
  return Object.fromEntries(
    fields.map((field) => {
      const raw = form[field.key] ?? ""
      if (field.type === "number") return [field.key, Number(raw) || 0]
      if (field.type === "checkbox") return [field.key, raw === "true"]
      if (field.type === "list") {
        return [
          field.key,
          raw
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        ]
      }
      if (field.type === "image") {
        const value = raw.trim()
        // Optional images clear to null so the DB field is removed
        if (!value && field.required === false) return [field.key, null]
        return [field.key, value]
      }
      return [field.key, raw.trim()]
    }),
  )
}

export function HomeApiCrudTable({
  title,
  description,
  queryKey,
  searchKey,
  fields,
  getAll,
  create,
  update,
  remove,
  toForm,
  toPayload,
  getCellValue,
}: HomeApiCrudTableProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewing, setViewing] = useState<CrudRow | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.key, ""])),
  )
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  const { data = [], isLoading, error } = useQuery({
    queryKey: [...queryKey],
    queryFn: getAll,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [...queryKey] })

  const createMutation = useMutation({
    mutationFn: create,
    onSuccess: async () => {
      await invalidate()
      setOpen(false)
      toast.success(`${title} created`)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Record<string, unknown>
    }) => update(id, payload),
    onSuccess: async () => {
      await invalidate()
      setOpen(false)
      toast.success(`${title} updated`)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: remove,
    onSuccess: async () => {
      await invalidate()
      toast.success(`${title} deleted`)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openCreate = () => {
    setEditingId(null)
    setForm(Object.fromEntries(fields.map((field) => [field.key, ""])))
    setOpen(true)
  }

  const openEdit = (row: CrudRow) => {
    setEditingId(row.id)
    setForm(toForm ? toForm(row) : defaultToForm(row, fields))
    setOpen(true)
  }

  const openView = (row: CrudRow) => {
    setViewing(row)
    setViewOpen(true)
  }

  const formatViewValue = (row: CrudRow, field: CrudField) => {
    if (getCellValue) return getCellValue(row, field.key)
    const value = row[field.key]
    if (Array.isArray(value)) return value.join("\n")
    if (typeof value === "boolean") return value ? "Yes" : "No"
    return value == null || value === "" ? "—" : String(value)
  }

  const handleSave = () => {
    const payload = toPayload
      ? toPayload(form)
      : defaultToPayload(form, fields)

    const missing = fields.some((field) => {
      if (field.required === false) return false
      if (field.type === "checkbox" || field.type === "list") return false
      const value = payload[field.key]
      return value === "" || value == null
    })
    if (missing) {
      toast.error("Please fill required fields")
      return
    }

    if (editingId == null) createMutation.mutate(payload)
    else updateMutation.mutate({ id: editingId, payload })
  }

  const saving = createMutation.isPending || updateMutation.isPending
  const tableFields = fields.filter((field) => !field.hideInTable).slice(0, 4)

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
        ...tableFields.map((field) =>
          columnHelper.accessor(field.key, {
            header: field.label,
            cell: ({ row }) => {
              if (field.type === "image") {
                const src = mediaUrl(String(row.original[field.key] ?? ""))
                return src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="size-10 rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )
              }
              const text = getCellValue
                ? getCellValue(row.original, field.key)
                : (() => {
                    const value = row.original[field.key]
                    if (Array.isArray(value)) return value.join(", ")
                    if (typeof value === "boolean") return value ? "Yes" : "No"
                    return String(value ?? "")
                  })()
              return (
                <span className="block max-w-[240px] truncate font-medium">
                  {text}
                </span>
              )
            },
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
                className="size-8 text-emerald-600 hover:bg-emerald-600/10 hover:text-emerald-600"
                onClick={() => openView(row.original)}
              >
                <IconEye className="size-4" />
              </Button>
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
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (window.confirm(`Delete this ${title.toLowerCase()}?`)) {
                    deleteMutation.mutate(row.original.id)
                  }
                }}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
          ),
        }),
      ]),
    [tableFields, deleteMutation.isPending, title, getCellValue],
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
          className="rounded-lg px-5 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
          onClick={openCreate}
        >
          <IconPlus className="size-4" />
          Add {title}
        </Button>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {(error as Error).message || `Failed to load ${title.toLowerCase()}`}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={data}
        searchKey={searchKey}
        searchPlaceholder={`Search ${title.toLowerCase()}...`}
        loading={isLoading}
        emptyMessage={`No ${title.toLowerCase()} yet.`}
      />

      <Dialog
        open={viewOpen}
        onOpenChange={(next) => {
          setViewOpen(next)
          if (!next) setViewing(null)
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>View {title}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            {viewing
              ? fields.map((field) => (
                  <div
                    key={field.key}
                    className={`space-y-1.5 ${field.half ? "" : "sm:col-span-2"}`}
                  >
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {field.label}
                    </p>
                    {field.type === "image" ? (
                      mediaUrl(String(viewing[field.key] ?? "")) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mediaUrl(String(viewing[field.key] ?? ""))}
                          alt={field.label}
                          className="size-16 rounded-xl object-cover"
                        />
                      ) : (
                        <p className="text-sm font-medium">—</p>
                      )
                    ) : (
                      <p className="whitespace-pre-wrap text-sm font-medium">
                        {formatViewValue(viewing, field)}
                      </p>
                    )}
                  </div>
                ))
              : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setViewOpen(false)}
            >
              Close
            </Button>
            {viewing ? (
              <Button
                type="button"
                className="rounded-xl"
                onClick={() => {
                  setViewOpen(false)
                  openEdit(viewing)
                }}
              >
                Edit
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId == null ? `Add ${title}` : `Edit ${title}`}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.key}
                className={`space-y-2 ${field.half ? "" : "sm:col-span-2"}`}
              >
                {field.type === "checkbox" ? (
                  <>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <label
                      htmlFor={field.key}
                      className="flex h-11 items-center gap-2 text-sm font-medium"
                    >
                      <input
                        id={field.key}
                        type="checkbox"
                        checked={form[field.key] === "true"}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [field.key]: event.target.checked ? "true" : "false",
                          }))
                        }
                      />
                      Enabled
                    </label>
                  </>
                ) : field.type === "image" ? (
                  <>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <div className="flex items-center gap-3">
                      {form[field.key] ? (
                        <div className="relative size-12 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mediaUrl(form[field.key])}
                            alt=""
                            className="size-12 rounded-xl border object-cover"
                          />
                          <button
                            type="button"
                            aria-label={`Remove ${field.label}`}
                            disabled={uploadingKey === field.key}
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                [field.key]: "",
                              }))
                            }
                            className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600 disabled:opacity-50"
                          >
                            <span className="text-[11px] leading-none font-bold">
                              ×
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground">
                          No file
                        </div>
                      )}
                      <Input
                        id={field.key}
                        type="file"
                        accept="image/*"
                        disabled={uploadingKey === field.key}
                        className="h-11 min-w-0 flex-1 rounded-xl"
                        onChange={async (event) => {
                          const file = event.target.files?.[0]
                          if (!file) return
                          try {
                            setUploadingKey(field.key)
                            const uploaded = await uploadsApi.uploadImage(file)
                            setForm((current) => ({
                              ...current,
                              [field.key]: uploaded.url,
                            }))
                            toast.success("Image uploaded")
                          } catch (err) {
                            toast.error(
                              err instanceof Error
                                ? err.message
                                : "Upload failed",
                            )
                          } finally {
                            setUploadingKey(null)
                            event.target.value = ""
                          }
                        }}
                      />
                    </div>
                    {uploadingKey === field.key ? (
                      <p className="text-xs text-muted-foreground">Uploading…</p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.type === "textarea" || field.type === "list" ? (
                      <textarea
                        id={field.key}
                        value={form[field.key] ?? ""}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        rows={field.type === "list" ? 5 : 4}
                        placeholder={
                          field.placeholder ||
                          (field.type === "list"
                            ? "One item per line"
                            : undefined)
                        }
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
                        placeholder={field.placeholder}
                        className="h-11 rounded-xl"
                      />
                    )}
                  </>
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
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId == null
                  ? "Create"
                  : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
