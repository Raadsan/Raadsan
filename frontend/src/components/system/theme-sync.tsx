"use client"

import { useEffect } from "react"

const THEME_KEY = "raadsan-theme"

function applyTheme(theme?: string | null) {
  const isDark = (theme ?? localStorage.getItem(THEME_KEY)) === "dark"
  document.documentElement.classList.toggle("dark", isDark)
}

export function ThemeSync() {
  useEffect(() => {
    applyTheme()

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY) applyTheme(event.newValue)
    }

    const onThemeChange = () => applyTheme()

    window.addEventListener("storage", onStorage)
    window.addEventListener("raadsan-theme-change", onThemeChange)

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("raadsan-theme-change", onThemeChange)
    }
  }, [])

  return null
}
