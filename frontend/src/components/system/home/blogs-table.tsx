"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { blogsApi } from "@/api/home/blogs"
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

type Blog = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  hashtags: string[]
  categoryId: number
  category?: { id: number; title: string; slug: string }
  date: string
  readTime: string
  author: string
  image: string
  order: number
}

type BlogForm = {
  title: string
  slug: string
  excerpt: string
  content: string
  categoryId: string
  date: string
  readTime: string
  author: string
  image: string
  order: string
}

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  categoryId: "",
  date: "",
  readTime: "",
  author: "",
  image: "",
  order: "0",
}

function parseHashtags(value: string) {
  return value
    .split(/[\s,]+/)
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean)
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Split trailing #tags from article body (Deero-style paste). */
function splitContentAndHashtags(raw: string) {
  const text = raw.trim()
  if (!text) return { content: "", hashtags: [] as string[] }

  const lines = text.split(/\n/)
  const tagLines: string[] = []
  let end = lines.length

  while (end > 0) {
    const line = lines[end - 1].trim()
    if (!line) {
      end -= 1
      continue
    }
    if (/^(#[\w-]+\s*)+$/.test(line)) {
      tagLines.unshift(line)
      end -= 1
      continue
    }
    break
  }

  return {
    content: lines.slice(0, end).join("\n").trim(),
    hashtags: parseHashtags(tagLines.join(" ")),
  }
}

function blogPayload(form: BlogForm) {
  const title = form.title.trim()
  const split = splitContentAndHashtags(form.content)
  return {
    title,
    slug: form.slug.trim() || toSlug(title),
    excerpt: form.excerpt.trim() || firstParagraph(split.content),
    content: split.content,
    hashtags: split.hashtags,
    categoryId: Number(form.categoryId),
    date: form.date,
    readTime: form.readTime.trim() || "5 min read",
    author: form.author.trim(),
    image: form.image.trim(),
    order: Number(form.order) || 0,
  }
}

function changedFields<T extends Record<string, unknown>>(next: T, previous: T) {
  const partial: Partial<T> = {}
  for (const key of Object.keys(next) as (keyof T)[]) {
    if (JSON.stringify(next[key]) !== JSON.stringify(previous[key])) {
      partial[key] = next[key]
    }
  }
  return partial
}

function firstParagraph(value: string) {
  return (
    value
      .split(/\n+/)
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith("#")) ?? ""
  ).slice(0, 280)
}

const columnHelper = createDataTableColumnHelper<Blog>()
const BLOGS_KEY = ["blogs"] as const

type Props = { title: string; description: string }

export function BlogsTable({ title, description }: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewing, setViewing] = useState<Blog | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [baseline, setBaseline] = useState<BlogForm>(emptyForm)
  const [form, setForm] = useState<BlogForm>(emptyForm)
  const [uploadingImage, setUploadingImage] = useState(false)

  const { data = [], isLoading, error } = useQuery({
    queryKey: BLOGS_KEY,
    queryFn: () => blogsApi.getAll(),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => blogsApi.getCategories(),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: BLOGS_KEY })

  const createMutation = useMutation({
    mutationFn: blogsApi.create,
    onSuccess: async () => {
      await invalidate()
      setOpen(false)
      toast.success("Blog created")
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
    }) => blogsApi.update(id, payload as Record<string, unknown>),
    onSuccess: async () => {
      await invalidate()
      setOpen(false)
      toast.success("Blog updated")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: blogsApi.remove,
    onSuccess: async () => {
      await invalidate()
      toast.success("Blog deleted")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...emptyForm,
      categoryId: categories[0] ? String(categories[0].id) : "",
      date: new Date().toISOString().slice(0, 10),
    })
    setOpen(true)
  }

  const openEdit = (row: Blog) => {
    const next: BlogForm = {
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: [
        row.content ?? "",
        Array.isArray(row.hashtags) && row.hashtags.length
          ? row.hashtags.map((tag) => `#${String(tag).replace(/^#/, "")}`).join(" ")
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
      categoryId: String(row.categoryId),
      date: row.date ? String(row.date).slice(0, 10) : "",
      readTime: row.readTime,
      author: row.author,
      image: row.image,
      order: String(row.order ?? 0),
    }
    setEditingId(row.id)
    setForm(next)
    setBaseline(next)
    setOpen(true)
  }

  const openView = (row: Blog) => {
    setViewing(row)
    setViewOpen(true)
  }

  const handleSave = () => {
    const payload = blogPayload(form)

    if (editingId == null) {
      if (
        !payload.title ||
        !payload.slug ||
        !payload.excerpt ||
        !payload.content ||
        !payload.categoryId ||
        !payload.date ||
        !payload.author ||
        !payload.image
      ) {
        toast.error(
          "Title, content, category, date, author, and image are required",
        )
        return
      }
      createMutation.mutate(payload)
      return
    }

    const partial = changedFields(payload, blogPayload(baseline))
    if (Object.keys(partial).length === 0) {
      toast.error("No changes to save")
      return
    }
    updateMutation.mutate({ id: editingId, payload: partial })
  }

  const saving = createMutation.isPending || updateMutation.isPending

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
        columnHelper.accessor("order", { header: "Order" }),
        columnHelper.accessor("title", { header: "Title" }),
        columnHelper.display({
          id: "category",
          header: "Category",
          cell: ({ row }) => row.original.category?.title ?? "-",
        }),
        columnHelper.accessor("author", { header: "Author" }),
        columnHelper.accessor("readTime", { header: "Read Time" }),
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
                  if (window.confirm("Delete this blog?")) {
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
    [deleteMutation.isPending],
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
          {(error as Error).message || "Failed to load blogs"}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search blogs..."
        loading={isLoading}
        emptyMessage="No blogs yet."
      />

      <Dialog
        open={viewOpen}
        onOpenChange={(next) => {
          setViewOpen(next)
          if (!next) setViewing(null)
        }}
      >
        <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>View {title}</DialogTitle>
          </DialogHeader>

          {viewing ? (
            <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Order
                </p>
                <p className="text-sm font-medium">{viewing.order ?? 0}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Category
                </p>
                <p className="text-sm font-medium">
                  {viewing.category?.title ?? "—"}
                </p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Title
                </p>
                <p className="text-sm font-medium">{viewing.title}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Slug
                </p>
                <p className="text-sm font-medium">{viewing.slug}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Author
                </p>
                <p className="text-sm font-medium">{viewing.author}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Read Time
                </p>
                <p className="text-sm font-medium">{viewing.readTime}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Date
                </p>
                <p className="text-sm font-medium">
                  {viewing.date ? String(viewing.date).slice(0, 10) : "—"}
                </p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Image
                </p>
                {viewing.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(viewing.image)}
                    alt={viewing.title}
                    className="h-32 w-full max-w-sm rounded-xl border object-cover"
                  />
                ) : (
                  <p className="text-sm font-medium">—</p>
                )}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Excerpt
                </p>
                <p className="whitespace-pre-wrap text-sm font-medium">
                  {viewing.excerpt || "—"}
                </p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Hashtags
                </p>
                <p className="text-sm font-medium">
                  {Array.isArray(viewing.hashtags) && viewing.hashtags.length
                    ? viewing.hashtags.map((tag) => `#${tag}`).join(" ")
                    : "—"}
                </p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Content
                </p>
                <p className="max-h-64 overflow-y-auto whitespace-pre-wrap text-sm font-medium">
                  {viewing.content || "—"}
                </p>
              </div>
            </div>
          ) : null}

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
        <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingId == null ? `Add ${title}` : `Edit ${title}`}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm((c) => ({ ...c, order: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                value={form.categoryId}
                onChange={(e) =>
                  setForm((c) => ({ ...c, categoryId: e.target.value }))
                }
                className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((category: { id: number; title: string }) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => setForm((c) => ({ ...c, author: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                value={form.readTime}
                onChange={(e) =>
                  setForm((c) => ({ ...c, readTime: e.target.value }))
                }
                placeholder="5 min read"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center gap-3">
                {form.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(form.image)}
                    alt=""
                    className="size-11 shrink-0 rounded-xl border object-cover"
                  />
                ) : (
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-dashed text-[10px] text-muted-foreground">
                    No file
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  className="h-11 min-w-0 flex-1 rounded-xl"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      setUploadingImage(true)
                      const uploaded = await uploadsApi.uploadImage(file)
                      setForm((c) => ({ ...c, image: uploaded.url }))
                      toast.success("Image uploaded")
                    } catch (err) {
                      toast.error(
                        err instanceof Error ? err.message : "Upload failed",
                      )
                    } finally {
                      setUploadingImage(false)
                      e.target.value = ""
                    }
                  }}
                />
              </div>
              {uploadingImage ? (
                <p className="text-xs text-muted-foreground">Uploading…</p>
              ) : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) =>
                  setForm((c) => ({ ...c, excerpt: e.target.value }))
                }
                rows={3}
                placeholder="Short summary shown on blog cards"
                className="flex min-h-20 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="content">Content</Label>
              <p className="text-xs text-muted-foreground">
                Paste the full article here. Put hashtags only at the end of
                this field (e.g.{" "}
                <code className="rounded bg-muted px-1">
                  #MotionGraphics #BrandMarketing
                </code>
                ) — they are saved automatically. No other hashtags field needed.
              </p>
              <textarea
                id="content"
                value={form.content}
                onChange={(e) =>
                  setForm((c) => ({ ...c, content: e.target.value }))
                }
                rows={16}
                placeholder={`In today’s fast-paced digital world...

## Enhancing Brand Awareness

One of the biggest advantages of motion graphics...

## Conclusion

As digital marketing continues to evolve...

#MotionGraphics #BrandMarketing #DigitalMarketing #ContentMarketing`}
                className="flex min-h-72 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm leading-relaxed"
              />
            </div>
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
              disabled={saving || uploadingImage}
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
