import { verifyAccessToken } from "../lib/jwt.js"
import { prisma } from "../lib/prisma.js"

export function getBearerPayload(req) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) return null
  try {
    return verifyAccessToken(header.slice(7).trim())
  } catch {
    return null
  }
}

/** Requires valid JWT; sets req.auth */
export function requireAuth(req, res, next) {
  const payload = getBearerPayload(req)
  if (!payload?.userId) {
    return res.status(401).json({ message: "Authentication required" })
  }
  req.auth = payload
  next()
}
