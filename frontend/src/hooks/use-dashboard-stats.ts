"use client"

import { useEffect, useState } from "react"

import { dashboardApi, type DashboardData } from "@/api/dashboard"

interface UseDashboardStatsResult {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboardStats(): UseDashboardStatsResult {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    dashboardApi
      .getStats()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard",
          )
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [tick])

  return {
    data,
    isLoading,
    error,
    refetch: () => setTick((t) => t + 1),
  }
}
