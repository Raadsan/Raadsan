"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Clock, Tag, User } from "lucide-react"

import { blogsApi } from "@/api/home/blogs"
import { mediaUrl } from "@/api/uploads"
import Header from "@/components/website/Header"
import Footer from "@/components/website/Footer"
import FloatingContact from "@/components/website/FloatingContact"

type ApiCategory = {
  id: number
  title: string
  slug: string
}

type ApiBlog = {
  id: number
  title: string
  excerpt: string
  slug: string
  date: string
  readTime: string
  author: string
  image: string
  category?: { id: number; title: string; slug: string }
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function BlogImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
}) {
  const imageSrc = mediaUrl(src) || "/images/home-hero-image-light.png"
  const isRemote = imageSrc.startsWith("http")

  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageSrc} alt={alt} className={className ?? "h-full w-full object-cover"} />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className={className ?? "object-cover"}
      sizes={sizes}
    />
  )
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: () => blogsApi.getAll(),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ["public-blog-categories"],
    queryFn: () => blogsApi.getCategories(),
  })

  const posts = blogs as ApiBlog[]
  const categoryTitles = useMemo(
    () => ["All", ...(categories as ApiCategory[]).map((c) => c.title)],
    [categories],
  )

  const filtered = useMemo(() => {
    if (activeCategory === "All") return posts
    return posts.filter((p) => p.category?.title === activeCategory)
  }, [activeCategory, posts])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[var(--background)] transition-colors duration-200">
        <section
          className="relative flex flex-col items-center justify-center overflow-hidden bg-[#f6f9ff] px-6 pt-[calc(var(--header-height)+100px)] pb-24 text-center dark:bg-[#020b1d]"
          aria-labelledby="blog-hero-heading"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-[-60px] left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.13),transparent_70%)]" />
            <div className="absolute top-[40px] right-[-100px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.09),transparent_70%)]" />
          </div>

          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.04}
            className="relative z-10 mb-4 inline-block rounded-full border border-[color-mix(in_srgb,#116cc6_25%,transparent)] bg-[color-mix(in_srgb,#116cc6_8%,transparent)] px-4 py-1.5 text-[11px] font-extrabold tracking-widest text-[#116cc6] uppercase dark:border-[color-mix(in_srgb,#ffbc11_25%,transparent)] dark:bg-[color-mix(in_srgb,#ffbc11_8%,transparent)] dark:text-[#ffbc11]"
          >
            Raadsan Resources
          </motion.span>

          <motion.h1
            id="blog-hero-heading"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="relative z-10 max-w-[700px] text-[clamp(42px,5.4vw,72px)] leading-[1.12] font-extrabold tracking-[-0.045em] text-[var(--foreground)]"
          >
            Our&nbsp;
            <span className="text-[#116cc6] dark:text-[#ffbc11]">Blog</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.16}
            className="relative z-10 mt-5 max-w-[560px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-[var(--muted)]"
          >
            Insights, guides, and stories from the Raadsan Tech team — helping
            you stay ahead in a rapidly evolving digital world.
          </motion.p>
        </section>

        <section className="relative px-6 pt-14 pb-4">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-2"
            >
              {categoryTitles.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-200 ${
                    activeCategory === cat
                      ? "border-[#116cc6] bg-[#116cc6] text-white dark:border-[#ffbc11] dark:bg-[#ffbc11] dark:text-[#0c1624]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[#116cc6] hover:text-[#116cc6] dark:hover:border-[#ffbc11] dark:hover:text-[#ffbc11]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {isLoading ? (
          <p className="px-6 py-20 text-center text-sm text-slate-500">
            Loading blogs…
          </p>
        ) : !featured ? (
          <p className="px-6 py-20 text-center text-sm text-slate-500">
            No blogs yet.
          </p>
        ) : (
          <>
            <section className="relative px-6 pt-8 pb-4">
              <div className="mx-auto max-w-[1200px]">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0}
                >
                  <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(17,108,198,0.12)] sm:p-12 dark:hover:shadow-[0_20px_60px_rgba(17,108,198,0.2)]">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#116cc6]/8 via-transparent to-[#ffbc11]/5" />
                    <span className="relative z-10 mb-5 inline-block rounded-full bg-[#116cc6] px-3 py-1 text-[10px] font-extrabold tracking-widest text-white uppercase dark:bg-[#ffbc11] dark:text-[#0c1624]">
                      Featured
                    </span>
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end">
                      <div className="flex-1">
                        <span className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#116cc6] uppercase dark:text-[#ffbc11]">
                          <Tag className="h-3.5 w-3.5" />
                          {featured.category?.title ?? "Blog"}
                        </span>
                        <h2 className="mb-4 max-w-[680px] text-[clamp(24px,3vw,38px)] leading-tight font-black tracking-tight text-[var(--foreground)]">
                          {featured.title}
                        </h2>
                        <p className="mb-6 max-w-[600px] text-[15px] leading-relaxed text-[var(--muted)]">
                          {featured.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-[12px] font-semibold text-[var(--muted)]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(featured.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {featured.readTime}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/resources/blog/${featured.slug}`}
                        className="flex flex-none items-center gap-2 rounded-full bg-[#116cc6] px-7 py-3.5 text-[14px] font-extrabold text-white shadow-[0_8px_22px_rgba(17,108,198,0.25)] transition-all hover:-translate-y-px hover:bg-[#0b559e] dark:bg-[#ffbc11] dark:text-[#0c1624] dark:shadow-[0_8px_22px_rgba(255,188,17,0.2)] dark:hover:bg-[#eaaa00]"
                      >
                        Read Article <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="relative px-6 pt-8 pb-28">
              <div className="mx-auto max-w-[1200px]">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {rest.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -6 }}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/60 shadow-sm transition-all duration-300 hover:border-[#116cc6]/40 hover:shadow-md dark:border-slate-800 dark:bg-[#071328] dark:hover:border-[#ffbc11]/40"
                    >
                      <div>
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#0a1b36]">
                          <BlogImage
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <span className="absolute top-4 left-4 rounded-full bg-[#116cc6] px-3 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md dark:bg-[#ffbc11] dark:text-[#122035]">
                            {post.category?.title ?? "Blog"}
                          </span>
                        </div>

                        <div className="p-6">
                          <div className="mb-3 flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-[#116cc6] dark:text-[#ffbc11]" />
                              {formatDate(post.date)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-[#116cc6] dark:text-[#ffbc11]" />
                              {post.readTime}
                            </span>
                          </div>

                          <h3 className="line-clamp-2 text-base leading-snug font-extrabold text-slate-900 transition-colors group-hover:text-[#116cc6] dark:text-white dark:group-hover:text-[#ffbc11]">
                            <Link href={`/resources/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>

                          <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-200/50 px-6 pt-2 pb-6 dark:border-slate-800/50">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          <User className="h-3.5 w-3.5 text-[#116cc6] dark:text-[#ffbc11]" />
                          {post.author}
                        </span>
                        <Link
                          href={`/resources/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-extrabold text-[#116cc6] transition-all hover:gap-2 dark:text-[#ffbc11]"
                        >
                          Read More
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
      <FloatingContact />
    </>
  )
}
