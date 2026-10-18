import { prisma } from "../../../../lib/prisma.js"
import { makeCrudHandlers } from "../_crud.js"

function str(value) {
  return String(value ?? "").trim()
}

export const {
  getAll: getAboutCompanies,
  getById: getAboutCompanyById,
  create: createAboutCompany,
  update: updateAboutCompany,
  remove: deleteAboutCompany,
} = makeCrudHandlers({
  model: prisma.aboutCompany,
  required: ["title", "content", "image"],
  label: "about company",
  orderBy: [{ id: "asc" }],
  mapCreate: (body) => ({
    title: str(body.title),
    content: str(body.content),
    image: str(body.image),
  }),
  mapUpdate: (body) => {
    const data = {}
    if (body.title !== undefined) data.title = str(body.title)
    if (body.content !== undefined) data.content = str(body.content)
    if (body.image !== undefined) data.image = str(body.image)
    return data
  },
})
