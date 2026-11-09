import { prisma } from "../../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function str(value) {
  return String(value ?? "").trim()
}

export async function getAboutCoreValues(_req, res) {
  try {
    const rows = await prisma.aboutCoreValue.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    })
    res.json(rows)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch core values",
    })
  }
}

export async function getAboutCoreValueById(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid core value id" })

    const row = await prisma.aboutCoreValue.findUnique({ where: { id } })
    if (!row) return res.status(404).json({ message: "Core value not found" })

    res.json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch core value",
    })
  }
}

export async function createAboutCoreValue(req, res) {
  try {
    const title = str(req.body.title)
    const text = str(req.body.text)
    const icon = str(req.body.icon).toLowerCase()

    if (!title || !text || !icon) {
      return res.status(400).json({ message: "title, text, icon are required" })
    }

    const row = await prisma.aboutCoreValue.create({
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
        error instanceof Error ? error.message : "Failed to create core value",
    })
  }
}

export async function updateAboutCoreValue(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid core value id" })

    const data = {}
    if (req.body.title !== undefined) data.title = str(req.body.title)
    if (req.body.text !== undefined) data.text = str(req.body.text)
    if (req.body.icon !== undefined) data.icon = str(req.body.icon).toLowerCase()
    if (req.body.order !== undefined) data.order = Number(req.body.order) || 0

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    const row = await prisma.aboutCoreValue.update({ where: { id }, data })
    res.json(row)
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Core value not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update core value",
    })
  }
}

export async function deleteAboutCoreValue(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid core value id" })

    await prisma.aboutCoreValue.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Core value not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete core value",
    })
  }
}
