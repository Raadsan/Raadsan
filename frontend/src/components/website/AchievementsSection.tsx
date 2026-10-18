"use client"

import { useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion"

import { achievementsApi } from "@/api/home/achievements"
import { mediaUrl } from "@/api/uploads"

type ApiAchievement = {
  id: number
  slug: string
  count: string
  label: string
  icon: string
}

function parseMetric(count: string) {
  const match = String(count).match(/[\d,.]+/)
  if (!match) return { value: 0, suffix: String(count) }
  const raw = match[0].replace(/,/g, "")
  const value = Number(raw)
  const suffix = String(count).replace(match[0], "")
  return {
    value: Number.isFinite(value) ? value : 0,
    suffix,
  }
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const count = useMotionValue(1)
  const displayValue = useTransform(
    count,
    (current) => `${Math.round(current).toLocaleString()}${suffix}`,
  )

  useEffect(() => {
    if (!isInView) return
    const controls = animate(count, value, { duration: 2.5, ease: "easeOut" })
    return () => controls.stop()
  }, [count, isInView, value])

  return <motion.span ref={ref}>{displayValue}</motion.span>
}

export default function AchievementsSection() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-achievements"],
    queryFn: () => achievementsApi.getAll(),
  })

  const achievements = data as ApiAchievement[]

  return (
    <section
      id="achievements"
      className="relative overflow-hidden bg-white px-6 py-20 transition-colors dark:bg-[#020b1d]"
      aria-labelledby="achievements-title"
    >
      <div className="relative z-10 mx-auto max-w-[1320px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <h2
            id="achievements-title"
            className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white"
          >
            Our Achievements
          </h2>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">
            Loading achievements…
          </p>
        ) : achievements.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No achievements yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {achievements.map((item, index) => {
              const metric = parseMetric(item.count)
              const iconSrc = mediaUrl(item.icon)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group flex flex-col items-center justify-center text-center"
                >
                  {iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={iconSrc}
                      alt=""
                      className="mb-5 h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <span className="mb-5 text-lg font-black text-[#116cc6] dark:text-[#ffbc11]">
                      ★
                    </span>
                  )}

                  <div className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                    {metric.value > 0 ? (
                      <CountUp value={metric.value} suffix={metric.suffix} />
                    ) : (
                      item.count
                    )}
                  </div>

                  <span className="text-xs font-semibold text-slate-600 md:text-sm dark:text-slate-400">
                    {item.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
