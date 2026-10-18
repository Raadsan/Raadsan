import { prisma } from "../../../../lib/prisma.js"
import { makeCrudHandlers } from "../_crud.js"

function str(value) {
  return String(value ?? "").trim()
}

function normalizeType(type) {
  const value = str(type).toLowerCase()
  return value === "vision" || value === "mission" ? value : null
}

export const {
  getAll: getAboutVisionMissions,
  getById: getAboutVisionMissionById,
  create: createAboutVisionMission,
  update: updateAboutVisionMission,
  remove: deleteAboutVisionMission,
} = makeCrudHandlers({
  model: prisma.aboutVisionMission,
  required: ["type", "title", "text", "icon"],
  label: "vision mission",
  mapCreate: (body) => {
    const type = normalizeType(body.type)
    if (!type) throw new Error("type must be vision or mission")
    return {
      type,
      title: str(body.title),
      text: str(body.text),
      icon: str(body.icon).toLowerCase(),
      order: body.order !== undefined ? Number(body.order) || 0 : 0,
    }
  },
  mapUpdate: (body) => {
    const data = {}
    if (body.type !== undefined) {
      const type = normalizeType(body.type)
      if (!type) throw new Error("type must be vision or mission")
      data.type = type
    }
    if (body.title !== undefined) data.title = str(body.title)
    if (body.text !== undefined) data.text = str(body.text)
    if (body.icon !== undefined) data.icon = str(body.icon).toLowerCase()
    if (body.order !== undefined) data.order = Number(body.order) || 0
    return data
  },
})
