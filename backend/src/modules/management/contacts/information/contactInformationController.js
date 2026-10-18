import { prisma } from "../../../../lib/prisma.js"

const ALLOWED_ICONS = new Set(["mail", "phone", "map"])

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function normalizeIcon(icon) {
  const value = String(icon || "")
    .trim()
    .toLowerCase()
  return ALLOWED_ICONS.has(value) ? value : null
}

function iconFromLabel(label) {
  const value = String(label || "")
    .trim()
    .toLowerCase()
  if (value.includes("mail") || value.includes("email")) return "mail"
  if (value.includes("phone") || value.includes("tel")) return "phone"
  return "map"
}

export async function getContactInformation(_req, res) {
  try {
    const rows = await prisma.contactInformation.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    })
    res.json(rows)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch contact information",
    })
  }
}

export async function getContactInformationById(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) {
      return res.status(400).json({ message: "Invalid contact information id" })
    }

    const row = await prisma.contactInformation.findUnique({ where: { id } })
    if (!row) {
      return res.status(404).json({ message: "Contact information not found" })
    }

    res.json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch contact information",
    })
  }
}

export async function createContactInformation(req, res) {
  try {
    const { icon, label, value, href, order } = req.body

    if (!label || !value) {
      return res.status(400).json({
        message: "label and value are required",
      })
    }

    const normalizedIcon = normalizeIcon(icon) || iconFromLabel(label)

    const row = await prisma.contactInformation.create({
      data: {
        icon: normalizedIcon,
        label: String(label).trim(),
        value: String(value).trim(),
        href: href != null && String(href).trim() ? String(href).trim() : null,
        order: order !== undefined ? Number(order) || 0 : 0,
      },
    })

    res.status(201).json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create contact information",
    })
  }
}

export async function updateContactInformation(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) {
      return res.status(400).json({ message: "Invalid contact information id" })
    }

    const { icon, label, value, href, order } = req.body
    const data = {}

    if (label !== undefined) data.label = String(label).trim()
    if (value !== undefined) data.value = String(value).trim()
    if (href !== undefined) {
      data.href = href != null && String(href).trim() ? String(href).trim() : null
    }
    if (order !== undefined) data.order = Number(order) || 0

    if (icon !== undefined) {
      const normalizedIcon = normalizeIcon(icon)
      if (!normalizedIcon) {
        return res.status(400).json({
          message: "icon must be mail, phone, or map",
        })
      }
      data.icon = normalizedIcon
    } else if (label !== undefined) {
      data.icon = iconFromLabel(label)
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    const row = await prisma.contactInformation.update({ where: { id }, data })
    res.json(row)
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Contact information not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update contact information",
    })
  }
}

export async function deleteContactInformation(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) {
      return res.status(400).json({ message: "Invalid contact information id" })
    }

    await prisma.contactInformation.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Contact information not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete contact information",
    })
  }
}
