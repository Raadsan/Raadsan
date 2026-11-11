"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Server,
  Globe,
  Code,
  Sparkles,
  Smartphone,
  GraduationCap,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react"

import { servicesApi } from "@/api/home/services"
import { motionInitial } from "@/lib/website-motion"

type ApiService = {
  id: number
  slug: string
  title: string
  badge: string
  description: string
  features: string[] | unknown
}

const iconMap: Record<string, LucideIcon> = {
  server: Server,
  globe: Globe,
  code: Code,
  sparkles: Sparkles,
  phone: Smartphone,
  academic: GraduationCap,
}

const iconBySlug: Record<string, string> = {
  "web-hosting": "server",
  "web-hosting-domain": "server",
  "software-development": "code",
  "custom-software-development": "code",
  "ai-solutions": "sparkles",
  "ai-driven-solutions": "sparkles",
  "mobile-app-development": "phone",
  "ict-training": "academic",
  "ict-training-consultancy": "academic",
  "ict-training&consultancy": "academic",
}

/** CMS slugs → public service page routes */
const pageSlugByCms: Record<string, string> = {
  "web-hosting-domain": "web-hosting",
  "custom-software-development": "software-development",
  "ai-driven-solutions": "ai-solutions",
  "ict-training-consultancy": "ict-training",
  "ict-training&consultancy": "ict-training",
}

function servicePageHref(slug: string) {
  const pageSlug = pageSlugByCms[slug] || slug
  return `/services/${encodeURIComponent(pageSlug)}`
}

const fallbackIcons = ["server", "code", "sparkles", "phone", "academic", "globe"]

function RenderIcon({ type, className = "w-6 h-6" }: { type: string; className?: string }) {
  const IconComponent = iconMap[type] || Server
  return <IconComponent className={className} />
}

function asFeatures(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

export default function ServicesSection({ limit }: { limit?: number }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: () => servicesApi.getAll(),
  })

  const services = (data as ApiService[]).map((service, index) => ({
    ...service,
    features: asFeatures(service.features),
    icon:
      iconBySlug[service.slug] ||
      fallbackIcons[index % fallbackIcons.length],
  }))

  const filtered = limit ? services.slice(0, limit) : services

  return (
    <section
      id="all-services"
      className="relative overflow-hidden bg-[#f6f9ff] px-6 py-24 transition-colors dark:bg-[#030a17]"
      aria-labelledby="services-title"
    >
      <div className="pointer-events-none absolute -top-24 left-[8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.12),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 right-[8%] h-[450px] w-[450px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.10),transparent_70%)] blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={motionInitial}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <h2
            id="services-title"
            className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white"
          >
            Our Services
          </h2>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">Loading services…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No services yet.</p>
        ) : (
          <div className="mb-16 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service, index) => (
              <motion.article
                id={service.slug}
                key={service.id}
                initial={motionInitial}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group flex h-full flex-col rounded-[22px] border border-slate-200/80 bg-white p-7 shadow-[0_8px_28px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#116cc6]/25 hover:shadow-[0_18px_40px_rgba(17,108,198,0.12)] dark:border-white/[0.08] dark:bg-[#0c1624] dark:hover:border-[#ffbc11]/30"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#116cc6]/10 text-[#116cc6] transition-colors duration-200 group-hover:bg-[#116cc6] group-hover:text-white dark:bg-[#ffbc11]/15 dark:text-[#ffbc11] dark:group-hover:bg-[#ffbc11] dark:group-hover:text-[#122035]">
                    <RenderIcon type={service.icon} className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-[#116cc6] px-3 py-1 text-[11px] font-bold text-white dark:bg-[#ffbc11] dark:text-[#122035]">
                    {service.badge}
                  </span>
                </div>

                <h3 className="mb-2.5 text-lg font-semibold text-[var(--foreground)] transition-colors group-hover:text-[#116cc6] dark:group-hover:text-[#ffbc11]">
                  {service.title}
                </h3>

                <p className="mb-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>

                <ul className="mb-6 grid flex-1 gap-2.5">
                  {service.features.slice(0, 5).map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <Check className="h-4 w-4 flex-none text-emerald-500" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={servicePageHref(service.slug)}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#116cc6] transition-all hover:gap-3 dark:text-[#ffbc11]"
                  aria-label={`Explore ${service.title} service`}
                >
                  Explore Service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {limit && services.length > limit ? (
          <div className="flex justify-center">
            <Link
              href="/services"
              className="inline-flex min-h-13 items-center gap-3 rounded-xl border-2 border-[#116cc6] px-7 text-sm font-extrabold text-[#116cc6] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#116cc6] hover:text-white dark:border-[#ffbc11] dark:text-[#ffbc11] dark:hover:bg-[#ffbc11] dark:hover:text-[#122035]"
            >
              View More Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
