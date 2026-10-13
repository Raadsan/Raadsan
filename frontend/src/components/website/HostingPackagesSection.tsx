"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Check, Zap, Server, ArrowRight } from "lucide-react"

import { hostingApi } from "@/api/home/hosting"

type ApiHostingPlan = {
  id: number
  slug: string
  name: string
  badge?: string | null
  popular?: boolean
  description: string
  monthlyPrice: number | string
  yearlyPrice: number | string
  features: string[] | unknown
  ctaText: string
}

function asFeatures(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

function toNumber(value: number | string) {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function HostingPackagesSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  )

  const { data = [], isLoading } = useQuery({
    queryKey: ["public-hosting-plans"],
    queryFn: () => hostingApi.getAll(),
  })

  const plans = (data as ApiHostingPlan[]).map((plan) => ({
    ...plan,
    monthlyPrice: toNumber(plan.monthlyPrice),
    yearlyPrice: toNumber(plan.yearlyPrice),
    features: asFeatures(plan.features),
  }))

  return (
    <section
      id="web-hosting"
      className="relative overflow-hidden bg-[#f8fbff] px-6 py-20 transition-colors dark:bg-[#030917]"
      aria-labelledby="hosting-title"
    >
      <div className="pointer-events-none absolute top-10 left-[10%] h-[380px] w-[380px] rounded-full bg-radial from-[#116cc6]/10 to-transparent blur-3xl dark:from-[#ffbc11]/8" />
      <div className="pointer-events-none absolute right-[10%] bottom-10 h-[420px] w-[420px] rounded-full bg-radial from-[#ffbc11]/10 to-transparent blur-3xl dark:from-[#116cc6]/8" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-center justify-center text-center"
        >
          <h2
            id="hosting-title"
            className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white"
          >
            Web Hosting Packages
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span
              className={`cursor-pointer text-xs font-bold transition-colors ${
                billingCycle === "monthly"
                  ? "text-[#116cc6] dark:text-[#ffbc11]"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={billingCycle === "yearly"}
              onClick={() =>
                setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
              }
              className="relative h-6 w-12 cursor-pointer rounded-full bg-[#116cc6] p-1 shadow-inner transition-colors focus:ring-2 focus:ring-[#116cc6]/50 focus:outline-none dark:bg-[#ffbc11] dark:focus:ring-[#ffbc11]/50"
            >
              <motion.div
                className="h-4 w-4 rounded-full bg-white shadow-md dark:bg-[#122035]"
                animate={{ x: billingCycle === "yearly" ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>

            <span
              className={`flex cursor-pointer items-center gap-2 text-xs font-bold transition-colors ${
                billingCycle === "yearly"
                  ? "text-[#116cc6] dark:text-[#ffbc11]"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
              <span className="rounded-full bg-[#ffbc11] px-2 py-0.5 text-[10px] font-black text-[#122035] uppercase shadow-sm dark:bg-[#116cc6] dark:text-white">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">Loading plans…</p>
        ) : plans.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No hosting plans yet.</p>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
            {plans.map((plan, index) => {
              const price =
                billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                    plan.popular
                      ? "border-2 border-[#116cc6] bg-white shadow-xl shadow-[#116cc6]/10 dark:border-[#ffbc11] dark:bg-[#07152b] dark:shadow-[#ffbc11]/10"
                      : "border border-slate-200/80 bg-white shadow-sm hover:border-[#116cc6]/40 dark:border-slate-800 dark:bg-[#071122] dark:hover:border-[#ffbc11]/40"
                  }`}
                >
                  {plan.badge ? (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#116cc6] px-4 py-1 text-[11px] font-black tracking-wider text-white uppercase shadow-md dark:bg-[#ffbc11] dark:text-[#122035]">
                      {plan.badge}
                    </div>
                  ) : null}

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="mt-2 min-h-[36px] text-xs text-slate-600 dark:text-slate-400">
                      {plan.description}
                    </p>

                    <div className="my-6 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        / month
                      </span>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-[10px] font-bold text-slate-700 dark:bg-[#0a1b36] dark:text-slate-300 sm:text-[11px]">
                      <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
                        <Zap className="h-3.5 w-3.5 shrink-0 text-[#116cc6] dark:text-[#ffbc11]" />
                        <span className="truncate">
                          {plan.features[0] || "Hosting"}
                        </span>
                      </span>
                      <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
                        <Server className="h-3.5 w-3.5 shrink-0 text-[#116cc6] dark:text-[#ffbc11]" />
                        <span className="truncate">
                          {plan.features[1] || "NVMe SSD"}
                        </span>
                      </span>
                    </div>

                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                          <Check className="h-4 w-4 flex-none text-emerald-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#contact"
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs font-extrabold transition-all duration-200 ${
                      plan.popular
                        ? "bg-[#116cc6] text-white shadow-md hover:bg-[#0b559e] dark:bg-[#ffbc11] dark:text-[#122035] dark:hover:bg-[#eaaa00]"
                        : "bg-slate-100 text-slate-900 hover:bg-[#116cc6] hover:text-white dark:bg-slate-800 dark:text-white dark:hover:bg-[#ffbc11] dark:hover:text-[#122035]"
                    }`}
                  >
                    {plan.ctaText}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
