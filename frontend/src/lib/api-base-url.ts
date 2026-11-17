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
 *
 * - On a public hostname that is NOT a raw IP (i.e. a domain like raadsantech.so),
 *   return "" (empty string = same origin) so requests go through the
 *   Next.js /api/* rewrite proxy — avoids port / HTTPS mismatches.
 * - On a raw-IP public host (e.g. 167.86.104.132), hit port 8006 directly
 *   as before, since the IP can reach the backend without a proxy.
 * - On localhost, use env or fallback to http://localhost:8006.
 */
export function getApiBaseUrl(): string {
  const fromEnv = envApiUrl()
  const port = DEFAULT_API_PORT

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location

    if (!isLocalHostname(hostname)) {
      // Domain (e.g. raadsantech.so) → proxy through Next.js rewrites
      const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
      if (!isIP) {
        return "" // same origin — Next.js proxies /api/* to backend
      }

      // Raw IP — call backend port directly
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