"use client"

import Image from "next/image"
import Link from "next/link"
import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react"

import { blogsApi } from "@/api/home/blogs"
import { mediaUrl } from "@/api/uploads"
import Header from "@/components/website/Header"
import Footer from "@/components/website/Footer"
import FloatingContact from "@/components/website/FloatingContact"
import { motionInitial } from "@/lib/website-motion"

type ApiBlog = {
  id: number
  title: string
  excerpt: string
  slug: string
  content: string
  hashtags?: string[]
  date: string
  readTime: string
  author: string
  image: string
  category?: { id: number; title: string; slug: string }
}

import type { Variants } from "framer-motion"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
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
  priority,
  fill,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
}) {
  const imageSrc = mediaUrl(src) || "/images/home-hero-image-light.png"
  const isRemote = imageSrc.startsWith("http")

  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        className={
          fill
            ? `absolute inset-0 h-full w-full ${className ?? "object-cover"}`
            : (className ?? "h-full w-full object-cover")
        }
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className ?? "object-cover"}
      sizes={sizes}
    />
  )
}

/** Renders simple markdown-ish content: **bold**, numbered lists, bullet lists */
function BlogContent({ content }: { content: string }) {
  const paragraphs = content.trim().split(/\n\n+/)

  return (
    <div className="prose-custom flex flex-col gap-5">
      {paragraphs.map((block, i) => {
        const trimmed = block.trim()

        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(Boolean)
          return (
            <ol key={i} className="flex list-decimal flex-col gap-2 pl-5">
              {items.map((item, j) => (
                <li
                  key={j}
                  className="text-[15px] leading-relaxed text-[var(--foreground)]"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item
                        .replace(/^\d+\.\s/, "")
                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                </li>
              ))}
            </ol>
          )
        }

        if (/^[-•]\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(Boolean)
          return (
            <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
              {items.map((item, j) => (
                <li
                  key={j}
                  className="text-[15px] leading-relaxed text-[var(--foreground)]"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item
                        .replace(/^[-•]\s/, "")
                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                </li>
              ))}
            </ul>
          )
        }

        if (/^\*\*(.+)\*\*$/.test(trimmed)) {
          return (
            <h3
              key={i}
              className="mt-2 text-[19px] font-black tracking-tight text-[var(--foreground)]"
            >
              {trimmed.replace(/\*\*/g, "")}
            </h3>
          )
        }

        if (/^\*(.+)\*$/.test(trimmed)) {
          return (
            <p
              key={i}
              className="text-[14px] font-extrabold tracking-widest text-[#116cc6] uppercase dark:text-[#ffbc11]"
            >
              {trimmed.replace(/\*/g, "")}
            </p>
          )
        }

        return (
          <p
            key={i}
            className="text-[15px] leading-[1.8] text-[var(--foreground)]"
            dangerouslySetInnerHTML={{
              __html: trimmed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
            }}
          />
        )
      })}
    </div>
  )
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-blog", slug],
    queryFn: () => blogsApi.getBySlug(slug),
    enabled: Boolean(slug),
    retry: false,
  })

  const { data: allBlogs = [] } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: () => blogsApi.getAll(),
  })

  const blog = post as ApiBlog | undefined
  const related = ((allBlogs as ApiBlog[]) || [])
    .filter(
      (p) =>
        p.slug !== slug &&
        blog?.category?.id &&
        p.category?.id === blog.category.id,
    )
    .slice(0, 2)

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] pt-[calc(var(--header-height)+36px)]">
          <p className="text-sm text-slate-500">Loading article…</p>
        </main>
        <Footer />
        <FloatingContact />
      </>
    )
  }

  if (isError || !blog) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] pt-[calc(var(--header-height)+36px)] px-6">
          <p className="text-sm text-slate-500">Article not found.</p>
          <Link
            href="/resources/blog"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#116cc6] dark:text-[#ffbc11]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Link>
        </main>
        <Footer />
        <FloatingContact />
      </>
    )
  }

  const hashtags = Array.isArray(blog.hashtags) ? blog.hashtags : []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] pt-[calc(var(--header-height)+36px)] pb-24 transition-colors duration-200">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="mb-6">
            <Link
              href="/resources/blog"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-[var(--muted)] transition-colors hover:text-[#116cc6] dark:hover:text-[#ffbc11]"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blogs
            </Link>
          </div>

          <motion.div
            variants={fadeUp}
            initial={motionInitial}
            animate="visible"
            custom={0.02}
            className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[#071328] shadow-xl"
          >
            <BlogImage
              src={blog.image}
              alt={blog.title}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 960px) 100vw, 960px"
            />
            <span className="absolute top-5 right-5 z-10 rounded-full bg-[#116cc6] px-3.5 py-1.5 text-[11px] font-extrabold tracking-wider text-white uppercase shadow-lg dark:bg-[#ffbc11] dark:text-[#122035]">
              {blog.category?.title ?? "Blog"}
            </span>
          </motion.div>

          <article className="w-full">
            <motion.div
              variants={fadeUp}
              initial={motionInitial}
              animate="visible"
              custom={0.04}
              className="mb-5 flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[var(--muted)]"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#116cc6] dark:text-[#ffbc11]" />
                {formatDate(blog.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#116cc6] dark:text-[#ffbc11]" />
                {blog.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#116cc6] dark:text-[#ffbc11]" />
                {blog.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[#116cc6] dark:text-[#ffbc11]" />
                {blog.category?.title ?? "Blog"}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial={motionInitial}
              animate="visible"
              custom={0.08}
              className="mb-5 text-[clamp(24px,3.5vw,36px)] leading-tight font-black tracking-[-0.03em] text-[var(--foreground)]"
            >
              {blog.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial={motionInitial}
              animate="visible"
              custom={0.12}
              className="mb-6 text-[16.5px] leading-[1.7] text-[var(--muted)]"
            >
              {blog.excerpt}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial={motionInitial}
              animate="visible"
              custom={0.16}
            >
              <BlogContent content={blog.content || ""} />
            </motion.div>

            {hashtags.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial={motionInitial}
                animate="visible"
                custom={0.2}
                className="mt-8 flex flex-wrap gap-2"
              >
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[12px] font-semibold text-[#116cc6] dark:text-[#ffbc11]"
                  >
                    #{String(tag).replace(/^#/, "")}
                  </span>
                ))}
              </motion.div>
            )}

            <div className="my-12 h-px bg-[var(--border)]" />

            <motion.div
              variants={fadeUp}
              initial={motionInitial}
              whileInView="visible"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#116cc6]/8 via-transparent to-[#ffbc11]/5" />
              <p className="relative z-10 mb-2 text-[11px] font-extrabold tracking-widest text-[#116cc6] uppercase dark:text-[#ffbc11]">
                Work With Us
              </p>
              <h3 className="relative z-10 mb-3 text-[20px] font-black text-[var(--foreground)]">
                Have a project in mind?
              </h3>
              <p className="relative z-10 mb-6 text-[14px] text-[var(--muted)]">
                Let&apos;s talk about how Raadsan Tech can help you achieve your
                goals.
              </p>
              <Link
                href="/contact"
                className="relative z-10 inline-flex items-center gap-2 rounded-full bg-[#116cc6] px-7 py-3.5 text-[14px] font-extrabold text-white shadow-[0_8px_22px_rgba(17,108,198,0.25)] transition-all hover:-translate-y-px hover:bg-[#0b559e] dark:bg-[#ffbc11] dark:text-[#0c1624] dark:shadow-[0_8px_22px_rgba(255,188,17,0.2)] dark:hover:bg-[#eaaa00]"
              >
                Contact Us <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </motion.div>
          </article>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-10 max-w-[960px] px-6 pb-24">
            <h2 className="mb-6 text-[20px] font-black tracking-tight text-[var(--foreground)]">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {related.map((r, index) => (
                <motion.div
                  key={r.slug}
                  variants={fadeUp}
                  initial={motionInitial}
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index * 0.1}
                >
                  <Link
                    href={`/resources/blog/${r.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#116cc6]/40 hover:shadow-md dark:border-slate-800 dark:bg-[#071328] dark:hover:border-[#ffbc11]/40"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-[#0a1b36]">
                      <BlogImage
                        src={r.image}
                        alt={r.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="50vw"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-[#116cc6] px-2.5 py-1 text-[9px] font-extrabold tracking-wider text-white uppercase dark:bg-[#ffbc11] dark:text-[#122035]">
                        {r.category?.title ?? "Blog"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-[14px] leading-snug font-extrabold text-slate-900 transition-colors group-hover:text-[#116cc6] dark:text-white dark:group-hover:text-[#ffbc11]">
                        {r.title}
                      </h3>
                      <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[var(--muted)]">
                        <Calendar className="h-3 w-3" /> {formatDate(r.date)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <FloatingContact />
    </>
  )
}
