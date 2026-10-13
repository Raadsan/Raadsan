"use client"

import { faqsApi } from "@/api/home/faqs"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function FaqsTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["faqs"]}
      searchKey="question"
      getAll={faqsApi.getAll}
      create={faqsApi.create}
      update={faqsApi.update}
      remove={faqsApi.remove}
      fields={[
        { key: "order", label: "Order", type: "number", half: true },
        { key: "question", label: "Question", half: true },
        { key: "answer", label: "Answer", type: "textarea" },
      ]}
    />
  )
}
