import { notFound } from "next/navigation"

import { AboutCompanyTable } from "@/components/system/about/about-company-table"
import { AboutCoreValuesTable } from "@/components/system/about/about-core-values-table"
import { AboutVisionMissionTable } from "@/components/system/about/about-vision-mission-table"
import { AboutWhyChooseTable } from "@/components/system/about/about-why-choose-table"
import { ContactFormTable } from "@/components/system/contacts/contact-form-table"
import { ContactHeroTable } from "@/components/system/contacts/contact-hero-table"
import { ContactInformationTable } from "@/components/system/contacts/contact-information-table"
import { AchievementsTable } from "@/components/system/home/achievements-table"
import { BlogCategoriesTable } from "@/components/system/home/blog-categories-table"
import { BlogsTable } from "@/components/system/home/blogs-table"
import { FaqsTable } from "@/components/system/home/faqs-table"
import { HostingTable } from "@/components/system/home/hosting-table"
import { PartnersTable } from "@/components/system/home/partners-table"
import { ServicesTable } from "@/components/system/home/services-table"
import { TestimonialsTable } from "@/components/system/home/testimonials-table"
import { DashboardPageShell } from "@/components/system/dashboard-page-shell"
import {
  getPageModule,
  getPageSection,
  pageModuleKeys,
} from "@/lib/dashboard-nav"

type Props = {
  params: Promise<{ page: string; section: string }>
}

export const dynamicParams = true

export function generateStaticParams() {
  return pageModuleKeys.flatMap((page) => {
    const pageModule = getPageModule(page)
    return (
      pageModule?.sections.map((section) => ({
        page,
        section: section.slug,
      })) ?? []
    )
  })
}

const homeSectionTables: Record<
  string,
  React.ComponentType<{ title: string; description: string }>
> = {
  services: ServicesTable,
  "web-hosting": HostingTable,
  "our-achievement": AchievementsTable,
  "our-partners": PartnersTable,
  "blog-category": BlogCategoriesTable,
  "recent-blogs": BlogsTable,
  "what-our-clients-says": TestimonialsTable,
  faq: FaqsTable,
}

const contactsSectionTables: Record<
  string,
  React.ComponentType<{ title: string; description: string }>
> = {
  hero: ContactHeroTable,
  "contact-information": ContactInformationTable,
  messages: ContactFormTable,
}

const aboutSectionTables: Record<
  string,
  React.ComponentType<{ title: string; description: string }>
> = {
  "about-company": AboutCompanyTable,
  "vision-mission": AboutVisionMissionTable,
  "core-values": AboutCoreValuesTable,
  "why-choose-us": AboutWhyChooseTable,
}

export default async function ManagementSectionPage({ params }: Props) {
  const { page, section } = await params
  const pageModule = getPageModule(page)
  const sectionItem = getPageSection(page, section)

  if (!pageModule || !sectionItem) notFound()

  if (page === "home") {
    const Table = homeSectionTables[section]
    if (!Table) notFound()

    return (
      <Table
        title={sectionItem.title}
        description={sectionItem.description}
      />
    )
  }

  if (page === "contacts") {
    const Table = contactsSectionTables[section]
    if (!Table) notFound()

    return (
      <Table
        title={sectionItem.title}
        description={sectionItem.description}
      />
    )
  }

  if (page === "about") {
    const Table = aboutSectionTables[section]
    if (!Table) notFound()

    return (
      <Table
        title={sectionItem.title}
        description={sectionItem.description}
      />
    )
  }

  return (
    <DashboardPageShell
      title={sectionItem.title}
      description={sectionItem.description}
      badge={pageModule.title}
      actionLabel={`Edit ${sectionItem.title}`}
    />
  )
}
