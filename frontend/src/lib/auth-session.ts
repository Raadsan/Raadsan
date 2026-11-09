const KEY = "auth_user"
const TOKEN_KEY = "token"

export type AuthUser = {
  id: number
  fullName: string
  email: string
  roleId: number
  roleName: string
}

type LoginUserPayload = {
  id: number
  fullName: string
  email: string
  roleId: number
  role: { id: number; name: string }
}

export function setAuthToken(token: string): void {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // storage unavailable
  }
}

export function getAuthToken(): string | null {
  try {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAuthUserFromLogin(
  user: LoginUserPayload,
  token?: string | null,
): void {
  try {
    if (typeof window === "undefined") return
    const entry: AuthUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
    }
    localStorage.setItem(KEY, JSON.stringify(entry))
    if (token) setAuthToken(token)
    window.dispatchEvent(new Event("raadsan-auth-change"))
  } catch {
    // storage unavailable
  }
}

export function getAuthUser(): AuthUser | null {
  try {
    if (typeof window === "undefined") return null
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function clearAuthUser(): void {
  try {
    if (typeof window === "undefined") return
    localStorage.removeItem(KEY)
    localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new Event("raadsan-auth-change"))
  } catch {
    // ignore
  }
}

/** Public website account — stays on marketing site, not the admin dashboard. */
export function isWebsiteUserRole(roleName: string): boolean {
  return roleName.trim().toLowerCase() === "user"
}

export function isWebsiteOnlyRole(roleName: string): boolean {
  return isWebsiteUserRole(roleName)
}

export function isDashboardRole(roleName: string): boolean {
  return !isWebsiteUserRole(roleName)
}

/** Admin role name (full access conventions elsewhere). */
export function isAdminRole(roleName: string): boolean {
  return roleName.toLowerCase().includes("admin")
}
