"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/website/Header";
import DomainSection from "@/components/website/DomainSection";
import ServicesSection from "@/components/website/ServicesSection";
import HostingPackagesSection from "@/components/website/HostingPackagesSection";
import AchievementsSection from "@/components/website/AchievementsSection";
import PartnersSection from "@/components/website/PartnersSection";
import BlogSection from "@/components/website/BlogSection";
import TestimonialsSection from "@/components/website/TestimonialsSection";
import FAQSection from "@/components/website/FAQSection";
import Footer from "@/components/website/Footer";
import FloatingContact from "@/components/website/FloatingContact";
import { motionInitial } from "@/lib/website-motion";

export default function Home() {
  return (
    <>
      <Header />

      {/* ─── Hero ─── */}
      <main
        id="home"
        className="relative min-h-screen overflow-hidden pt-[calc(104px+120px)] pb-10 px-6 bg-[#f6f9ff] dark:bg-[#020b1d] max-[900px]:pt-[calc(74px+82px)] max-[480px]:pt-[calc(74px+58px)] max-[480px]:px-[18px] max-[480px]:pb-7"
      >
        <section
          className="grid grid-cols-[minmax(0,0.88fr)_minmax(500px,1.12fr)] gap-[34px_48px] w-[min(100%,1420px)] mx-auto items-center max-[1080px]:grid-cols-[0.9fr_1.1fr] max-[1080px]:gap-[30px] max-[900px]:grid-cols-1"
          aria-labelledby="hero-title"
        >
          {/* Copy */}
          <motion.div
            initial={motionInitial}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[2] pl-[4px] max-[900px]:text-center"
          >
            <span className="inline-flex items-center gap-[11px] px-[17px] py-[10px] rounded-full bg-[color-mix(in_srgb,#116cc6_8%,transparent)] text-[#116cc6] text-[13px] font-extrabold tracking-[0.055em] uppercase max-[480px]:px-3 max-[480px]:py-2 max-[480px]:text-[11px]">
              <i className="block w-2 h-2 rounded-full bg-[#116cc6] shadow-[0_0_0_5px_color-mix(in_srgb,#116cc6_10%,transparent)]" />
              DIGITAL INNOVATION
            </span>

            <h1
              id="hero-title"
              className="mt-[25px] mb-[22px] text-[var(--foreground)] text-[clamp(52px,5.4vw,78px)] leading-[1.12] tracking-[-0.045em] max-[1080px]:text-[54px] max-[480px]:text-[43px] max-[480px]:my-5"
            >
              Your Vision.<br />
              Our <span className="text-[#116cc6] dark:text-[#ffbc11]">Technology.</span>
            </h1>

            <p className="max-w-[610px] m-0 text-[var(--muted)] text-[clamp(17px,1.5vw,21px)] leading-[1.65] max-[900px]:mx-auto">
              We build reliable digital solutions that help businesses streamline operations, improve efficiency, and grow in a connected world.
            </p>

            <div className="flex flex-wrap gap-[18px] mt-[34px] max-[900px]:justify-center">
              <Link
                className="inline-flex items-center justify-center gap-[22px] min-h-[60px] px-7 border-2 border-[#116cc6] rounded-2xl text-[16px] font-bold transition-all duration-180 bg-[#116cc6] shadow-[0_12px_28px_rgba(17,108,198,0.24)] text-white hover:bg-[#0b559e] hover:-translate-y-[2px] dark:border-[#ffbc11] dark:bg-[#ffbc11] dark:text-[#122035] dark:shadow-[0_12px_28px_rgba(255,188,17,0.18)] max-[480px]:w-full max-[480px]:min-h-[54px]"
                href="#all-services"
              >
                Explore Services{" "}
                <span className="text-[25px] leading-none transition-transform duration-180 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-[22px] min-h-[60px] px-7 border-2 border-[#116cc6] rounded-2xl text-[16px] font-bold transition-all duration-180 bg-transparent text-[#116cc6] hover:bg-[#116cc6]/10 hover:-translate-y-[2px] dark:border-[#ffbc11] dark:bg-transparent dark:text-[#ffbc11] dark:hover:bg-[#ffbc11]/10 max-[480px]:w-full max-[480px]:min-h-[54px]"
                href="/contact"
              >
                Let&apos;s Talk{" "}
                <span className="text-[25px] leading-none transition-transform duration-180" aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={motionInitial}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-w-0 aspect-[3/2] max-[900px]:w-[min(100%,700px)] max-[900px]:mx-auto"
            aria-label="Raadsan digital business dashboard"
          >
            <Image
              className="absolute inset-0 w-full h-full object-cover dark:hidden"
              src="/images/home-hero-image-light.png"
              alt="Raadsan dashboard displayed on desktop and mobile devices"
              width={1536}
              height={1024}
              priority
            />
            <Image
              className="absolute inset-0 w-full h-full object-cover hidden dark:block"
              src="/images/home-hero-image-dark.png"
              alt="Raadsan dark dashboard displayed on desktop and mobile devices"
              width={1536}
              height={1024}
              priority
            />
          </motion.div>
        </section>
      </main>

      <DomainSection />
      <ServicesSection limit={3} />
      <HostingPackagesSection />
      <AchievementsSection />
      <PartnersSection />
      <BlogSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />

      {/* Floating Chat & WhatsApp Buttons */}
      <FloatingContact />
    </>
  );
}
