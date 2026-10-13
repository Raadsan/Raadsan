"use client";

import { useState } from "react";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import FloatingContact from "@/components/website/FloatingContact";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowRight, Send, CheckCircle2 } from "lucide-react";

/* ─── Fade-in animation variant ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1100);
  };

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
          {/* Ambient glow — matches home hero style */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.13),transparent_70%)]" />
            <div className="absolute top-[40px] right-[-100px] w-[420px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.09),transparent_70%)]" />
            <div className="absolute bottom-[-20px] left-[-60px] w-[320px] h-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.07),transparent_70%)]" />
          </div>

          {/* Heading */}
          <motion.h1
            id="contact-hero-heading"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="relative z-10 text-[clamp(42px,5.4vw,72px)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[var(--foreground)] max-w-[700px]"
          >
            Contact&nbsp;
            <span className="text-[#116cc6] dark:text-[#ffbc11]">Our Team</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.16}
            className="relative z-10 mt-5 max-w-[560px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-[var(--muted)]"
          >
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </motion.p>
        </section>

        {/* ════════════════════════════════════════════════
            CONTACT FORM + INFO
        ════════════════════════════════════════════════ */}
        <section
          className="relative px-6 pt-16 pb-28"
          aria-label="Contact form and information"
        >
          {/* subtle top separator line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

          <div className="relative z-10 mx-auto max-w-[1200px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >

              {/* ── Left Card: Contact Info ── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.05}
                className="lg:col-span-5 flex flex-col gap-6 bg-transparent px-1 py-7 sm:px-3 sm:py-10 lg:pr-8
                           border-0 shadow-none"
              >
                {/* Header text */}
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#116cc6] dark:text-[#ffbc11] mb-3">
                    Contact Information
                  </p>
                  <h2 className="text-[28px] sm:text-[32px] font-black leading-tight tracking-tight text-[var(--foreground)] mb-3">
                    Reach Out to&nbsp;
                    <span className="text-[#116cc6] dark:text-[#ffbc11]">Our Team</span>
                  </h2>
                  <p className="text-[14.5px] leading-relaxed text-[var(--muted)]">
                    Have a project in mind? Reach out and our team will get back
                    to you within 24 business hours.
                  </p>
                </div>

                {/* Contact Info Cards */}
                <div className="flex flex-col gap-3">
                  {[
                    {
                      Icon: Mail,
                      label: "Email Us",
                      value: "info@raadsantech.so",
                    },
                    {
                      Icon: Phone,
                      label: "Phone",
                      value: "+252 61 4897510",
                    },
                    {
                      Icon: MapPin,
                      label: "Office",
                      value: "HQ Digfeer, Hodan, Mogadishu, Somalia",
                    },
                  ].map(({ Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-default
                                 border-[var(--border)] hover:border-[color-mix(in_srgb,#116cc6_40%,transparent)]
                                 bg-[color-mix(in_srgb,#116cc6_3%,var(--background))]
                                 dark:border-[rgba(255,255,255,0.08)] dark:hover:border-[color-mix(in_srgb,#ffbc11_40%,transparent)]
                                 dark:bg-[rgba(17,108,198,0.05)]"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-none
                                      bg-[color-mix(in_srgb,#116cc6_12%,transparent)] text-[#116cc6]
                                      dark:bg-[color-mix(in_srgb,#ffbc11_12%,transparent)] dark:text-[#ffbc11]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#116cc6] dark:text-[#ffbc11] block mb-1">
                          {label}
                        </span>
                        <p className="text-[13px] font-semibold text-[var(--foreground)] leading-snug whitespace-pre-line">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social media links */}
                <div className="flex items-center gap-4 pt-1">
                 
                  <div className="flex items-center gap-2.5">
                    {[
                      {
                        label: "Facebook",
                        href: "https://facebook.com",
                        icon: (
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
                          </svg>
                        ),
                      },
                      {
                        label: "Instagram",
                        href: "https://instagram.com",
                        icon: (
                          <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
                          </svg>
                        ),
                      },
                      {
                        label: "LinkedIn",
                        href: "https://linkedin.com",
                        icon: (
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5ZM8 19H5V8h3v11ZM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764ZM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19Z" />
                          </svg>
                        ),
                      },
                      {
                        label: "GitHub",
                        href: "https://github.com",
                        icon: (
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
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
                </div>

              </motion.div>

              {/* ── Right Card: Form ── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.12}
                className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl flex flex-col p-9 sm:p-11
                           bg-[var(--surface)] border border-[var(--border)]
                           dark:bg-[#111d2e] dark:border-[rgba(255,255,255,0.07)]"
              >
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-5 py-16 text-center"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center
                                    bg-[color-mix(in_srgb,#116cc6_12%,transparent)] dark:bg-[color-mix(in_srgb,#ffbc11_12%,transparent)]">
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

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      {/* Row 1: Name + Email */}
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
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@company.com"
                            className="w-full px-4 py-3.5 rounded-xl text-[14px] transition-all outline-none
                                       border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                                       focus:ring-2 focus:ring-[#116cc6] focus:border-[#116cc6]
                                       dark:border-[rgba(255,255,255,0.10)] dark:bg-[#0c1624] dark:text-white dark:placeholder:text-[#4a5d74]
                                       dark:focus:ring-[#ffbc11] dark:focus:border-[#ffbc11]"
                          />
                        </div>
                      </div>

                      {/* Row 2: Subject + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted)] mb-2">
                            Subject
                          </label>
                          <input
                            id="contact-subject"
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+252 61 XXX XXXX"
                            className="w-full px-4 py-3.5 rounded-xl text-[14px] transition-all outline-none
                                       border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                                       focus:ring-2 focus:ring-[#116cc6] focus:border-[#116cc6]
                                       dark:border-[rgba(255,255,255,0.10)] dark:bg-[#0c1624] dark:text-white dark:placeholder:text-[#4a5d74]
                                       dark:focus:ring-[#ffbc11] dark:focus:border-[#ffbc11]"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted)] mb-2">
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about your project or inquiry..."
                          className="w-full px-4 py-3.5 rounded-xl text-[14px] transition-all outline-none resize-none
                                     border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                                     focus:ring-2 focus:ring-[#116cc6] focus:border-[#116cc6]
                                     dark:border-[rgba(255,255,255,0.10)] dark:bg-[#0c1624] dark:text-white dark:placeholder:text-[#4a5d74]
                                     dark:focus:ring-[#ffbc11] dark:focus:border-[#ffbc11]"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        id="contact-submit"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-[14.5px] font-extrabold
                                   transition-all shadow-lg disabled:opacity-50 cursor-pointer
                                   bg-[#116cc6] text-white hover:bg-[#0b559e] hover:-translate-y-[2px]
                                   dark:bg-[#ffbc11] dark:text-[#0c1624] dark:hover:bg-[#eaaa00]
                                   shadow-[0_8px_22px_rgba(17,108,198,0.25)] dark:shadow-[0_8px_22px_rgba(255,188,17,0.2)]"
                      >
                        {isSubmitting ? (
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
  );
}
