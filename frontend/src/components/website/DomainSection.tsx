"use client";

import { motion } from "framer-motion";
import HeroDomainSearch from "./HeroDomainSearch";

export default function DomainSection() {
  return (
    <section
      id="domain-registration"
      className="relative overflow-hidden py-[110px] px-6 bg-[var(--surface)] dark:bg-[#050f20] max-[900px]:py-20 max-[480px]:py-[68px] max-[480px]:px-[18px]"
      aria-labelledby="domain-title"
    >
      {/* Decorative orbs */}
      <div className="absolute rounded-full pointer-events-none top-[90px] -left-[170px] w-[360px] h-[360px] bg-[radial-gradient(circle,rgba(17,108,198,0.15),transparent_68%)]" />
      <div className="absolute rounded-full pointer-events-none -right-[120px] -bottom-[80px] w-[340px] h-[340px] bg-[radial-gradient(circle,rgba(255,188,17,0.15),transparent_68%)]" />

      <div className="relative z-[1] w-[min(100%,1240px)] mx-auto">
        <motion.div
          className="max-w-[1000px] mx-auto mb-[42px] text-center max-[480px]:mb-[30px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
        >
       

          <h2
            id="domain-title"
            className="mt-[18px] mb-[18px] text-[var(--foreground)] text-[clamp(40px,4.4vw,60px)] leading-[1.1] tracking-[-0.045em] whitespace-nowrap max-[480px]:whitespace-normal max-[480px]:text-[38px]"
          >
            Find Your Perfect{" "}
            <span className="text-[#116cc6] dark:text-[#ffbc11]">Domain</span>
          </h2>

          <p className="max-w-[680px] mx-auto text-[var(--muted)] text-[17px] leading-[1.7]">
            Search availability across popular domain extensions instantly.
          </p>
        </motion.div>

        <HeroDomainSearch />
      </div>
    </section>
  );
}
