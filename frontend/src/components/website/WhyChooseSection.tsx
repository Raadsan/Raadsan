"use client";

import { motion } from "framer-motion";
import { Globe2, LifeBuoy, LockKeyhole, Settings2, Users, Zap } from "lucide-react";

const reasons = [
  { icon: Users, title: "Experienced Technology Team", text: "Our multidisciplinary specialists combine technical expertise, creative thinking, and local market knowledge to solve complex challenges." },
  { icon: Settings2, title: "Solutions Built Around You", text: "We design every solution around your organization's goals, workflows, and users—so the technology delivers practical business value." },
  { icon: LifeBuoy, title: "Reliable Long-Term Support", text: "From planning and delivery to maintenance and growth, our team remains available with dependable guidance and responsive support." },
  { icon: Zap, title: "Scalable, Future-Ready Systems", text: "Our solutions are engineered to perform today and evolve tomorrow, giving your organization room to grow without unnecessary limitations." },
  { icon: LockKeyhole, title: "Security You Can Trust", text: "We apply dependable security practices throughout every project to protect your systems, business information, and users." },
  { icon: Globe2, title: "Local Insight, Global Quality", text: "We understand the local environment while applying modern international standards to deliver relevant, high-quality digital products." },
];

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function WhyChooseSection() {
  return (
    <section id="why-choose-us" className="scroll-mt-24 bg-white px-6 py-24 dark:bg-[#030d21]">
      <div className="mx-auto max-w-[1240px]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.5 }} className="mx-auto mb-16 max-w-[760px] text-center">
          <h2 className="text-[clamp(38px,4.5vw,56px)] font-black leading-tight tracking-[-0.04em]">Why Choose <span className="text-[#116cc6] dark:text-[#ffbc11]">Raadsan Technology?</span></h2>
          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-7 text-[var(--muted)] sm:text-[17px]">We build technology around real organizational needs, combining innovation, dependable delivery, and long-term partnership to help every client grow with confidence.</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }, index) => (
            <motion.article key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.4, delay: index * 0.07 }} className="group flex min-h-[390px] flex-col items-center rounded-2xl border border-slate-200/80 bg-white px-8 py-10 text-center shadow-[0_2px_6px_rgba(15,23,42,0.09)] transition-all duration-300 hover:-translate-y-1 hover:border-[#116cc6]/35 hover:shadow-[0_16px_34px_rgba(17,108,198,0.13)] dark:border-white/[0.08] dark:bg-[#0c1624] dark:hover:border-[#ffbc11]/35 sm:px-10">
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#116cc6]/[0.08] text-[#116cc6] transition-all duration-300 group-hover:bg-[#116cc6] group-hover:text-white dark:bg-[#ffbc11]/10 dark:text-[#ffbc11] dark:group-hover:bg-[#ffbc11] dark:group-hover:text-[#0c1624]"><Icon className="h-7 w-7 stroke-[1.8]" /></div>
              <h3 className="max-w-[280px] text-xl font-black leading-snug">{title}</h3>
              <p className="mt-5 max-w-[300px] text-[15px] leading-7 text-[var(--muted)]">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
