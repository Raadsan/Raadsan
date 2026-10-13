"use client"

import { servicesApi } from "@/api/home/services"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function ServicesTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["services"]}
      searchKey="title"
      getAll={servicesApi.getAll}
      create={servicesApi.create}
      update={servicesApi.update}
      remove={servicesApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "title", label: "Title", half: true },
        { key: "badge", label: "Badge", half: true },
        { key: "slug", label: "Slug", half: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "features", label: "Features", type: "list", hideInTable: true },
      ]}
    />
  )
}
