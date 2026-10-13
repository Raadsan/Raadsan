import { notFound } from "next/navigation"

import { PageSectionsOverview } from "@/components/system/page-sections-overview"
import { getPageModule, pageModuleKeys } from "@/lib/dashboard-nav"

type Props = {
  params: Promise<{ page: string }>
}

export function generateStaticParams() {
  return pageModuleKeys.map((page) => ({ page }))
}

export default async function ManagementPageSections({ params }: Props) {
  const { page } = await params
  const pageModule = getPageModule(page)

  if (!pageModule) notFound()

  return <PageSectionsOverview page={pageModule} />
}
