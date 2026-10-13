"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

import { testimonialsApi } from "@/api/home/testimonials"
import { mediaUrl } from "@/api/uploads"

type ApiTestimonial = {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  initials: string
  profile?: string | null
}

const avatarPalette = [
  "bg-[#116cc6]",
  "bg-[#087e53]",
  "bg-[#d97706]",
  "bg-[#6366f1]",
  "bg-[#ec4899]",
]

function InitialsAvatar({
  initials,
  colorClass,
}: {
  initials: string
  colorClass: string
}) {
  return (
    <div
      className={`flex h-10 w-10 flex-none items-center justify-center rounded-2xl text-xs font-extrabold text-white shadow-sm ${colorClass}`}
    >
      {initials}
    </div>
  )
}

function ProfileAvatar({ item }: { item: ApiTestimonial }) {
  const profileSrc = mediaUrl(item.profile)
  const [imgFailed, setImgFailed] = useState(false)
  const colorClass =
    avatarPalette[(item.id - 1) % avatarPalette.length] || avatarPalette[0]

  if (!profileSrc || imgFailed) {
    return (
      <InitialsAvatar initials={item.initials} colorClass={colorClass} />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profileSrc}
      alt={item.name}
      className="h-10 w-10 flex-none rounded-2xl object-cover shadow-sm"
      onError={() => setImgFailed(true)}
    />
  )
}

export default function TestimonialsSection() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: () => testimonialsApi.getAll(),
  })

  const testimonials = data as ApiTestimonial[]
  const marqueeTestimonials =
    testimonials.length > 0
      ? [...testimonials, ...testimonials, ...testimonials]
      : []

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-t border-slate-200/60 bg-[#f8fbff] py-20 transition-colors dark:border-slate-800/60 dark:bg-[#030917]"
      aria-labelledby="testimonials-title"
    >
      <div className="pointer-events-none absolute top-10 right-[10%] h-[350px] w-[350px] rounded-full bg-radial from-[#116cc6]/10 to-transparent blur-3xl dark:from-[#ffbc11]/8" />
      <div className="pointer-events-none absolute bottom-10 left-[10%] h-[380px] w-[380px] rounded-full bg-radial from-[#ffbc11]/10 to-transparent blur-3xl dark:from-[#116cc6]/8" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <h2
            id="testimonials-title"
            className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white"
          >
            What Our Clients Say
          </h2>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">
            Loading testimonials…
          </p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No testimonials yet.
          </p>
        ) : (
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <motion.div
              className="flex w-max items-stretch gap-6 py-4 sm:gap-8"
              animate={{ x: ["0%", "-33.333%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 25,
              }}
            >
              {marqueeTestimonials.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="group relative flex w-[320px] flex-none flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#116cc6]/40 hover:shadow-md sm:w-[380px] dark:border-slate-800 dark:bg-[#071328] dark:hover:border-[#ffbc11]/40"
                >
                  <Quote className="pointer-events-none absolute top-6 right-6 h-9 w-9 text-slate-200 opacity-60 dark:text-slate-800" />

                  <div>
                    <div className="mb-4 flex items-center gap-1 text-[#ffbc11]">
                      {Array.from({
                        length: Math.max(1, Math.min(5, item.rating || 5)),
                      }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#ffbc11]" />
                      ))}
                    </div>

                    <p className="mb-6 text-xs leading-relaxed font-normal text-slate-700 md:text-sm dark:text-slate-300">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  </div>

                  <div className="mt-auto flex items-center gap-3.5 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                    <ProfileAvatar item={item} />

                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 sm:text-sm dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {item.role} •{" "}
                        <span className="text-[#116cc6] dark:text-[#ffbc11]">
                          {item.company}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}
