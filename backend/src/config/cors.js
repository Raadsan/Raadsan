function isLocalHostname(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1"
}

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

  const usingDefault =
    allowed.length === 0 ||
    (allowed.length === 1 && allowed[0] === "http://localhost:3000")

  if (allowed.length === 0) {
    allowed.push("http://localhost:3000")
  }

  return {
    origin(origin, callback) {
      if (!origin || allowed.includes(origin)) {
        callback(null, true)
        return
      }

      // VPS: allow public Next.js (port 3000) when CORS_ORIGINS was not configured
      if (usingDefault) {
        try {
          const u = new URL(origin)
          if (u.port === "3000" && !isLocalHostname(u.hostname)) {
            callback(null, true)
            return
          }
        } catch {
          // ignore
        }
      }

      callback(null, false)
    },
    credentials: true,
  }
}