"use client"

import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { LogOut } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clearAuthUser, type AuthUser } from "@/lib/auth-session"
import { cn } from "@/lib/utils"

type WebsiteProfileMenuProps = {
  user: AuthUser
  className?: string
  onAfterLogout?: () => void
}

export function WebsiteProfileMenu({
  user,
  className,
  onAfterLogout,
}: WebsiteProfileMenuProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    clearAuthUser()
    void queryClient.invalidateQueries({ queryKey: ["menus", "tree"] })
    onAfterLogout?.()
    router.push("/")
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-center gap-2 min-h-[44px] px-[21px] rounded-full bg-[#116cc6] shadow-[0_8px_20px_rgba(17,108,198,0.22)] text-white text-[14px] font-bold transition-colors duration-160 hover:bg-[#0b559e] data-[state=open]:bg-[#0b559e] dark:bg-[#ffbc11] dark:shadow-[0_8px_20px_rgba(255,188,17,0.2)] dark:text-black dark:hover:bg-[#eaaa00] dark:data-[state=open]:bg-[#eaaa00] max-[900px]:flex-1 outline-none",
            className
          )}
          aria-label="Open profile menu"
        >
          Profile
          <svg
            className="w-[17px] h-[17px] fill-none stroke-current"
            style={
              {
                strokeWidth: 1.8,
                strokeLinecap: "round",
                strokeLinejoin: "round",
              } as React.CSSProperties
            }
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="min-w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 text-[var(--foreground)] shadow-lg data-[state=open]:animate-none data-[state=closed]:animate-none"
      >
        <DropdownMenuLabel className="px-3 py-2.5 font-normal">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {user.fullName}
            </span>
            <span className="text-xs text-[var(--foreground)]/55">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[var(--border)]" />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer rounded-lg px-3 py-2.5 text-[15px] font-medium"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
