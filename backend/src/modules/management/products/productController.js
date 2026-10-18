import { prisma } from "../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function str(value) {
  return String(value ?? "").trim()
}

function slugify(value) {
  return str(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function parseFeatures(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          const [icon = "", title = "", ...rest] = item.split("|")
          return {
            icon: str(icon),
            title: str(title),
            description: str(rest.join("|")),
          }
        }
        return {
          icon: str(item?.icon),
          title: str(item?.title),
          description: str(item?.description),
        }
      })
      .filter((item) => item.title && item.description)
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [icon = "", title = "", ...rest] = line.split("|")
        return {
          icon: str(icon),
          title: str(title),
          description: str(rest.join("|")),
        }
      })
      .filter((item) => item.title && item.description)
  }

  return []
}

export async function getProducts(_req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    })
    res.json(products)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch products",
    })
  }
}

export async function getProductById(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid product id" })

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return res.status(404).json({ message: "Product not found" })

    res.json(product)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch product",
    })
  }
}

export async function getProductBySlug(req, res) {
  try {
    const slug = str(req.params.slug)
    if (!slug) return res.status(400).json({ message: "Invalid product slug" })

    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) return res.status(404).json({ message: "Product not found" })

    res.json(product)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch product",
    })
  }
}

export async function createProduct(req, res) {
  try {
    const title = str(req.body.title)
    const description = str(req.body.description)
    const slug = str(req.body.slug) || slugify(title)
    const features = parseFeatures(req.body.features)

    if (!title || !description || !slug) {
      return res.status(400).json({
        message: "title, slug, and description are required",
      })
    }

    if (features.length === 0) {
      return res.status(400).json({
        message: "At least one feature is required (icon|title|description)",
      })
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        features,
        order: req.body.order !== undefined ? Number(req.body.order) || 0 : 0,
      },
    })
    res.status(201).json(product)
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(400).json({ message: "Product slug already exists" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create product",
    })
  }
}

export async function updateProduct(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid product id" })

    const data = {}
    if (req.body.title !== undefined) data.title = str(req.body.title)
    if (req.body.slug !== undefined) data.slug = str(req.body.slug)
    if (req.body.description !== undefined) {
      data.description = str(req.body.description)
    }
    if (req.body.features !== undefined) {
      data.features = parseFeatures(req.body.features)
      if (data.features.length === 0) {
        return res.status(400).json({
          message: "At least one feature is required (icon|title|description)",
        })
      }
    }
    if (req.body.order !== undefined) data.order = Number(req.body.order) || 0

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    const product = await prisma.product.update({ where: { id }, data })
    res.json(product)
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Product not found" })
    }
    if (error?.code === "P2002") {
      return res.status(400).json({ message: "Product slug already exists" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update product",
    })
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid product id" })

    await prisma.product.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete product",
    })
  }
}
