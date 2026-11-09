export type PageModuleKey =
  | "home"
  | "about"
  | "products"
  | "contacts"

export type ModuleKey = "main" | "management" | "configuration" | PageModuleKey

export type PageSection = {
  title: string
  slug: string
  description: string
  url?: string
}

export type PageModule = {
  key: PageModuleKey
  title: string
  sections: PageSection[]
}

export const pageModules: PageModule[] = [
  {
    key: "home",
    title: "Home",
    sections: [
      {
        title: "Services",
        slug: "services",
        description: "Manage homepage services section content.",
      },
      {
        title: "Web Hosting",
        slug: "web-hosting",
        description: "Manage hosting packages shown on the homepage.",
      },
      {
        title: "Our Achievement",
        slug: "our-achievement",
        description: "Manage achievement stats and highlights.",
      },
      {
        title: "Our Partners",
        slug: "our-partners",
        description: "Manage partner logos and brand links.",
      },
      {
        title: "Blog Category",
        slug: "blog-category",
        description: "Manage blog categories used by recent blogs.",
      },
      {
        title: "Recent Blogs",
        slug: "recent-blogs",
        description: "Manage recent blog posts on the homepage.",
      },
      {
        title: "What Our Clients Says",
        slug: "what-our-clients-says",
        description: "Manage client testimonials section.",
      },
      {
        title: "FAQ",
        slug: "faq",
        description: "Manage frequently asked questions.",
      },
    ],
  },
  {
    key: "about",
    title: "About",
    sections: [
      {
        title: "About Company",
        slug: "about-company",
        description: "Manage company story and about image.",
      },
      {
        title: "Vision & Mission",
        slug: "vision-mission",
        description: "Manage vision and mission cards.",
      },
      {
        title: "Core Values",
        slug: "core-values",
        description: "Manage core values list.",
      },
      {
        title: "Why Choose Us",
        slug: "why-choose-us",
        description: "Manage why choose us reasons.",
      },
    ],
  },
  {
    key: "products",
    title: "Products",
    // Products are registered via CRUD — no hardcoded section cards
    sections: [],
  },
  {
    key: "contacts",
    title: "Contacts",
    sections: [
      {
        title: "Hero",
        slug: "hero",
        description: "Manage contact page hero title and subtitle.",
      },
      {
        title: "Contact Information",
        slug: "contact-information",
        description: "Manage email, phone, and office details.",
      },
      {
        title: "Messages",
        slug: "messages",
        description: "View messages clients send from the contact form.",
      },
    ],
  },
]

export const pageModuleKeys = pageModules.map((item) => item.key)

export function getPageModule(key: string): PageModule | undefined {
  return pageModules.find((item) => item.key === key)
}

export function getPageSection(
  page: string,
  section: string,
): PageSection | undefined {
  return getPageModule(page)?.sections.find((item) => item.slug === section)
}

export function getSectionUrl(page: PageModuleKey, sectionSlug: string) {
  const section = getPageSection(page, sectionSlug)
  if (section?.url) return section.url
  return `/management/${page}/${sectionSlug}`
}

export function getPageUrl(page: PageModuleKey) {
  return `/management/${page}`
}

/** @deprecated use pageModules home sections */
export const homeSections = pageModules[0].sections.map((section) => ({
  title: section.title,
  url: getSectionUrl("home", section.slug),
  description: section.description,
}))

export const managementItems = pageModules.map((item) => ({
  title: item.title,
  url: getPageUrl(item.key),
  module: item.key,
}))

export const configurationItems = [
  { title: "Roles", url: "/configuration/roles" },
  { title: "Users", url: "/configuration/users" },
  { title: "Menu", url: "/configuration/menu" },
  {
    title: "Role Permission",
    url: "/configuration/role-permission",
  },
] as const

export function getModuleFromPath(pathname: string): ModuleKey {
  for (const key of pageModuleKeys) {
    const base = `/dashboard/management/${key}`
    const shortBase = `/management/${key}`
    if (
      pathname === base ||
      pathname.startsWith(`${base}/`) ||
      pathname === shortBase ||
      pathname.startsWith(`${shortBase}/`)
    ) {
      return key
    }
  }
  if (
    pathname.startsWith("/dashboard/management") ||
    pathname.startsWith("/management")
  ) {
    return "management"
  }
  if (
    pathname.startsWith("/dashboard/configuration") ||
    pathname.startsWith("/configuration")
  ) {
    return "configuration"
  }
  return "main"
}
