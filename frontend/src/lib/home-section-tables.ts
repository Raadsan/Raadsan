export type SectionField = {
  key: string
  label: string
  type?: "text" | "textarea" | "number"
}

export type SectionRow = {
  id: number
  [key: string]: string | number
}

export type HomeSectionTableConfig = {
  fields: SectionField[]
  searchKey: string
}

export const homeSectionTables: Record<string, HomeSectionTableConfig> = {
  services: {
    searchKey: "title",
    fields: [
      { key: "title", label: "Title" },
      { key: "badge", label: "Badge" },
      { key: "slug", label: "Slug" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  "web-hosting": {
    searchKey: "name",
    fields: [
      { key: "name", label: "Name" },
      { key: "badge", label: "Badge" },
      { key: "monthlyPrice", label: "Monthly Price", type: "number" },
      { key: "yearlyPrice", label: "Yearly Price", type: "number" },
      { key: "ctaText", label: "CTA Text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  "our-achievement": {
    searchKey: "label",
    fields: [
      { key: "label", label: "Label" },
      { key: "count", label: "Count", placeholder: "e.g. 9+" },
      { key: "slug", label: "Slug" },
      { key: "icon", label: "Icon" },
    ],
  },
  "our-partners": {
    searchKey: "title",
    fields: [
      { key: "title", label: "Title" },
      { key: "image", label: "Image URL" },
    ],
  },
  "recent-blogs": {
    searchKey: "title",
    fields: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "author", label: "Author" },
      { key: "readTime", label: "Read Time" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
    ],
  },
  "what-our-clients-says": {
    searchKey: "name",
    fields: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "company", label: "Company" },
      { key: "rating", label: "Rating", type: "number" },
      { key: "content", label: "Content", type: "textarea" },
    ],
  },
  faq: {
    searchKey: "question",
    fields: [
      { key: "question", label: "Question" },
      { key: "answer", label: "Answer", type: "textarea" },
    ],
  },
}

export function getHomeSectionTable(slug: string) {
  return homeSectionTables[slug]
}
