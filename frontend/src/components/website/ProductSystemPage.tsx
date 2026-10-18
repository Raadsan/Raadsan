"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ArrowRight, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { productsApi } from "@/api/products/products"
import Footer from "@/components/website/Footer"
import FloatingContact from "@/components/website/FloatingContact"
import Header from "@/components/website/Header"
import {
  iconFromFeatureTitle,
  resolveProductFeatureIcon,
} from "@/lib/product-feature-icons"

type ProductFeature = {
  icon?: string
  title: string
  description: string
}

type Product = {
  id: number
  title: string
  slug: string
  description: string
  features: ProductFeature[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
}

const SAMPLE_IMAGES: Record<string, { src: string; alt: string }> = {
  ecommerce: {
    src: "/images/ecommerce-system-sample.png",
    alt: "E-Commerce System Sample Design Dashboard",
  },
  "coffee-system": {
    src: "/images/coffee-system-sample.png",
    alt: "Coffee Shop POS System Sample Design Mockup",
  },
}

function splitTitle(title: string) {
  const parts = title.trim().split(/\s+/)
  if (parts.length < 2) return { lead: title, accent: "" }
  return {
    lead: parts.slice(0, -1).join(" "),
    accent: parts[parts.length - 1],
  }
}

export default function ProductSystemPage({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-product", slug],
    queryFn: () => productsApi.getBySlug(slug) as Promise<Product>,
  })

  const product = data
  const features = Array.isArray(product?.features) ? product.features : []
  const sample = SAMPLE_IMAGES[slug]
  const { lead, accent } = splitTitle(product?.title || "Product")

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[var(--background)] transition-colors duration-200">
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#f6f9ff] px-6 pt-[calc(var(--header-height)+100px)] pb-24 text-center dark:bg-[#020b1d]">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute top-[-60px] left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.13),transparent_70%)]" />
            <div className="absolute top-[40px] right-[-100px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.09),transparent_70%)]" />
            <div className="absolute bottom-[-20px] left-[-60px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.07),transparent_70%)]" />
          </div>

          {isLoading ? (
            <p className="relative z-10 text-[var(--muted)]">Loading product…</p>
          ) : error || !product ? (
            <p className="relative z-10 text-[var(--muted)]">
              Product not found.
            </p>
          ) : (
            <>
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.08}
                className="relative z-10 max-w-[760px] text-[clamp(42px,5.4vw,72px)] leading-[1.12] font-extrabold tracking-[-0.045em] text-[var(--foreground)]"
              >
                {lead}
                {accent ? (
                  <>
                    &nbsp;
                    <span className="text-[#116cc6] dark:text-[#ffbc11]">
                      {accent}
                    </span>
                  </>
                ) : null}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.16}
                className="relative z-10 mt-5 max-w-[560px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-[var(--muted)]"
              >
                {product.description}
              </motion.p>

              {sample ? (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.24}
                  className="relative z-10 mx-auto mt-12 w-full max-w-[960px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_68px_rgba(9,32,56,0.16)] dark:shadow-[0_24px_68px_rgba(0,0,0,0.5)]"
                >
                  <div className="relative aspect-[16/9] w-full bg-slate-950">
                    <Image
                      src={sample.src}
                      alt={sample.alt}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </motion.div>
              ) : null}
            </>
          )}
        </section>

        {product && features.length > 0 ? (
          <section id="features" className="relative bg-[var(--background)] px-6 py-20">
            <div className="mx-auto max-w-[1080px]">
              <div className="mb-14 text-center">
                <h2 className="text-[clamp(28px,3.5vw,42px)] font-black tracking-tight text-[var(--foreground)]">
                  System Features
                </h2>
                <p className="mx-auto mt-3 max-w-[580px] text-[15px] leading-relaxed text-[var(--muted)]">
                  Key capabilities included with {product.title}.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = resolveProductFeatureIcon(
                    feature.icon ||
                      iconFromFeatureTitle(feature.title, "package"),
                    Package,
                  )
                  return (
                    <motion.div
                      key={`${feature.title}-${index}`}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={index * 0.05}
                      className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#116cc6] hover:shadow-[0_12px_36px_rgba(17,108,198,0.1)] dark:hover:border-[#ffbc11] dark:hover:shadow-[0_12px_36px_rgba(255,188,17,0.08)]"
                    >
                      <div className="mb-3 flex items-center gap-3.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,#116cc6_10%,transparent)] text-[#116cc6] transition-colors group-hover:bg-[#116cc6] group-hover:text-white dark:bg-[color-mix(in_srgb,#ffbc11_12%,transparent)] dark:text-[#ffbc11] dark:group-hover:bg-[#ffbc11] dark:group-hover:text-[#0c1624]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="text-[17px] font-extrabold text-[var(--foreground)]">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="pl-0.5 text-[13px] leading-relaxed text-[var(--muted)]">
                        {feature.description}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section className="relative px-6 pb-28">
          <div className="mx-auto max-w-[1020px]">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center sm:p-14">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#116cc6]/10 via-transparent to-[#ffbc11]/8" />
              <h2 className="relative z-10 mb-4 text-[clamp(24px,3vw,36px)] font-black text-[var(--foreground)]">
                Ready to get started?
              </h2>
              <p className="relative z-10 mx-auto mb-8 max-w-[500px] text-[15px] leading-relaxed text-[var(--muted)]">
                Contact our team for a demo and tailored setup for your business.
              </p>
              <Link
                href="/contact"
                className="relative z-10 inline-flex items-center gap-2 rounded-full bg-[#116cc6] px-8 py-4 text-[15px] font-extrabold text-white shadow-[0_10px_28px_rgba(17,108,198,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#0b559e] dark:bg-[#ffbc11] dark:text-[#0c1624] dark:shadow-[0_10px_28px_rgba(255,188,17,0.2)] dark:hover:bg-[#eaaa00]"
              >
                Contact Sales Team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </>
  )
}
