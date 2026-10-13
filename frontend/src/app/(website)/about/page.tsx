"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  Globe2,
  HeartHandshake,
  Lightbulb,
  LifeBuoy,
  LockKeyhole,
  Medal,
  Settings2,
  ShieldCheck,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Header from "@/components/website/Header";
import AchievementsSection from "@/components/website/AchievementsSection";
import PartnersSection from "@/components/website/PartnersSection";
import Footer from "@/components/website/Footer";
import FloatingContact from "@/components/website/FloatingContact";
import WhyChooseSection from "@/components/website/WhyChooseSection";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const values = [
  { icon: Lightbulb, title: "Innovation", text: "We turn ambitious ideas into useful, future-ready digital products." },
  { icon: ShieldCheck, title: "Integrity", text: "We work transparently, communicate clearly, and keep every promise." },
  { icon: Medal, title: "Excellence", text: "We care about the details and hold every solution to a high standard." },
  { icon: HeartHandshake, title: "Partnership", text: "We grow alongside our clients through trust and shared success." },
];

export const reasons = [
  {
    icon: Users,
    title: "Experienced Technology Team",
    text: "Our multidisciplinary specialists combine technical expertise, creative thinking, and local market knowledge to solve complex challenges.",
  },
  {
    icon: Settings2,
    title: "Solutions Built Around You",
    text: "We design every solution around your organization’s goals, workflows, and users—so the technology delivers practical business value.",
  },
  {
    icon: LifeBuoy,
    title: "Reliable Long-Term Support",
    text: "From planning and delivery to maintenance and growth, our team remains available with dependable guidance and responsive support.",
  },
  {
    icon: Zap,
    title: "Scalable, Future-Ready Systems",
    text: "Our solutions are engineered to perform today and evolve tomorrow, giving your organization room to grow without unnecessary limitations.",
  },
  {
    icon: LockKeyhole,
    title: "Security You Can Trust",
    text: "We apply dependable security practices throughout every project to protect your systems, business information, and users.",
  },
  {
    icon: Globe2,
    title: "Local Insight, Global Quality",
    text: "We understand the local environment while applying modern international standards to deliver relevant, high-quality digital products.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
        {/* 1. Hero */}
        <section
          className="relative flex flex-col items-center justify-center overflow-hidden bg-[#f6f9ff] px-6 pb-24 pt-[calc(var(--header-height)+100px)] text-center dark:bg-[#020b1d]"
          aria-labelledby="about-hero-heading"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-1/2 top-[-60px] h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.13),transparent_70%)]" />
            <div className="absolute right-[-100px] top-[40px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.09),transparent_70%)]" />
            <div className="absolute bottom-[-20px] left-[-60px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.07),transparent_70%)]" />
          </div>
          <motion.h1
            id="about-hero-heading"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative z-10 max-w-[760px] text-[clamp(42px,5.4vw,72px)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[var(--foreground)]"
          >
            About <span className="text-[#116cc6] dark:text-[#ffbc11]">Us</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="relative z-10 mt-5 max-w-[620px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-[var(--muted)]"
          >
            Discover who we are, what drives us, and how we use technology to help businesses move forward.
          </motion.p>
        </section>

        {/* 2. About company */}
        <section id="about-company" className="px-6 py-24 bg-white dark:bg-[#030d21]">
          <div className="mx-auto grid max-w-[1280px] items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={reveal}
              transition={{ duration: 0.5 }}
              className="relative mx-auto aspect-[6/5] w-full max-w-[560px] overflow-hidden rounded-[34px] shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
            >
              <Image
                src="/images/about image.jpg"
                alt="Digital technology solutions represented above a laptop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 520px"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={reveal}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex h-full flex-col items-start"
            >
              <div>
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#116cc6] dark:text-[#ffbc11]">About our company</p>
                <div className="space-y-6 text-[16px] leading-8 text-[var(--muted)] sm:text-[17px]">
                  <p>Raadsan Technology is a technology and consulting firm delivering smart, scalable, and secure digital solutions that help organizations grow and innovate. We work with startups, enterprises, and public institutions to design and build modern systems, mobile applications, and AI-powered solutions.</p>
                  <p>Our focus is on creating reliable technology that solves real business challenges. By combining innovation, technical expertise, and strategic thinking, we empower organizations to streamline operations, enhance decision-making, and achieve sustainable long-term success.</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto">
                <Link
                  href="/#all-services"
                  className="inline-flex items-center gap-3 rounded-xl bg-[#116cc6] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(17,108,198,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#0b559e] dark:bg-[#ffbc11] dark:text-[#0c1624] dark:hover:bg-[#eaaa00]"
                >
                  Our Services <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-xl border-2 border-[#116cc6] bg-transparent px-7 py-3 text-sm font-extrabold text-[#116cc6] transition-all hover:-translate-y-0.5 hover:bg-[#116cc6]/10 dark:border-[#ffbc11] dark:text-[#ffbc11] dark:hover:bg-[#ffbc11]/10"
                >
                  Meet the Team <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Vision and mission */}
        <section id="mission-vision" className="px-6 py-24 bg-[#f6f9ff] dark:bg-[#020b1d]">
          <div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-2">
            {[
              { icon: Eye, label: "Our Vision", text: "To be a trusted technology partner that helps organizations across Somalia and beyond thrive in a connected world." },
              { icon: Target, label: "Our Mission", text: "To deliver accessible, dependable, and innovative digital solutions that create lasting value for our clients and communities." },
            ].map(({ icon: Icon, label, text }, index) => (
              <motion.article
                key={label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={reveal}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="group flex min-h-[380px] flex-col items-center justify-center rounded-[26px] border border-slate-200/80 bg-white px-8 py-12 text-center shadow-[0_3px_8px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-[#116cc6] hover:bg-[#116cc6] hover:shadow-[0_18px_36px_rgba(17,108,198,0.22)] dark:border-white/[0.08] dark:bg-[#0c1624] dark:hover:border-[#ffbc11] dark:hover:bg-[#ffbc11] dark:hover:shadow-[0_18px_36px_rgba(255,188,17,0.16)] sm:px-14"
              >
                <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#116cc6] text-white shadow-[0_5px_10px_rgba(15,23,42,0.20)] transition-colors duration-300 group-hover:bg-white group-hover:text-[#116cc6] dark:bg-[#ffbc11] dark:text-[#0c1624] dark:group-hover:bg-[#0c1624] dark:group-hover:text-[#ffbc11]">
                  <Icon className="h-9 w-9 stroke-[1.8]" />
                </div>
                <h3 className="mb-4 text-[28px] font-black transition-colors duration-300 group-hover:text-white dark:group-hover:text-[#0c1624] sm:text-[32px]">{label.replace("Our ", "")}</h3>
                <p className="max-w-[450px] text-[15px] leading-7 text-[var(--muted)] transition-colors duration-300 group-hover:text-white/90 dark:group-hover:text-[#0c1624]/80 sm:text-[16px]">{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* 4. Core values */}
        <section className="px-6 py-24 bg-white dark:bg-[#030d21]">
          <div className="mx-auto max-w-[1200px]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.5 }} className="mx-auto mb-14 max-w-[650px] text-center">
              
              <h2 className="text-[clamp(34px,4vw,48px)] font-black tracking-[-0.035em]">Our core values</h2>
            </motion.div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, text }, index) => (
                <motion.article key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.4, delay: index * 0.07 }} className="group rounded-2xl border border-slate-200/80 bg-[#f8fbff] p-7 transition hover:-translate-y-1 hover:border-[#116cc6]/30 hover:shadow-lg dark:border-white/[0.08] dark:bg-[#07142a] dark:hover:border-[#ffbc11]/30">
                  <Icon className="mb-6 h-7 w-7 text-[#116cc6] dark:text-[#ffbc11]" />
                  <h3 className="mb-3 text-xl font-extrabold">{title}</h3>
                  <p className="text-sm leading-6 text-[var(--muted)]">{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Achievements */}
        <AchievementsSection />

        {/* 6. Partners */}
        <PartnersSection />

        {/* 7. Why choose us */}
        <WhyChooseSection />
      </main>

      {/* 8. Footer */}
      <Footer />
      <FloatingContact />
    </>
  );
}
