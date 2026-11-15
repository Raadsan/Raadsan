const DEFAULT_API_PORT = process.env.NEXT_PUBLIC_API_PORT || "8006"

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1"
}

function envApiUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!raw) return null
  return raw.replace(/\/$/, "")
}

/**
 * API origin for axios and media URLs.
 * On a public host (e.g. 167.86.104.132), uses same host + port 8006
 * even if the build still has NEXT_PUBLIC_API_URL=localhost.
 */
export function getApiBaseUrl(): string {
  const fromEnv = envApiUrl()
  const port = DEFAULT_API_PORT

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location
    if (!isLocalHostname(hostname)) {
      if (fromEnv) {
        try {
          if (!isLocalHostname(new URL(fromEnv).hostname)) return fromEnv
        } catch {
          // ignore invalid env URL
        }
      }
      return `${protocol}//${hostname}:${port}`
    }
  }

  if (fromEnv) return fromEnv
  return `http://localhost:${port}`
}