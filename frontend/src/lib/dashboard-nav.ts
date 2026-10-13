export type PageModuleKey =
  | "home"
  | "about"
  | "services"
  | "products"
  | "resources"
  | "contacts"

export type ModuleKey = "main" | "management" | "configuration" | PageModuleKey

export type PageSection = {
  title: string
  slug: string
  description: string
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
        title: "Hero",
        slug: "hero",
        description: "Manage about page hero title and intro text.",
      },
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
        title: "Achievements",
        slug: "achievements",
        description: "Manage achievements shown on about page.",
      },
      {
        title: "Partners",
        slug: "partners",
        description: "Manage partners shown on about page.",
      },
      {
        title: "Why Choose Us",
        slug: "why-choose-us",
        description: "Manage why choose us reasons.",
      },
    ],
  },
  {
    key: "services",
    title: "Services",
    sections: [
      {
        title: "Hero",
        slug: "hero",
        description: "Manage services page hero content.",
      },
      {
        title: "Services List",
        slug: "services-list",
        description: "Manage service cards and details.",
      },
      {
        title: "How We Work",
        slug: "how-we-work",
        description: "Manage process steps section.",
      },
      {
        title: "Call To Action",
        slug: "cta",
        description: "Manage services CTA block.",
      },
    ],
  },
  {
    key: "products",
    title: "Products",
    sections: [
      {
        title: "E-Commerce System",
        slug: "ecommerce",
        description: "Manage ecommerce product page content.",
      },
      {
        title: "Coffee Shop System",
        slug: "coffee-system",
        description: "Manage coffee system product page content.",
      },
    ],
  },
  {
    key: "resources",
    title: "Resources",
    sections: [
      {
        title: "Blog",
        slug: "blog",
        description: "Manage blog posts and categories.",
      },
      {
        title: "Help Center",
        slug: "help-center",
        description: "Manage help center content and links.",
      },
    ],
  },
  {
    key: "contacts",
    title: "Contacts",
    sections: [
      {
        title: "Hero",
        slug: "hero",
        description: "Manage contact page hero content.",
      },
      {
        title: "Contact Information",
        slug: "contact-information",
        description: "Manage address, phone, and email details.",
      },
      {
        title: "Contact Form",
        slug: "contact-form",
        description: "Manage contact form fields and messages.",
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
  return `/dashboard/management/${page}/${sectionSlug}`
}

export function getPageUrl(page: PageModuleKey) {
  return `/dashboard/management/${page}`
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
  { title: "Roles", url: "/dashboard/configuration/roles" },
  { title: "Users", url: "/dashboard/configuration/users" },
  { title: "Menu", url: "/dashboard/configuration/menu" },
  {
    title: "Role Permission",
    url: "/dashboard/configuration/role-permission",
  },
] as const

export function getModuleFromPath(pathname: string): ModuleKey {
  for (const key of pageModuleKeys) {
    const base = `/dashboard/management/${key}`
    if (pathname === base || pathname.startsWith(`${base}/`)) {
      return key
    }
  }
  if (pathname.startsWith("/dashboard/management")) return "management"
  if (pathname.startsWith("/dashboard/configuration")) return "configuration"
  return "main"
}
