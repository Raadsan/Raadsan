"use client"

import { LazyMotion, domAnimation } from "framer-motion"

/**
 * Website routes group — public pages.
 * URLs stay the same: /, /about, /services, ...
 */
export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}
