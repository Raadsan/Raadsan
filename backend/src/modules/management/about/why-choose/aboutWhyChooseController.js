import { prisma } from "../../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function str(value) {
  return String(value ?? "").trim()
}

export async function getAboutWhyChoose(_req, res) {
  try {
    const rows = await prisma.aboutWhyChoose.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    })
    res.json(rows)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch why choose",
    })
  }
}

export async function getAboutWhyChooseById(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid why choose id" })

    const row = await prisma.aboutWhyChoose.findUnique({ where: { id } })
    if (!row) return res.status(404).json({ message: "Why choose not found" })

    res.json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch why choose",
    })
  }
}

export async function createAboutWhyChoose(req, res) {
  try {
    const title = str(req.body.title)
    const text = str(req.body.text)
    const icon = str(req.body.icon).toLowerCase()

    if (!title || !text || !icon) {
      return res.status(400).json({ message: "title, text, icon are required" })
    }

    const row = await prisma.aboutWhyChoose.create({
      data: {
        title,
        text,
        icon,
        order: req.body.order !== undefined ? Number(req.body.order) || 0 : 0,
      },
    })
    res.status(201).json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create why choose",
    })
  }
}

export async function updateAboutWhyChoose(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid why choose id" })

    const data = {}
    if (req.body.title !== undefined) data.title = str(req.body.title)
    if (req.body.text !== undefined) data.text = str(req.body.text)
    if (req.body.icon !== undefined) data.icon = str(req.body.icon).toLowerCase()
    if (req.body.order !== undefined) data.order = Number(req.body.order) || 0

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    const row = await prisma.aboutWhyChoose.update({ where: { id }, data })
    res.json(row)
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Why choose not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update why choose",
    })
  }
}

export async function deleteAboutWhyChoose(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid why choose id" })

    await prisma.aboutWhyChoose.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Why choose not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete why choose",
    })
  }
}
