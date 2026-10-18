"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Plus } from "lucide-react"

import { faqsApi } from "@/api/home/faqs"

type ApiFaq = {
  id: number
  question: string
  answer: string
  order?: number
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  const { data = [], isLoading } = useQuery({
    queryKey: ["public-faqs"],
    queryFn: () => faqsApi.getAll(),
  })

  const faqs = data as ApiFaq[]

  const toggleFAQ = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-slate-200/70 bg-white py-20 transition-colors dark:border-slate-800/70 dark:bg-[#020a1a]"
      aria-labelledby="faq-title"
    >
      <div className="pointer-events-none absolute top-1/4 left-[-10%] h-[400px] w-[400px] rounded-full bg-radial from-[#116cc6]/10 to-transparent blur-3xl dark:from-[#ffbc11]/8" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#116cc6]/10 px-3.5 py-1.5 text-xs font-bold text-[#116cc6] dark:bg-[#ffbc11]/10 dark:text-[#ffbc11]">
            <HelpCircle className="h-4 w-4" />
            <span>Got Questions?</span>
          </div>

          <h2
            id="faq-title"
            className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 max-w-xl text-xs text-slate-600 md:text-sm dark:text-slate-400">
            Everything you need to know about our services, cloud hosting,
            domains, and custom software solutions.
          </p>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">Loading FAQs…</p>
        ) : faqs.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No FAQs yet.</p>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {faqs.map((item, index) => {
              const isOpen = openId === item.id
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-[#f8fbff] transition-all duration-200 dark:border-slate-800 dark:bg-[#071328]"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#116cc6] sm:p-6"
                  >
                    <span className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                      {item.question}
                    </span>
                    <div
                      className={`flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-slate-200/60 text-slate-700 transition-transform duration-300 dark:bg-slate-800 dark:text-slate-300 ${
                        isOpen
                          ? "rotate-45 bg-[#116cc6] text-white dark:bg-[#ffbc11] dark:text-slate-950"
                          : ""
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="mt-1 border-t border-slate-200/50 px-5 pt-4 pb-6 text-xs leading-relaxed text-slate-600 sm:px-6 sm:text-sm dark:border-slate-800/50 dark:text-slate-300">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
