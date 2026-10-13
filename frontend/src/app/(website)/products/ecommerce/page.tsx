"use client";

import { useState } from "react";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import FloatingContact from "@/components/website/FloatingContact";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Globe,
  Layers,
  LayoutDashboard,
  Lock,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Ticket,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const ECOMMERCE_CORE_FEATURES = [
  { icon: Lock, title: "Authentication", description: "Secure OTP login, SMS/Email verification, social logins & token session auth." },
  { icon: Package, title: "Products & Categories", description: "Multi-level category hierarchy, subcategories, product variants & image galleries." },
  { icon: Search, title: "Search & Filter", description: "Instant auto-complete search with history memory, price sliders & tag filters." },
  { icon: ShoppingBag, title: "Cart & Wishlist", description: "Real-time cart quantity controls, price calculation & server-synced wishlist." },
  { icon: CreditCard, title: "Checkout & Payments", description: "Fast checkout with EVC Plus, eDahab, Zaad, Sahal, Visa & Mastercard support." },
  { icon: Truck, title: "Orders & Tracking", description: "Real-time order status timeline, delivery courier assignment & push notifications." },
  { icon: Layers, title: "Inventory", description: "Automatic stock deduction, low-stock warnings & multi-warehouse inventory management." },
  { icon: Star, title: "Reviews & Ratings", description: "Customer product ratings, photo reviews & verified buyer badge verification." },
  { icon: Ticket, title: "Coupons & Discounts", description: "Promo code management, percentage/fixed discounts & flash sale timers." },
  { icon: LayoutDashboard, title: "Admin Dashboard", description: "Complete web management hub for store administrators & operational managers." },
  { icon: Users, title: "Customers & Users", description: "Customer directory, user roles, permission management & customer activity logs." },
  { icon: Settings, title: "Reports & Settings", description: "Sales revenue analytics, exportable reports, store profile & payment settings." },
];

const FEATURES = [
  {
    icon: CreditCard,
    title: "Local & Global Payments",
    description: "Seamlessly integrated with EVC Plus, eDahab, Zaad, Sahal, plus Visa & Mastercard.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Storefront",
    description: "Lightning-fast, ultra-responsive storefront optimized for smartphones and tablets.",
  },
  {
    icon: Package,
    title: "Inventory & Order Sync",
    description: "Real-time stock tracking, automatic low-stock alerts, and automated order fulfillment.",
  },
  {
    icon: BarChart3,
    title: "Sales & Analytics Dashboard",
    description: "Comprehensive reporting on revenue, top-selling items, customer retention, and trends.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    description: "SSL encryption, secure checkout tokens, and automated daily database backups.",
  },
  {
    icon: Globe,
    title: "Multi-Language & Currency",
    description: "Native support for Somali & English, with multi-currency checkout conversion.",
  },
];

export default function EcommerceProductPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] transition-colors duration-200 overflow-hidden">
        
        {/* ── Hero Section ── */}
        {/* ════════════════════════════════════════════════
            E-COMMERCE HERO (Matches Contact/Site Hero Style)
        ════════════════════════════════════════════════ */}
        <section
          className="relative flex flex-col items-center justify-center text-center px-6 pt-[calc(var(--header-height)+100px)] pb-24 overflow-hidden bg-[#f6f9ff] dark:bg-[#020b1d]"
        >
          {/* Ambient glow — matches contact & main hero style */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.13),transparent_70%)]" />
            <div className="absolute top-[40px] right-[-100px] w-[420px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.09),transparent_70%)]" />
            <div className="absolute bottom-[-20px] left-[-60px] w-[320px] h-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.07),transparent_70%)]" />
          </div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="relative z-10 text-[clamp(42px,5.4vw,72px)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[var(--foreground)] max-w-[760px]"
          >
            E-Commerce&nbsp;
            <span className="text-[#116cc6] dark:text-[#ffbc11]">System</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.16}
            className="relative z-10 mt-5 max-w-[560px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-[var(--muted)]"
          >
            Launch your online store, manage inventory seamlessly, and accept local mobile money (EVC Plus, eDahab) & credit cards in one platform.
          </motion.p>

          {/* Sample Design Image Mockup Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.24}
            className="relative z-10 mx-auto w-full max-w-[960px] mt-12 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_68px_rgba(9,32,56,0.16)] dark:shadow-[0_24px_68px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="relative w-full aspect-[16/9] bg-slate-950">
              <Image
                src="/images/ecommerce-system-sample.png"
                alt="E-Commerce System Sample Design Dashboard"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </section>

        {/* ── E-Commerce Core Features Section ── */}
        <section id="features" className="relative px-6 py-20 bg-[var(--background)]">
          <div className="mx-auto max-w-[1080px]">
            <div className="text-center mb-14">
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-black tracking-tight text-[var(--foreground)]">
                System Features
              </h2>
              <p className="mt-3 text-[15px] text-[var(--muted)] max-w-[580px] mx-auto leading-relaxed">
                Everything required to run a high-performance, enterprise-grade mobile & web retail platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ECOMMERCE_CORE_FEATURES.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index * 0.05}
                  className="group p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:border-[#116cc6] dark:hover:border-[#ffbc11] hover:shadow-[0_12px_36px_rgba(17,108,198,0.1)] dark:hover:shadow-[0_12px_36px_rgba(255,188,17,0.08)] hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <span className="flex w-10 h-10 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,#116cc6_10%,transparent)] text-[#116cc6] dark:bg-[color-mix(in_srgb,#ffbc11_12%,transparent)] dark:text-[#ffbc11] group-hover:bg-[#116cc6] group-hover:text-white dark:group-hover:bg-[#ffbc11] dark:group-hover:text-[#0c1624] transition-colors">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="text-[17px] font-extrabold text-[var(--foreground)]">{title}</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[var(--muted)] pl-0.5">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="relative px-6 pb-28">
          <div className="mx-auto max-w-[1020px]">
            <div className="relative rounded-3xl p-10 sm:p-14 border border-[var(--border)] bg-[var(--surface)] overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#116cc6]/10 via-transparent to-[#ffbc11]/8 pointer-events-none" />
              <h2 className="relative z-10 text-[clamp(24px,3vw,36px)] font-black text-[var(--foreground)] mb-4">
                Ready to Launch Your E-Commerce Store?
              </h2>
              <p className="relative z-10 text-[15px] text-[var(--muted)] max-w-[500px] mx-auto leading-relaxed mb-8">
                Contact our engineering team today for a customized demo and tailored setup strategy for your retail business.
              </p>
              <Link
                href="/contact"
                className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-full font-extrabold text-[15px] bg-[#116cc6] text-white hover:bg-[#0b559e] dark:bg-[#ffbc11] dark:text-[#0c1624] dark:hover:bg-[#eaaa00] transition-all shadow-[0_10px_28px_rgba(17,108,198,0.25)] dark:shadow-[0_10px_28px_rgba(255,188,17,0.2)] hover:-translate-y-0.5"
              >
                Contact Sales Team <ArrowRight className="w-4 h-4" />
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
