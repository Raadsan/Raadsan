import { prisma } from "../../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function str(value) {
  return String(value ?? "").trim()
}

export async function getAboutCompanies(_req, res) {
  try {
    const rows = await prisma.aboutCompany.findMany({
      orderBy: [{ id: "asc" }],
    })
    res.json(rows)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch about company",
    })
  }
}

export async function getAboutCompanyById(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid about company id" })

    const row = await prisma.aboutCompany.findUnique({ where: { id } })
    if (!row) return res.status(404).json({ message: "About company not found" })

    res.json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch about company",
    })
  }
}

export async function createAboutCompany(req, res) {
  try {
    const title = str(req.body.title)
    const content = str(req.body.content)
    const image = str(req.body.image)

    if (!title || !content || !image) {
      return res.status(400).json({ message: "title, content, image are required" })
    }

    const row = await prisma.aboutCompany.create({
      data: { title, content, image },
    })
    res.status(201).json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create about company",
    })
  }
}

export async function updateAboutCompany(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid about company id" })

    const data = {}
    if (req.body.title !== undefined) data.title = str(req.body.title)
    if (req.body.content !== undefined) data.content = str(req.body.content)
    if (req.body.image !== undefined) data.image = str(req.body.image)

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    const row = await prisma.aboutCompany.update({ where: { id }, data })
    res.json(row)
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "About company not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update about company",
    })
  }
}

export async function deleteAboutCompany(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid about company id" })

    await prisma.aboutCompany.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "About company not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete about company",
    })
  }
}
