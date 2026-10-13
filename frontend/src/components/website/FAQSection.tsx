"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Plus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqList: FAQItem[] = [
  {
    id: "faq-1",
    question: "What web hosting packages does Raadsan Tech offer?",
    answer: "Raadsan Tech offers high-performance NVMe Cloud Hosting, cPanel Managed Hosting, Business Shared Hosting, and Dedicated Cloud Servers. All packages include free SSL certificates, automated daily backups, high-speed NVMe storage, and 99.9% uptime guarantee.",
  },
  {
    id: "faq-2",
    question: "How fast can custom software or ERP systems be developed?",
    answer: "Project timelines depend on system complexity. Standard web portals and mobile applications take 2–4 weeks, while full enterprise ERPs and multi-module management systems are delivered in structured 6–8 week sprints with continuous testing and deployment.",
  },
  {
    id: "faq-3",
    question: "Can I transfer my existing domain to Raadsan Technology?",
    answer: "Yes, transferring your domain to Raadsan Tech is quick and seamless. Simply request an authorization (EPP) code from your current registrar and enter it on our domain transfer page. Our team handles the configuration with zero downtime.",
  },
  {
    id: "faq-4",
    question: "What kind of technical support do you provide after project launch?",
    answer: "We provide true 24/7 technical support via WhatsApp, live phone, email, and support tickets. We also offer dedicated SLA maintenance packages, security updates, database optimization, and feature enhancements.",
  },
  {
    id: "faq-5",
    question: "What payment methods are supported for services and hosting?",
    answer: "We support instant local mobile payments (EVC Plus, Zaad, Sahal, Premier Bank, E-Dahab) as well as international Credit/Debit cards and Bank Wire Transfers.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-20 bg-white dark:bg-[#020a1a] transition-colors border-t border-slate-200/70 dark:border-slate-800/70"
      aria-labelledby="faq-title"
    >
      {/* Decorative Orbs */}
      <div className="pointer-events-none absolute top-1/4 left-[-10%] h-[400px] w-[400px] rounded-full bg-radial from-[#116cc6]/10 dark:from-[#ffbc11]/8 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#116cc6]/10 dark:bg-[#ffbc11]/10 text-[#116cc6] dark:text-[#ffbc11] text-xs font-bold mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>

          <h2
            id="faq-title"
            className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Everything you need to know about our services, cloud hosting, domains, and custom software solutions.
          </p>
        </motion.div>

        {/* Accordion List Container */}
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqList.map((item) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.4, delay: Number(item.id.split("-")[1]) * 0.05 }}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-[#f8fbff] dark:bg-[#071328] overflow-hidden transition-all duration-200"
              >
                {/* Accordion Header Button */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#116cc6]"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-none bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-transform duration-300 ${
                      isOpen ? "rotate-45 bg-[#116cc6] text-white dark:bg-[#ffbc11] dark:text-slate-950" : ""
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Body Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 mt-1 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
