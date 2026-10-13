"use client"

import { hostingApi } from "@/api/home/hosting"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }


export function HostingTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["hosting-plans"]}
      searchKey="name"
      getAll={hostingApi.getAll}
      create={hostingApi.create}
      update={hostingApi.update}
      remove={hostingApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "name", label: "Name", half: true },
        { key: "slug", label: "Slug", half: true },
        { key: "badge", label: "Badge", required: false, half: true },
        {
          key: "popular",
          label: "Popular",
          type: "checkbox",
          required: false,
          half: true,
        },
        { key: "monthlyPrice", label: "Monthly Price", type: "number", half: true },
        { key: "yearlyPrice", label: "Yearly Price", type: "number", half: true },
        { key: "ctaText", label: "CTA Text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "features", label: "Features", type: "list", hideInTable: true },
      ]}
    />
  )
}
