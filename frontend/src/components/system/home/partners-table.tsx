"use client"

import { partnersApi } from "@/api/home/partners"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function PartnersTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["partners"]}
      searchKey="title"
      getAll={partnersApi.getAll}
      create={partnersApi.create}
      update={partnersApi.update}
      remove={partnersApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "title", label: "Title", half: true },
        { key: "image", label: "Light mode image", type: "image" },
        { key: "imageDark", label: "Dark mode image", type: "image" },
      ]}
    />
  )
}
