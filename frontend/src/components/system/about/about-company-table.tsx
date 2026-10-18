"use client"

import { aboutCompanyApi } from "@/api/about/company"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function AboutCompanyTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["about-company"]}
      searchKey="title"
      getAll={aboutCompanyApi.getAll}
      create={aboutCompanyApi.create}
      update={aboutCompanyApi.update}
      remove={aboutCompanyApi.remove}
      fields={[
        { key: "title", label: "Title" },
        {
          key: "content",
          label: "Content",
          type: "textarea",
          hideInTable: true,
        },
        { key: "image", label: "Image", type: "image" },
      ]}
    />
  )
}
