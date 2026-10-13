"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import FloatingContact from "@/components/website/FloatingContact";
import ServicesSection from "@/components/website/ServicesSection";

const steps = [
  ["01", "Discover", "We understand your goals, users, challenges, and the result you need."],
  ["02", "Design", "We shape the right solution, scope, experience, and delivery plan."],
  ["03", "Deliver", "We build, test, launch, and support your solution with care."],
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-white text-[var(--foreground)] dark:bg-[#020917]">
        <section
          className="relative flex flex-col items-center justify-center overflow-hidden bg-[#f6f9ff] px-6 pb-24 pt-[calc(var(--header-height)+100px)] text-center dark:bg-[#020b1d]"
          aria-labelledby="services-hero-heading"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-1/2 top-[-60px] h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.13),transparent_70%)]" />
            <div className="absolute right-[-100px] top-[40px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.09),transparent_70%)]" />
            <div className="absolute bottom-[-20px] left-[-60px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.07),transparent_70%)]" />
          </div>

          <motion.h1
            id="services-hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="relative z-10 max-w-[700px] text-[clamp(42px,5.4vw,72px)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[var(--foreground)]"
          >
            Explore&nbsp;
            <span className="text-[#116cc6] dark:text-[#ffbc11]">Our Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
            className="relative z-10 mt-5 max-w-[620px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-[var(--muted)]"
          >
            From dependable infrastructure to custom software and AI, we deliver the technology your organization needs to grow.
          </motion.p>
        </section>

        <ServicesSection />

        <section className="bg-white px-6 py-24 dark:bg-[#020917]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#116cc6] dark:text-[#ffbc11]">How we work</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Clear from idea to impact.</h2>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {steps.map(([number, title, copy]) => (
                <div key={number} className="rounded-3xl border border-slate-200/80 p-8 dark:border-white/[0.08] dark:bg-[#071328]">
                  <span className="text-4xl font-black text-[#116cc6]/20 dark:text-[#ffbc11]/25">{number}</span>
                  <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-24 dark:bg-[#020917]">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-slate-200 bg-[#f7faff] px-8 py-12 shadow-[0_18px_55px_rgba(17,108,198,0.09)] dark:border-white/[0.08] dark:bg-[#08162c] md:px-12 md:py-14">
            <div className="relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
              <div className="flex max-w-3xl items-start gap-5">
                <div className="hidden h-14 w-14 flex-none items-center justify-center rounded-2xl bg-[#116cc6]/10 text-[#116cc6] dark:bg-[#ffbc11]/10 dark:text-[#ffbc11] sm:flex">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#116cc6] dark:text-[#ffbc11]">We&apos;re here to help</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">Not sure which service fits?</h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">Tell us what you want to improve. We will help you find the clearest path forward.</p>
                </div>
              </div>
              <Link href="/contact" className="inline-flex min-h-14 flex-none items-center gap-3 rounded-xl bg-[#116cc6] px-8 font-extrabold text-white shadow-lg shadow-[#116cc6]/20 transition hover:-translate-y-0.5 hover:bg-[#0b559e] dark:bg-[#ffbc11] dark:text-[#122035] dark:hover:bg-[#eaaa00]">
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
