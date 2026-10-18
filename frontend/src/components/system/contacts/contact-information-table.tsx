"use client"

import { contactInformationApi } from "@/api/contacts/information"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

function iconFromLabel(label: string) {
  const value = label.toLowerCase()
  if (value.includes("mail") || value.includes("email")) return "mail"
  if (value.includes("phone") || value.includes("tel")) return "phone"
  return "map"
}

export function ContactInformationTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["contact-information"]}
      searchKey="label"
      getAll={contactInformationApi.getAll}
      create={contactInformationApi.create}
      update={contactInformationApi.update}
      remove={contactInformationApi.remove}
      toForm={(row) => ({
        order: String(row.order ?? 0),
        label: String(row.label ?? ""),
        value: String(row.value ?? ""),
        href: String(row.href ?? ""),
      })}
      toPayload={(form) => ({
        order: Number(form.order) || 0,
        label: form.label.trim(),
        value: form.value.trim(),
        href: form.href.trim() || null,
        icon: iconFromLabel(form.label),
      })}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "label", label: "Label", half: true },
        { key: "value", label: "Value", half: true },
        {
          key: "href",
          label: "Link (optional)",
          required: false,
          placeholder: "mailto:... or tel:...",
        },
      ]}
    />
  )
}
