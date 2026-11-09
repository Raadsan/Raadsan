import { prisma } from "../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function str(value) {
  return String(value ?? "").trim()
}

// GET /api/roles
export async function getRoles(_req, res) {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { users: true, rolePermissions: true },
        },
      },
    })
    res.json(roles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/roles/:id
export async function getRoleById(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  try {
    const role = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    })
    if (!role) return res.status(404).json({ message: "Role not found" })
    res.json(role)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/roles
export async function createRole(req, res) {
  const name = str(req.body.name)
  const description = str(req.body.description) || null

  if (!name) return res.status(422).json({ message: "name is required" })

  try {
    const role = await prisma.role.create({
      data: { name, description },
    })
    res.status(201).json(role)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/roles/:id
export async function updateRole(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  const name = str(req.body.name)
  const description = str(req.body.description) || null

  if (!name) return res.status(422).json({ message: "name is required" })

  try {
    const role = await prisma.role.update({
      where: { id },
      data: { name, description },
    })
    res.json(role)
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ message: "Role not found" })
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/roles/:id
export async function deleteRole(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  try {
    // Check if any users are assigned
    const count = await prisma.user.count({ where: { roleId: id } })
    if (count > 0) {
      return res.status(409).json({
        message: `Cannot delete role. ${count} user(s) are still assigned to it.`,
      })
    }
    await prisma.role.delete({ where: { id } })
    res.json({ message: "Role deleted" })
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ message: "Role not found" })
    res.status(500).json({ message: error.message })
  }
}
