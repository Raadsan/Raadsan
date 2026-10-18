import { prisma } from "../../../../lib/prisma.js"
import { makeCrudHandlers } from "../_crud.js"

function str(value) {
  return String(value ?? "").trim()
}

export const {
  getAll: getAboutWhyChoose,
  getById: getAboutWhyChooseById,
  create: createAboutWhyChoose,
  update: updateAboutWhyChoose,
  remove: deleteAboutWhyChoose,
} = makeCrudHandlers({
  model: prisma.aboutWhyChoose,
  required: ["title", "text", "icon"],
  label: "why choose",
  mapCreate: (body) => ({
    title: str(body.title),
    text: str(body.text),
    icon: str(body.icon).toLowerCase(),
    order: body.order !== undefined ? Number(body.order) || 0 : 0,
  }),
  mapUpdate: (body) => {
    const data = {}
    if (body.title !== undefined) data.title = str(body.title)
    if (body.text !== undefined) data.text = str(body.text)
    if (body.icon !== undefined) data.icon = str(body.icon).toLowerCase()
    if (body.order !== undefined) data.order = Number(body.order) || 0
    return data
  },
})
