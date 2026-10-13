"use client"

import { testimonialsApi } from "@/api/home/testimonials"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function TestimonialsTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["testimonials"]}
      searchKey="name"
      getAll={testimonialsApi.getAll}
      create={testimonialsApi.create}
      update={testimonialsApi.update}
      remove={testimonialsApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "name", label: "Name", half: true },
        { key: "role", label: "Role", half: true },
        { key: "company", label: "Company", half: true },
        { key: "rating", label: "Rating", type: "number", half: true },
        { key: "initials", label: "Initials", half: true },
        { key: "profile", label: "Profile Image", type: "image", required: false },
        {
          key: "content",
          label: "Content",
          type: "textarea",
          hideInTable: true,
        },
      ]}
    />
  )
}
