import jwt from "jsonwebtoken"

const DEFAULT_EXPIRES = "7d"

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production")
  }
  return "raadsan-dev-jwt-secret"
}

export function signAccessToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: DEFAULT_EXPIRES })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getSecret())
}
