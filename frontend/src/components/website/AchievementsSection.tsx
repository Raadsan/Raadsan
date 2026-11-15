"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion"
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Eye,
  FolderCheck,
  Globe2,
  GraduationCap,
  Heart,
  HeartHandshake,
  LifeBuoy,
  Lightbulb,
  LockKeyhole,
  Medal,
  Rocket,
  Settings2,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  type LucideProps,
} from "lucide-react"

import { achievementsApi } from "@/api/home/achievements"
import { mediaUrl } from "@/api/uploads"
import { motionInitial } from "@/lib/website-motion"

type LucideIcon = ComponentType<LucideProps>

const ACHIEVEMENT_ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  award: Award,
  medal: Medal,
  star: Star,
  users: Users,
  briefcase: Briefcase,
  check: CheckCircle2,
  checkcircle: CheckCircle2,
  "check-circle": CheckCircle2,
  circlecheck: CheckCircle2,
  folder: FolderCheck,
  foldercheck: FolderCheck,
  "folder-check": FolderCheck,
  sparkles: Sparkles,
  thumbsup: ThumbsUp,
  "thumbs-up": ThumbsUp,
  smile: Smile,
  clock: Clock,
  target: Target,
  trendingup: TrendingUp,
  "trending-up": TrendingUp,
  zap: Zap,
  rocket: Rocket,
  globe: Globe2,
  globe2: Globe2,
  heart: Heart,
  handshake: HeartHandshake,
  hearthandshake: HeartHandshake,
  shield: ShieldCheck,
  shieldcheck: ShieldCheck,
  lightbulb: Lightbulb,
  building: Building2,
  graduationcap: GraduationCap,
  "graduation-cap": GraduationCap,
  code: Code2,
  cpu: Cpu,
  settings: Settings2,
  lifebuoy: LifeBuoy,
  lock: LockKeyhole,
  eye: Eye,
}

function isImagePath(val: string) {
  if (!val) return false
  const str = String(val).trim()
  return (
    str.startsWith("http://") ||
    str.startsWith("https://") ||
    str.startsWith("/") ||
    str.startsWith("blob:") ||
    str.startsWith("data:") ||
    /\.(png|jpe?g|svg|webp|gif|avif)$/i.test(str)
  )
}

function resolveAchievementIcon(name: string): LucideIcon {
  const normalized = String(name || "").toLowerCase().trim().replace(/\s+/g, "-")
  return (
    ACHIEVEMENT_ICON_MAP[normalized] ||
    ACHIEVEMENT_ICON_MAP[normalized.replace(/-/g, "")] ||
    Trophy
  )
}

type ApiAchievement = {
  id: number
  slug: string
  count: string
  label: string
  icon: string
  image?: string | null
  imageDark?: string | null
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
  const [isDark, setIsDark] = useState(false)
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-achievements"],
    queryFn: () => achievementsApi.getAll(),
  })

  const achievements = data as ApiAchievement[]

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setIsDark(root.classList.contains("dark"))

    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="achievements"
      className="relative overflow-hidden bg-white px-6 py-20 transition-colors dark:bg-[#020b1d]"
      aria-labelledby="achievements-title"
    >
      <div className="relative z-10 mx-auto max-w-[1320px]">
        <motion.div
          initial={motionInitial}
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
              const themedImage =
                isDark && item.imageDark ? item.imageDark : item.image
              const imageSrc = themedImage ? mediaUrl(themedImage) : null
              const isImage = !imageSrc && isImagePath(item.icon)
              const iconSrc = isImage ? mediaUrl(item.icon) : null
              const Icon = !imageSrc && !isImage ? resolveAchievementIcon(item.icon) : null
              return (
                <motion.div
                  key={item.id}
                  initial={motionInitial}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group flex flex-col items-center justify-center text-center"
                >
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt=""
                      className="mb-5 h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : isImage && iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={iconSrc}
                      alt=""
                      className="mb-5 h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : Icon ? (
                    <Icon
                      className="mb-5 h-12 w-12 text-[#116cc6] transition-transform duration-300 group-hover:scale-110 dark:text-[#ffbc11]"
                      strokeWidth={1.8}
                      aria-hidden
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
