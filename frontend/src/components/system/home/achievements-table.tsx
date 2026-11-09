"use client"

import { achievementsApi } from "@/api/home/achievements"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function AchievementsTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["achievements"]}
      searchKey="label"
      getAll={achievementsApi.getAll}
      create={achievementsApi.create}
      update={achievementsApi.update}
      remove={achievementsApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "label", label: "Label", half: true },
        {
          key: "count",
          label: "Count",
          placeholder: "e.g. 9+ or 9709+",
          half: true,
        },
        { key: "slug", label: "Slug", half: true },
        {
          key: "icon",
          label: "Icon",
          half: true,
          placeholder: "users | trophy | award | briefcase | check | star",
        },
      ]}
    />
  )
}
