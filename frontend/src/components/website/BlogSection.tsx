"use client"

import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"

import { blogsApi } from "@/api/home/blogs"
import { motionInitial } from "@/lib/website-motion"
import { mediaUrl } from "@/api/uploads"

type ApiBlog = {
  id: number
  title: string
  excerpt: string
  slug: string
  date: string
  readTime: string
  author: string
  image: string
  category?: { title: string }
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function BlogSection() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: () => blogsApi.getAll(),
  })

  const posts = (data as ApiBlog[]).slice(0, 3)

  return (
    <section
      id="blog"
      className="relative overflow-hidden py-20 px-6 bg-white dark:bg-[#020a1a] transition-colors"
      aria-labelledby="blog-title"
    >
      <div className="relative z-10 mx-auto max-w-[1320px]">
        <motion.div
          initial={motionInitial}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <h2
            id="blog-title"
            className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white"
          >
            Recent Blogs
          </h2>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">Loading blogs…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No blogs yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {posts.map((post, index) => {
              const imageSrc = mediaUrl(post.image) || "/images/home-hero-image-light.png"
              const isRemote = imageSrc.startsWith("http")
              return (
                <motion.article
                  key={post.id}
                  initial={motionInitial}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-[#071328]"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#0a1b36]">
                    {isRemote ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageSrc}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={imageSrc}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-[#116cc6] px-2.5 py-1 text-[9px] font-extrabold tracking-wider text-white uppercase dark:bg-[#ffbc11] dark:text-[#122035]">
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
                      <Link href={`/resources/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-200/50 px-6 pt-2 pb-6 dark:border-slate-800/50">
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
              )
            })}
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <Link
            href="/resources/blog"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#116cc6] px-7 py-3.5 text-xs font-extrabold text-[#116cc6] transition-all duration-200 hover:bg-[#116cc6] hover:text-white dark:border-[#ffbc11] dark:text-[#ffbc11] dark:hover:bg-[#ffbc11] dark:hover:text-[#122035]"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
