"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { productsApi } from "@/api/products/products"
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
import { iconFromFeatureTitle } from "@/lib/product-feature-icons"

type ProductFeature = {
  icon: string
  title: string
  description: string
}

type Product = {
  id: number
  title: string
  slug: string
  description: string
  features: ProductFeature[]
  order: number
}

type FormState = {
  order: string
  title: string
  slug: string
  description: string
  features: ProductFeature[]
}

const emptyFeature: ProductFeature = {
  icon: "monitor",
  title: "",
  description: "",
}

const emptyForm: FormState = {
  order: "0",
  title: "",
  slug: "",
  description: "",
  features: [{ ...emptyFeature }],
}

function normalizeFeatures(features: unknown): ProductFeature[] {
  if (!Array.isArray(features) || features.length === 0) {
    return [{ ...emptyFeature }]
  }
  return features.map((item) => {
    const row = (item || {}) as ProductFeature
    return {
      icon: String(row.icon || "monitor"),
      title: String(row.title || ""),
      description: String(row.description || ""),
    }
  })
}

type Props = { title?: string; description?: string }

export function ProductsTable({
  title = "Products",
  description = "Register products shown in the website Products menu. Starts empty until you add one.",
}: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [search, setSearch] = useState("")

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getAll() as Promise<Product[]>,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["products"] })

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: async () => {
      await invalidate()
      setOpen(false)
      toast.success("Product created")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create"),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Record<string, unknown>
    }) => productsApi.update(id, payload),
    onSuccess: async () => {
      await invalidate()
      setOpen(false)
      toast.success("Product updated")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update"),
  })

  const deleteMutation = useMutation({
    mutationFn: productsApi.remove,
    onSuccess: async () => {
      await invalidate()
      toast.success("Product deleted")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete"),
  })

  const products = useMemo(() => {
    const rows = Array.isArray(data) ? data : []
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    )
  }, [data, search])

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, features: [{ ...emptyFeature }] })
    setOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingId(product.id)
    setForm({
      order: String(product.order ?? 0),
      title: product.title ?? "",
      slug: product.slug ?? "",
      description: product.description ?? "",
      features: normalizeFeatures(product.features),
    })
    setOpen(true)
  }

  const updateFeature = (
    index: number,
    key: keyof ProductFeature,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      features: current.features.map((feature, i) => {
        if (i !== index) return feature
        if (key === "title") {
          return {
            ...feature,
            title: value,
            // Auto-pick icon from the feature title for the website
            icon: iconFromFeatureTitle(value, feature.icon || "monitor"),
          }
        }
        return { ...feature, [key]: value }
      }),
    }))
  }

  const addFeature = () => {
    setForm((current) => ({
      ...current,
      features: [...current.features, { ...emptyFeature }],
    }))
  }

  const removeFeature = (index: number) => {
    setForm((current) => {
      const next = current.features.filter((_, i) => i !== index)
      return {
        ...current,
        features: next.length > 0 ? next : [{ ...emptyFeature }],
      }
    })
  }

  const handleSave = () => {
    const titleValue = form.title.trim()
    const slugValue = form.slug.trim()
    const descriptionValue = form.description.trim()
    const features = form.features
      .map((feature) => {
        const title = feature.title.trim()
        return {
          icon: (
            feature.icon.trim() || iconFromFeatureTitle(title, "monitor")
          ).trim(),
          title,
          description: feature.description.trim(),
        }
      })
      .filter((feature) => feature.title && feature.description)

    if (!titleValue || !slugValue || !descriptionValue) {
      toast.error("Please fill required fields")
      return
    }
    if (features.length === 0) {
      toast.error("Add at least one feature with title and description")
      return
    }

    const payload = {
      order: Number(form.order) || 0,
      title: titleValue,
      slug: slugValue,
      description: descriptionValue,
      features,
    }

    if (editingId == null) createMutation.mutate(payload)
    else updateMutation.mutate({ id: editingId, payload })
  }

  const saving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-secondary/40 bg-secondary/15 text-foreground"
          >
            Management / Products
          </Badge>
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
          Add Product
        </Button>
      </div>

      <div className="flex justify-end">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          className="h-10 max-w-xs rounded-xl"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {(error as Error).message || "Failed to load products"}
        </p>
      ) : null}

      {isLoading ? (
        <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
          Loading products…
        </p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
          No products yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const featureCount = Array.isArray(product.features)
              ? product.features.length
              : 0
            return (
              <Card
                key={product.id}
                className="border-border/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg leading-snug">
                      {product.title}
                    </CardTitle>
                    <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      #{String(product.id).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    /{product.slug} · {featureCount} features
                  </p>
                  <CardDescription className="line-clamp-3">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => openEdit(product)}
                  >
                    <IconPencil className="size-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (window.confirm("Delete this product?")) {
                        deleteMutation.mutate(product.id)
                      }
                    }}
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-h-[85vh] overflow-y-auto sm:max-w-3xl"
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {editingId == null ? "Add Product" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    order: event.target.value,
                  }))
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                placeholder="ecommerce"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: event.target.value,
                  }))
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={3}
                className="flex min-h-20 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-3 sm:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <Label>Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={addFeature}
                >
                  <IconPlus className="size-4" />
                  Add feature
                </Button>
              </div>

              <div className="hidden grid-cols-[140px_1fr_1.4fr_40px] gap-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:grid">
                <span>Icon</span>
                <span>Title</span>
                <span>Description</span>
                <span />
              </div>

              <div className="space-y-3">
                {form.features.map((feature, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-2 rounded-xl border border-border/70 p-3 sm:grid-cols-[140px_1fr_1.4fr_40px] sm:items-start sm:border-0 sm:p-0"
                  >
                    <div className="space-y-1.5">
                      <Label className="sm:hidden">Icon</Label>
                      <Input
                        value={feature.icon}
                        placeholder="monitor"
                        onChange={(event) =>
                          updateFeature(index, "icon", event.target.value)
                        }
                        className="h-11 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="sm:hidden">Title</Label>
                      <Input
                        value={feature.title}
                        placeholder="Feature title"
                        onChange={(event) =>
                          updateFeature(index, "title", event.target.value)
                        }
                        className="h-11 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="sm:hidden">Description</Label>
                      <Input
                        value={feature.description}
                        placeholder="Feature description"
                        onChange={(event) =>
                          updateFeature(
                            index,
                            "description",
                            event.target.value,
                          )
                        }
                        className="h-11 rounded-xl"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-11 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeFeature(index)}
                      aria-label="Remove feature"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
