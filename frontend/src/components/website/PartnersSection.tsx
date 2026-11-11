"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"

import { partnersApi } from "@/api/home/partners"
import { motionInitial } from "@/lib/website-motion"
import { mediaUrl } from "@/api/uploads"

type ApiPartner = {
  id: number
  title: string
  image: string
  imageDark?: string | null
}

export default function PartnersSection() {
  const [isDark, setIsDark] = useState(false)
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-partners"],
    queryFn: () => partnersApi.getAll(),
  })

  const partners = data as ApiPartner[]
  const marqueePartners =
    partners.length > 0 ? [...partners, ...partners, ...partners] : []

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
      id="partners"
      className={`relative overflow-hidden border-y py-16 transition-colors duration-300 ${
        isDark ? "border-slate-800 bg-[#030a17]" : "border-slate-200 bg-slate-50"
      }`}
      aria-label="Technology Partners"
    >
      <div className="relative z-10 mx-auto max-w-[1320px] px-6">
        <motion.div
          initial={motionInitial}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center justify-center text-center"
        >
          <h2
            id="partners-title"
            className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 md:text-3xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Our Partners
          </h2>
          <div
            className={`mt-3 h-1 w-12 rounded-full transition-colors duration-300 ${
              isDark ? "bg-[#ffbc11]" : "bg-[#116cc6]"
            }`}
          />
        </motion.div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">Loading partners…</p>
        ) : partners.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No partners yet.</p>
        ) : (
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex w-max items-center gap-12 py-2 sm:gap-16 md:gap-20"
              animate={{ x: ["0%", "-33.333%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 20,
              }}
            >
              {marqueePartners.map((partner, index) => {
                const src = mediaUrl(
                  isDark && partner.imageDark ? partner.imageDark : partner.image,
                )
                return (
                  <div
                    key={`${partner.id}-${index}`}
                    className="relative flex h-24 w-48 flex-none items-center justify-center rounded-2xl p-4 transition-transform duration-300 hover:scale-105 sm:h-28 sm:w-56"
                  >
                    <div className="relative flex h-16 w-40 items-center justify-center sm:h-20 sm:w-48">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={`${partner.title} logo`}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span
                          className={`text-sm font-bold ${
                            isDark ? "text-white" : "text-slate-700"
                          }`}
                        >
                          {partner.title}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        )}

        <div
          className="mt-10 flex items-center justify-center gap-1.5"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((dot) => (
            <span
              key={`before-${dot}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                isDark ? "bg-slate-700" : "bg-slate-300"
              }`}
            />
          ))}
          <span
            className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
              isDark ? "bg-[#ffbc11]" : "bg-[#116cc6]"
            }`}
          />
          {[0, 1, 2, 3].map((dot) => (
            <span
              key={`after-${dot}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                isDark ? "bg-slate-700" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
