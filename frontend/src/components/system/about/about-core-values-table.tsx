"use client"

import { aboutCoreValuesApi } from "@/api/about/core-values"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function AboutCoreValuesTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["about-core-values"]}
      searchKey="title"
      getAll={aboutCoreValuesApi.getAll}
      create={aboutCoreValuesApi.create}
      update={aboutCoreValuesApi.update}
      remove={aboutCoreValuesApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "title", label: "Title", half: true },
        {
          key: "icon",
          label: "Icon",
          half: true,
          placeholder: "lightbulb | shield | medal | handshake",
        },
        {
          key: "text",
          label: "Text",
          type: "textarea",
          hideInTable: true,
        },
      ]}
    />
  )
}
