"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { motion, type Variants } from "framer-motion"
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Send,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

import { contactHeroApi } from "@/api/contacts/hero"
import { contactInformationApi } from "@/api/contacts/information"
import { contactFormApi } from "@/api/contacts/form"
import Header from "@/components/website/Header"
import Footer from "@/components/website/Footer"
import FloatingContact from "@/components/website/FloatingContact"
import { motionInitial } from "@/lib/website-motion"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
      delay,
    },
  }),
}

type ContactHero = {
  id: number
  title: string
  highlight?: string | null
  subtitle: string
}

type ContactInfo = {
  id: number
  icon: string
  label: string
  value: string
  href?: string | null
}

const CARD_ICONS = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
} as const

const FALLBACK_CARDS: ContactInfo[] = [
  {
    id: 1,
    icon: "mail",
    label: "Email Us",
    value: "info@raadsantech.so",
    href: "mailto:info@raadsantech.so",
  },
  {
    id: 2,
    icon: "phone",
    label: "Phone",
    value: "+252 61 4897510",
    href: "tel:+252614897510",
  },
  {
    id: 3,
    icon: "map",
    label: "Office",
    value: "HQ Digfeer, Hodan, Mogadishu, Somalia",
    href: null,
  },
]

function asList<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : data ? [data as T] : []
}

function heroParts(hero?: ContactHero) {
  const title = hero?.title?.trim() || "Contact"
  const highlight = hero?.highlight?.trim()
  if (highlight) return { title, highlight }

  const parts = title.split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return { title, highlight: "Our Team" }
  if (parts.length === 2) {
    return { title: parts[0], highlight: parts[1] }
  }
  return {
    title: parts.slice(0, -2).join(" "),
    highlight: parts.slice(-2).join(" "),
  }
}

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  })

  const { data: heroesData } = useQuery({
    queryKey: ["public-contact-hero"],
    queryFn: () => contactHeroApi.getAll(),
  })
  const { data: infoData } = useQuery({
    queryKey: ["public-contact-information"],
    queryFn: () => contactInformationApi.getAll(),
  })
  const hero = asList<ContactHero>(heroesData)[0]
  const { title: heroTitle, highlight: heroHighlight } = heroParts(hero)
  const heroSubtitle =
    hero?.subtitle ||
    "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."

  const apiCards = asList<ContactInfo>(infoData).filter(
    (item) => item.icon in CARD_ICONS,
  )
  const cards = apiCards.length > 0 ? apiCards : FALLBACK_CARDS

  const submitMutation = useMutation({
    mutationFn: contactFormApi.createSubmission,
    onSuccess: () => {
      setFormSubmitted(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
      })
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to send message")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitMutation.mutate(formData)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[var(--background)] transition-colors duration-200 overflow-hidden">
        {/* ════════════════════════════════════════════════
            CONTACT HERO
        ════════════════════════════════════════════════ */}
        <section
          className="relative flex flex-col items-center justify-center text-center px-6 pt-[calc(var(--header-height)+100px)] pb-24 overflow-hidden
                     bg-[#f6f9ff] dark:bg-[#020b1d]"
          aria-labelledby="contact-hero-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.13),transparent_70%)]" />
            <div className="absolute top-[40px] right-[-100px] w-[420px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.09),transparent_70%)]" />
            <div className="absolute bottom-[-20px] left-[-60px] w-[320px] h-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.07),transparent_70%)]" />
          </div>

          <motion.h1
            id="contact-hero-heading"
            variants={fadeUp}
            initial={motionInitial}
            animate="visible"
            custom={0.08}
            className="relative z-10 text-[clamp(42px,5.4vw,72px)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[var(--foreground)] max-w-[700px]"
          >
            {heroTitle}&nbsp;
            <span className="text-[#116cc6] dark:text-[#ffbc11]">
              {heroHighlight}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial={motionInitial}
            animate="visible"
            custom={0.16}
            className="relative z-10 mt-5 max-w-[560px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-[var(--muted)]"
          >
            {heroSubtitle}
          </motion.p>
        </section>

        {/* ════════════════════════════════════════════════
            CONTACT FORM + INFO
        ════════════════════════════════════════════════ */}
        <section
          className="relative px-6 pt-16 pb-28"
          aria-label="Contact form and information"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

          <div className="relative z-10 mx-auto max-w-[1200px]">
            <motion.div
              variants={fadeUp}
              initial={motionInitial}
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* ── Left Card: Contact Info ── */}
              <motion.div
                variants={fadeUp}
                initial={motionInitial}
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.05}
                className="lg:col-span-5 flex flex-col gap-6 bg-transparent px-1 py-7 sm:px-3 sm:py-10 lg:pr-8
                           border-0 shadow-none"
              >
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#116cc6] dark:text-[#ffbc11] mb-3">
                    Contact Information
                  </p>
                  <h2 className="text-[28px] sm:text-[32px] font-black leading-tight tracking-tight text-[var(--foreground)] mb-3">
                    Reach Out to&nbsp;
                    <span className="text-[#116cc6] dark:text-[#ffbc11]">
                      Our Team
                    </span>
                  </h2>
                  <p className="text-[14.5px] leading-relaxed text-[var(--muted)]">
                    Have a project in mind? Reach out and our team will get back
                    to you within 24 business hours.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {cards.map((item) => {
                    const Icon =
                      CARD_ICONS[item.icon as keyof typeof CARD_ICONS] || Mail
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-default
                                   border-[var(--border)] hover:border-[color-mix(in_srgb,#116cc6_40%,transparent)]
                                   bg-[color-mix(in_srgb,#116cc6_3%,var(--background))]
                                   dark:border-[rgba(255,255,255,0.08)] dark:hover:border-[color-mix(in_srgb,#ffbc11_40%,transparent)]
                                   dark:bg-[rgba(17,108,198,0.05)]"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-none
                                      bg-[color-mix(in_srgb,#116cc6_12%,transparent)] text-[#116cc6]
                                      dark:bg-[color-mix(in_srgb,#ffbc11_12%,transparent)] dark:text-[#ffbc11]"
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#116cc6] dark:text-[#ffbc11] block mb-1">
                            {item.label}
                          </span>
                          <p className="text-[13px] font-semibold text-[var(--foreground)] leading-snug whitespace-pre-line">
                            {item.href ? (
                              <a href={item.href} className="hover:underline">
                                {item.value}
                              </a>
                            ) : (
                              item.value
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Social links — static (not from CMS) */}
                <div className="flex items-center gap-2.5 pt-1">
                  {[
                    {
                      label: "Facebook",
                      href: "https://www.facebook.com/raadsantech",
                      icon: (
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
                        </svg>
                      ),
                    },
                    {
                      label: "Instagram",
                      href: "https://www.instagram.com/raadsantech/",
                      icon: (
                        <svg
                          className="h-4 w-4 fill-none stroke-current stroke-2"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle
                            cx="17.5"
                            cy="6.5"
                            r="1"
                            className="fill-current stroke-none"
                          />
                        </svg>
                      ),
                    },
                    {
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/company/raadsantech/posts/?feedView=all",
                      icon: (
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5ZM8 19H5V8h3v11ZM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764ZM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19Z" />
                        </svg>
                      ),
                    },
                    {
                      label: "WhatsApp",
                      href: "https://wa.me/252614897510",
                      icon: (
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                      ),
                    },
                  ].map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)]
                                 bg-[color-mix(in_srgb,#116cc6_6%,var(--background))] text-[#116cc6]
                                 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#116cc6] hover:bg-[#116cc6] hover:text-white
                                 dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,188,17,0.08)] dark:text-[#ffbc11]
                                 dark:hover:border-[#ffbc11] dark:hover:bg-[#ffbc11] dark:hover:text-[#0c1624]"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* ── Right Card: Form ── */}
              <motion.div
                variants={fadeUp}
                initial={motionInitial}
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.12}
                className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl flex flex-col p-9 sm:p-11
                           bg-[var(--surface)] border border-[var(--border)]
                           dark:bg-[#111d2e] dark:border-[rgba(255,255,255,0.07)]"
              >
                {formSubmitted ? (
                  <motion.div
                    initial={motionInitial}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-5 py-16 text-center"
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center
                                    bg-[color-mix(in_srgb,#116cc6_12%,transparent)] dark:bg-[color-mix(in_srgb,#ffbc11_12%,transparent)]"
                    >
                      <CheckCircle2 className="w-10 h-10 text-[#116cc6] dark:text-[#ffbc11]" />
                    </div>
                    <h3 className="text-[26px] font-black text-[var(--foreground)]">
                      Message Sent!
                    </h3>
                    <p className="text-[14.5px] text-[var(--muted)] max-w-sm leading-relaxed">
                      Thank you for contacting Raadsan Tech. Our team will get
                      in touch with you within 24 business hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-[14px]
                                 bg-[#116cc6] text-white hover:bg-[#0b559e]
                                 dark:bg-[#ffbc11] dark:text-[#0c1624] dark:hover:bg-[#eaaa00]
                                 transition-colors shadow-lg"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-7">
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#116cc6] dark:text-[#ffbc11] mb-2">
                        Send a Message
                      </p>
                      <h2 className="text-[26px] font-black tracking-tight text-[var(--foreground)]">
                        Fill Out the Form
                      </h2>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted)] mb-2">
                            Full Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Abdirahman Hassan"
                            className="w-full px-4 py-3.5 rounded-xl text-[14px] transition-all outline-none
                                       border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                                       focus:ring-2 focus:ring-[#116cc6] focus:border-[#116cc6]
                                       dark:border-[rgba(255,255,255,0.10)] dark:bg-[#0c1624] dark:text-white dark:placeholder:text-[#4a5d74]
                                       dark:focus:ring-[#ffbc11] dark:focus:border-[#ffbc11]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted)] mb-2">
                            Email Address
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="name@company.com"
                            className="w-full px-4 py-3.5 rounded-xl text-[14px] transition-all outline-none
                                       border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                                       focus:ring-2 focus:ring-[#116cc6] focus:border-[#116cc6]
                                       dark:border-[rgba(255,255,255,0.10)] dark:bg-[#0c1624] dark:text-white dark:placeholder:text-[#4a5d74]
                                       dark:focus:ring-[#ffbc11] dark:focus:border-[#ffbc11]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted)] mb-2">
                            Subject
                          </label>
                          <input
                            id="contact-subject"
                            type="text"
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subject: e.target.value,
                              })
                            }
                            placeholder="How can we help?"
                            className="w-full px-4 py-3.5 rounded-xl text-[14px] transition-all outline-none
                                       border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                                       focus:ring-2 focus:ring-[#116cc6] focus:border-[#116cc6]
                                       dark:border-[rgba(255,255,255,0.10)] dark:bg-[#0c1624] dark:text-white dark:placeholder:text-[#4a5d74]
                                       dark:focus:ring-[#ffbc11] dark:focus:border-[#ffbc11]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted)] mb-2">
                            Phone Number
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+252 61 XXX XXXX"
                            className="w-full px-4 py-3.5 rounded-xl text-[14px] transition-all outline-none
                                       border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                                       focus:ring-2 focus:ring-[#116cc6] focus:border-[#116cc6]
                                       dark:border-[rgba(255,255,255,0.10)] dark:bg-[#0c1624] dark:text-white dark:placeholder:text-[#4a5d74]
                                       dark:focus:ring-[#ffbc11] dark:focus:border-[#ffbc11]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted)] mb-2">
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          placeholder="Tell us about your project or inquiry..."
                          className="w-full px-4 py-3.5 rounded-xl text-[14px] transition-all outline-none resize-none
                                     border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                                     focus:ring-2 focus:ring-[#116cc6] focus:border-[#116cc6]
                                     dark:border-[rgba(255,255,255,0.10)] dark:bg-[#0c1624] dark:text-white dark:placeholder:text-[#4a5d74]
                                     dark:focus:ring-[#ffbc11] dark:focus:border-[#ffbc11]"
                        />
                      </div>

                      <button
                        id="contact-submit"
                        type="submit"
                        disabled={submitMutation.isPending}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-[14.5px] font-extrabold
                                   transition-all shadow-lg disabled:opacity-50 cursor-pointer
                                   bg-[#116cc6] text-white hover:bg-[#0b559e] hover:-translate-y-[2px]
                                   dark:bg-[#ffbc11] dark:text-[#0c1624] dark:hover:bg-[#eaaa00]
                                   shadow-[0_8px_22px_rgba(17,108,198,0.25)] dark:shadow-[0_8px_22px_rgba(255,188,17,0.2)]"
                      >
                        {submitMutation.isPending ? (
                          <>
                            <svg
                              className="w-4 h-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingContact />
    </>
  )
}
