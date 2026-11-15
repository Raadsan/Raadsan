const KEY = "auth_user"
const TOKEN_KEY = "token"

/** Login lasts only while this browser window is open. */
function browserSession(): Storage | null {
  if (typeof window === "undefined") return null
  return window.sessionStorage
}

function dropPersistentLogin(): void {
  try {
    localStorage.removeItem(KEY)
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

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
    const store = browserSession()
    if (!store) return
    dropPersistentLogin()
    store.setItem(TOKEN_KEY, token)
  } catch {
    // storage unavailable
  }
}

export function getAuthToken(): string | null {
  try {
    const store = browserSession()
    if (!store) return null
    dropPersistentLogin()
    return store.getItem(TOKEN_KEY)
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
    dropPersistentLogin()
    browserSession()?.setItem(KEY, JSON.stringify(entry))
    if (token) setAuthToken(token)
    window.dispatchEvent(new Event("raadsan-auth-change"))
  } catch {
    // storage unavailable
  }
}

export function getAuthUser(): AuthUser | null {
  try {
    const store = browserSession()
    if (!store) return null
    dropPersistentLogin()
    const raw = store.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function clearAuthUser(): void {
  try {
    dropPersistentLogin()
    const store = browserSession()
    store?.removeItem(KEY)
    store?.removeItem(TOKEN_KEY)
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
