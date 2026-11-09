import { notFound } from "next/navigation"

import { PageSectionsOverview } from "@/components/system/page-sections-overview"
import { ProductsTable } from "@/components/system/products/products-table"
import { getPageModule, pageModuleKeys } from "@/lib/dashboard-nav"

type Props = {
  params: Promise<{ page: string }>
}

export const dynamicParams = true

export function generateStaticParams() {
  return pageModuleKeys.map((page) => ({ page }))
}

export default async function ManagementPageSections({ params }: Props) {
  const { page } = await params
  const pageModule = getPageModule(page)

  if (!pageModule) notFound()

  // Products: register items via CRUD (starts empty — no hardcoded cards)
  if (page === "products") {
    return <ProductsTable />
  }

  return <PageSectionsOverview page={pageModule} />
}
