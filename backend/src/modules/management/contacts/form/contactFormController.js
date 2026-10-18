import { prisma } from "../../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function getContactSubmissions(_req, res) {
  try {
    const rows = await prisma.contactSubmission.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    })
    res.json(rows)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch contact submissions",
    })
  }
}

export async function getContactSubmissionById(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid submission id" })

    const row = await prisma.contactSubmission.findUnique({ where: { id } })
    if (!row) {
      return res.status(404).json({ message: "Contact submission not found" })
    }

    res.json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch contact submission",
    })
  }
}

export async function createContactSubmission(req, res) {
  try {
    const { name, email, subject, phone, message } = req.body

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        message: "name, email, phone, and message are required",
      })
    }

    const row = await prisma.contactSubmission.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        subject:
          subject != null && String(subject).trim()
            ? String(subject).trim()
            : null,
        phone: String(phone).trim(),
        message: String(message).trim(),
      },
    })

    res.status(201).json(row)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create contact submission",
    })
  }
}

export async function deleteContactSubmission(req, res) {
  try {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ message: "Invalid submission id" })

    await prisma.contactSubmission.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Contact submission not found" })
    }
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete contact submission",
    })
  }
}
