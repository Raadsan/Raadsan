import { prisma } from "../../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function getContactHeroes(_req, res) {
  try {
    const rows = await prisma.contactHero.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    })
    res.json(rows)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch contact heroes",
    })
  }
}

export async function getContactHeroById(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid contact hero id" })

    const row = await prisma.contactHero.findUnique({ where: { id } })
    if (!row) return res.status(404).json({ message: "Contact hero not found" })

    res.json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch contact hero",
    })
  }
}

export async function createContactHero(req, res) {
  try {
    const { title, highlight, subtitle, order } = req.body
    if (!title || !subtitle) {
      return res.status(400).json({
        message: "title and subtitle are required",
      })
    }

    const row = await prisma.contactHero.create({
      data: {
        title: String(title).trim(),
        highlight:
          highlight != null && String(highlight).trim()
            ? String(highlight).trim()
            : "",
        subtitle: String(subtitle).trim(),
        order: order !== undefined ? Number(order) || 0 : 0,
      },
    })

    res.status(201).json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create contact hero",
    })
  }
}

export async function updateContactHero(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid contact hero id" })

    const { title, highlight, subtitle, order } = req.body
    const data = {}
    if (title !== undefined) data.title = String(title).trim()
    if (highlight !== undefined) data.highlight = String(highlight).trim()
    if (subtitle !== undefined) data.subtitle = String(subtitle).trim()
    if (order !== undefined) data.order = Number(order) || 0

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    const row = await prisma.contactHero.update({ where: { id }, data })
    res.json(row)
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Contact hero not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update contact hero",
    })
  }
}

export async function deleteContactHero(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid contact hero id" })

    await prisma.contactHero.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Contact hero not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete contact hero",
    })
  }
}
