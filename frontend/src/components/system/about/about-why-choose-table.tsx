"use client"

import { aboutWhyChooseApi } from "@/api/about/why-choose"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function AboutWhyChooseTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["about-why-choose"]}
      searchKey="title"
      getAll={aboutWhyChooseApi.getAll}
      create={aboutWhyChooseApi.create}
      update={aboutWhyChooseApi.update}
      remove={aboutWhyChooseApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "title", label: "Title", half: true },
        {
          key: "icon",
          label: "Icon",
          half: true,
          placeholder: "users | settings | lifebuoy | zap | lock | globe",
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
