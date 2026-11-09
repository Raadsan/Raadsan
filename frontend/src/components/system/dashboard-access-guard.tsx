"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getAuthUser, isWebsiteUserRole } from "@/lib/auth-session"

export function DashboardAccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const user = getAuthUser()
    if (!user) {
      router.replace("/login")
      return
    }
    if (isWebsiteUserRole(user.roleName)) {
      router.replace("/")
      return
    }
    setAllowed(true)
  }, [router])

  if (!allowed) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-muted-foreground">
        Checking access…
      </div>
    )
  }

  return children
}
