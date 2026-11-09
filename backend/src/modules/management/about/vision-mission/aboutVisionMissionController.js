import { prisma } from "../../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function str(value) {
  return String(value ?? "").trim()
}

function normalizeType(type) {
  const value = str(type).toLowerCase()
  return value === "vision" || value === "mission" ? value : null
}

export async function getAboutVisionMissions(_req, res) {
  try {
    const rows = await prisma.aboutVisionMission.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    })
    res.json(rows)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch vision mission",
    })
  }
}

export async function getAboutVisionMissionById(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid vision mission id" })

    const row = await prisma.aboutVisionMission.findUnique({ where: { id } })
    if (!row) return res.status(404).json({ message: "Vision mission not found" })

    res.json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch vision mission",
    })
  }
}

export async function createAboutVisionMission(req, res) {
  try {
    const type = normalizeType(req.body.type)
    const title = str(req.body.title)
    const text = str(req.body.text)
    const icon = str(req.body.icon).toLowerCase()

    if (!type) {
      return res.status(400).json({ message: "type must be vision or mission" })
    }
    if (!title || !text || !icon) {
      return res.status(400).json({ message: "type, title, text, icon are required" })
    }

    const row = await prisma.aboutVisionMission.create({
      data: {
        type,
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
        error instanceof Error ? error.message : "Failed to create vision mission",
    })
  }
}

export async function updateAboutVisionMission(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid vision mission id" })

    const data = {}
    if (req.body.type !== undefined) {
      const type = normalizeType(req.body.type)
      if (!type) {
        return res.status(400).json({ message: "type must be vision or mission" })
      }
      data.type = type
    }
    if (req.body.title !== undefined) data.title = str(req.body.title)
    if (req.body.text !== undefined) data.text = str(req.body.text)
    if (req.body.icon !== undefined) data.icon = str(req.body.icon).toLowerCase()
    if (req.body.order !== undefined) data.order = Number(req.body.order) || 0

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    const row = await prisma.aboutVisionMission.update({ where: { id }, data })
    res.json(row)
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Vision mission not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update vision mission",
    })
  }
}

export async function deleteAboutVisionMission(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid vision mission id" })

    await prisma.aboutVisionMission.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Vision mission not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete vision mission",
    })
  }
}
