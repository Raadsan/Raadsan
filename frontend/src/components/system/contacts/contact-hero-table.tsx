"use client"

import { contactHeroApi } from "@/api/contacts/hero"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

function truncateWords(text: string, maxWords = 20) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return text.trim()
  return `${words.slice(0, maxWords).join(" ")}...`
}

export function ContactHeroTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["contact-hero"]}
      searchKey="title"
      getAll={contactHeroApi.getAll}
      create={contactHeroApi.create}
      update={contactHeroApi.update}
      remove={contactHeroApi.remove}
      toForm={(row) => ({
        title: String(row.title ?? ""),
        subtitle: String(row.subtitle ?? ""),
      })}
      toPayload={(form) => ({
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        highlight: "",
        order: 0,
      })}
      getCellValue={(row, key) => {
        const value = String(row[key] ?? "")
        if (key === "subtitle") return truncateWords(value, 20)
        return value
      }}
      fields={[
        { key: "title", label: "Title" },
        {
          key: "subtitle",
          label: "Subtitle",
          type: "textarea",
        },
      ]}
    />
  )
}
