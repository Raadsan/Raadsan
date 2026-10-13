"use client"

import { blogsApi } from "@/api/home/blogs"
import { HomeApiCrudTable } from "@/components/system/home/home-api-crud-table"

type Props = { title: string; description: string }

export function BlogCategoriesTable({ title, description }: Props) {
  return (
    <HomeApiCrudTable
      title={title}
      description={description}
      queryKey={["blog-categories"]}
      searchKey="title"
      getAll={blogsApi.getCategories}
      create={blogsApi.createCategory}
      update={blogsApi.updateCategory}
      remove={blogsApi.removeCategory}
      fields={[
        { key: "title", label: "Title", half: true },
        { key: "slug", label: "Slug", half: true },
      ]}
    />
  )
}
