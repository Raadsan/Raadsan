"use client"

import { useEffect, useState } from "react"
import {
  IconLogout,
  IconMoon,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const THEME_KEY = "raadsan-theme"

export function SiteHeader() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const syncTheme = () => {
      const isDark =
        localStorage.getItem(THEME_KEY) === "dark" ||
        document.documentElement.classList.contains("dark")
      setDarkMode(isDark)
    }

    syncTheme()
    window.addEventListener("raadsan-theme-change", syncTheme)
    window.addEventListener("storage", syncTheme)

    return () => {
      window.removeEventListener("raadsan-theme-change", syncTheme)
      window.removeEventListener("storage", syncTheme)
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = !darkMode
    const root = document.documentElement

    root.classList.add("theme-changing")
    setDarkMode(nextTheme)
    root.classList.toggle("dark", nextTheme)
    localStorage.setItem(THEME_KEY, nextTheme ? "dark" : "light")
    window.dispatchEvent(new Event("raadsan-theme-change"))

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() =>
        root.classList.remove("theme-changing"),
      )
    })
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b border-border bg-background">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 text-primary md:hidden" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4 md:hidden"
        />
        <h1 className="flex-1 text-lg font-semibold tracking-tight text-primary dark:text-white">
          Admin Dashboard
        </h1>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="size-10 rounded-full border border-border bg-muted/40 text-foreground hover:bg-muted"
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          title={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          {darkMode ? (
            <IconSun className="size-5 text-secondary" />
          ) : (
            <IconMoon className="size-5 text-primary" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full border border-border bg-muted/40 hover:bg-muted"
              aria-label="Open profile menu"
            >
              <Avatar className="size-9">
                <AvatarImage src="" alt="Admin" />
                <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                  <IconUserCircle className="size-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56 rounded-xl">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Admin</span>
                <span className="text-xs text-muted-foreground">
                  admin@raadsan.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
