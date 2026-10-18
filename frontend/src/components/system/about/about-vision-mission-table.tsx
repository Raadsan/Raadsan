"use client"

import { aboutVisionMissionApi } from "@/api/about/vision-mission"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function AboutVisionMissionTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["about-vision-mission"]}
      searchKey="title"
      getAll={aboutVisionMissionApi.getAll}
      create={aboutVisionMissionApi.create}
      update={aboutVisionMissionApi.update}
      remove={aboutVisionMissionApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        {
          key: "type",
          label: "Type",
          type: "select",
          half: true,
          placeholder: "Select type",
          options: [
            { value: "vision", label: "Vision" },
            { value: "mission", label: "Mission" },
          ],
        },
        { key: "title", label: "Title", half: true },
        {
          key: "icon",
          label: "Icon",
          type: "icon",
          half: true,
          options: [
            { value: "eye", label: "Eye" },
            { value: "target", label: "Target" },
          ],
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
