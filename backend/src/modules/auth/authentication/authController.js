import bcrypt from "bcryptjs"
import { prisma } from "../../../lib/prisma.js"

const SALT_ROUNDS = 10

function str(value) {
  return String(value ?? "").trim()
}

// POST /api/auth/register
export async function register(req, res) {
  const fullName = str(req.body.fullName)
  const email = str(req.body.email)
  const password = str(req.body.password)
  const confirmPassword = str(req.body.confirmPassword || req.body.confirmPass)

  if (!fullName) return res.status(422).json({ message: "Full name is required" })
  if (!email) return res.status(422).json({ message: "Email is required" })
  if (!password) return res.status(422).json({ message: "Password is required" })
  if (password.length < 8) {
    return res.status(422).json({ message: "Password must be at least 8 characters" })
  }
  if (password !== confirmPassword) {
    return res.status(422).json({ message: "Passwords do not match" })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" })
    }

    // Automatically assign role = "User"
    let userRole = await prisma.role.findFirst({
      where: { name: "User" },
    })

    if (!userRole) {
      userRole = await prisma.role.create({
        data: { name: "User", description: "Standard User" },
      })
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashed,
        confirmPass: hashed,
        roleId: userRole.id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        roleId: true,
        createdAt: true,
      },
    })

    return res.status(201).json({ message: "Registration successful", user })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// POST /api/auth/login
export async function login(req, res) {
  const email = str(req.body.email)
  const password = str(req.body.password)

  if (!email) return res.status(422).json({ message: "Email is required" })
  if (!password) return res.status(422).json({ message: "Password is required" })

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
        roleId: true,
        role: { select: { id: true, name: true } },
      },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" })
    }

    // Return user info (never return password)
    const { password: _pw, ...safeUser } = user
    return res.json({ user: safeUser })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
