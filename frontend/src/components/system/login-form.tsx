"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { IconCheck, IconEye, IconEyeOff, IconX } from "@tabler/icons-react"

import api from "@/api/axios"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getSessions,
  migrateLegacySession,
  removeSession,
  upsertSession,
  type SavedSession,
} from "@/lib/savedSessions"
import {
  getAuthUser,
  isDashboardRole,
  setAuthUserFromLogin,
} from "@/lib/auth-session"

// helpers
function initials(email: string): string {
  const local = email.split("@")[0]
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

function maskPassword(password: string): string {
  return "•".repeat(Math.min(password.length, 10))
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const COLORS = ["bg-violet-500","bg-sky-500","bg-emerald-500","bg-rose-500","bg-amber-500"]
function avatarColor(email: string): string {
  let hash = 0
  for (const ch of email) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return COLORS[hash % COLORS.length]
}

interface SessionDropdownProps {
  sessions: SavedSession[]
  query: string
  onPick: (s: SavedSession) => void
  onRemove: (email: string, e: React.MouseEvent) => void
}

function SessionDropdown({ sessions, query, onPick, onRemove }: SessionDropdownProps) {
  const filtered = query
    ? sessions.filter((s) => s.email.toLowerCase().includes(query.toLowerCase()))
    : sessions

  if (filtered.length === 0) return null

  return (
    <div
      className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-xl ring-1 ring-black/5 dark:ring-white/5"
      role="listbox"
      aria-label="Saved accounts"
    >
      <div className="px-3 pt-2.5 pb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Saved accounts
        </p>
      </div>
      <ul className="pb-1.5">
        {filtered.map((s) => (
          <li key={s.email}>
            <button
              type="button"
              role="option"
              aria-selected="false"
              onMouseDown={(e) => { e.preventDefault(); onPick(s) }}
              className="group relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent outline-none"
            >
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(s.email)}`}>
                {initials(s.email)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{s.email}</span>
                <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="tracking-widest">{maskPassword(s.password)}</span>
                  <span className="opacity-60">·</span>
                  <span>{timeAgo(s.lastLogin)}</span>
                </span>
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Remove ${s.email}`}
                onMouseDown={(e) => onRemove(s.email, e)}
                className="flex size-6 shrink-0 items-center justify-center rounded-full opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 outline-none cursor-pointer"
              >
                <IconX className="size-3.5" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [sessions, setSessions] = useState<SavedSession[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const emailWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const existing = getAuthUser()
    if (existing) {
      router.replace(isDashboardRole(existing.roleName) ? "/dashboard" : "/")
    }
  }, [router])

  useEffect(() => {
    migrateLegacySession()
    setSessions(getSessions())
    try {
      if (typeof window !== "undefined") {
        const storedSignup = sessionStorage.getItem("signup_credentials")
        if (storedSignup) {
          const parsed = JSON.parse(storedSignup)
          if (parsed.email) setEmail(parsed.email)
          if (parsed.password) setPassword(parsed.password)
          sessionStorage.removeItem("signup_credentials")
          setSuccess("Account created! Your credentials have been filled in.")
        }
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emailWrapRef.current && !emailWrapRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const pickSession = useCallback((s: SavedSession) => {
    setEmail(s.email)
    setPassword(s.password)
    setDropdownOpen(false)
    setError(null)
  }, [])

  const handleRemoveSession = useCallback((emailToRemove: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeSession(emailToRemove)
    const updated = getSessions()
    setSessions(updated)
    if (updated.length === 0) setDropdownOpen(false)
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const { data } = await api.post("/api/auth/login", { email, password })
      setAuthUserFromLogin(data.user, data.token)
      if (Array.isArray(data.menu) && data.user?.roleId != null) {
        queryClient.setQueryData(
          ["menus", "tree", data.user.roleId],
          data.menu,
        )
      } else {
        await queryClient.invalidateQueries({ queryKey: ["menus", "tree"] })
      }
      if (rememberMe) {
        upsertSession(email, password)
        setSessions(getSessions())
      }
      router.push(isDashboardRole(data.user.role.name) ? "/dashboard" : "/")
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Incorrect email or password"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <IconCheck className="size-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative" ref={emailWrapRef}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            required
            autoComplete="off"
            value={email}
            onFocus={() => sessions.length > 0 && setDropdownOpen(true)}
            onChange={(e) => {
              setEmail(e.target.value)
              setDropdownOpen(sessions.length > 0)
            }}
            className="h-11"
          />
          {dropdownOpen && (
            <SessionDropdown
              sessions={sessions}
              query={email}
              onPick={pickSession}
              onRemove={handleRemoveSession}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="password">Password</Label>
          <Link href="#" className="text-xs font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(!!checked)}
        />
        <Label htmlFor="remember" className="cursor-pointer font-normal text-slate-600 dark:text-slate-300">
          Remember me
        </Label>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
