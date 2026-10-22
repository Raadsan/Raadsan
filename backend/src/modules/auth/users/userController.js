import bcrypt from "bcryptjs"
import { prisma } from "../../../lib/prisma.js"

const SALT_ROUNDS = 10

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function str(value) {
  return String(value ?? "").trim()
}

// GET /api/users
export async function getUsers(_req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/users/:id
export async function getUserById(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/users
export async function createUser(req, res) {
  const fullName = str(req.body.fullName)
  const email = str(req.body.email)
  const password = str(req.body.password)
  const confirmPass = str(req.body.confirmPass)
  const roleId = parseId(req.body.roleId)

  if (!fullName) return res.status(422).json({ message: "fullName is required" })
  if (!email) return res.status(422).json({ message: "email is required" })
  if (!password) return res.status(422).json({ message: "password is required" })
  if (!confirmPass) return res.status(422).json({ message: "confirmPass is required" })
  if (!roleId) return res.status(422).json({ message: "roleId is required" })

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: { fullName, email, password: hashed, confirmPass: hashed, roleId },
      select: {
        id: true,
        fullName: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    })
    res.status(201).json(user)
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email is already taken" })
    }
    if (error.code === "P2003") {
      return res.status(422).json({ message: "Role not found" })
    }
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  const fullName = str(req.body.fullName)
  const email = str(req.body.email)
  const roleId = parseId(req.body.roleId)

  const updateData = {}
  if (fullName) updateData.fullName = fullName
  if (email) updateData.email = email
  if (roleId) updateData.roleId = roleId
  // Optionally update password if provided
  if (str(req.body.password)) {
    const hashed = await bcrypt.hash(str(req.body.password), SALT_ROUNDS)
    updateData.password = hashed
    updateData.confirmPass = hashed
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    })
    res.json(user)
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ message: "User not found" })
    if (error.code === "P2002") return res.status(409).json({ message: "Email is already taken" })
    if (error.code === "P2003") return res.status(422).json({ message: "Role not found" })
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  try {
    await prisma.user.delete({ where: { id } })
    res.json({ message: "User deleted" })
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ message: "User not found" })
    res.status(500).json({ message: error.message })
  }
}
