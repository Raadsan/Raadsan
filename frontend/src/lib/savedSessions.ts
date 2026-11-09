/**
 * savedSessions.ts
 * Manages multiple remembered login sessions in localStorage.
 * Stores an array of { email, password } entries (max 5).
 */

const KEY = "saved_sessions"
const MAX_SESSIONS = 5

export interface SavedSession {
  email: string
  password: string
  /** ISO timestamp of last login */
  lastLogin: string
}

function readAll(): SavedSession[] {
  try {
    if (typeof window === "undefined") return []
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SavedSession[]) : []
  } catch {
    return []
  }
}

function writeAll(sessions: SavedSession[]): void {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(KEY, JSON.stringify(sessions))
  } catch {
    // storage quota or SSR — silently ignore
  }
}

/** Upsert a session. If email already exists, update its password + timestamp. */
export function upsertSession(email: string, password: string): void {
  const all = readAll()
  const idx = all.findIndex((s) => s.email.toLowerCase() === email.toLowerCase())
  const entry: SavedSession = { email, password, lastLogin: new Date().toISOString() }
  if (idx !== -1) {
    all[idx] = entry
  } else {
    all.unshift(entry)
    if (all.length > MAX_SESSIONS) all.splice(MAX_SESSIONS)
  }
  writeAll(all)
}

/** Return all saved sessions, most-recent first. */
export function getSessions(): SavedSession[] {
  return readAll().sort(
    (a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
  )
}

/** Remove a single session by email. */
export function removeSession(email: string): void {
  const filtered = readAll().filter(
    (s) => s.email.toLowerCase() !== email.toLowerCase()
  )
  writeAll(filtered)
}

/** Find a session by email (case-insensitive). */
export function findSession(email: string): SavedSession | undefined {
  return readAll().find((s) => s.email.toLowerCase() === email.toLowerCase())
}

/** Migrate old single-user keys to the new multi-session format. */
export function migrateLegacySession(): void {
  try {
    if (typeof window === "undefined") return
    const oldEmail = localStorage.getItem("remembered_email")
    const oldPassword = localStorage.getItem("remembered_password")
    if (oldEmail) {
      upsertSession(oldEmail, oldPassword ?? "")
      localStorage.removeItem("remembered_email")
      localStorage.removeItem("remembered_password")
    }
  } catch {
    // ignore
  }
}
