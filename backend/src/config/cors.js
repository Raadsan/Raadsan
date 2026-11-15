/**
 * Comma-separated allowed browser origins, e.g.
 * CORS_ORIGINS=http://167.86.104.132:3000,http://localhost:3000
 */
export function getCorsOptions() {
  const fromEnv = process.env.CORS_ORIGINS || process.env.FRONTEND_URL || ""
  const allowed = fromEnv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  if (allowed.length === 0) {
    allowed.push("http://localhost:3000")
  }

  return {
    origin(origin, callback) {
      // Postman, server-to-server, same-origin — no Origin header
      if (!origin || allowed.includes(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    credentials: true,
  }
}