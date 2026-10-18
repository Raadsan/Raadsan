import { Router } from "express"
import {
  createAboutCoreValue,
  deleteAboutCoreValue,
  getAboutCoreValueById,
  getAboutCoreValues,
  updateAboutCoreValue,
} from "./aboutCoreValueController.js"

const aboutCoreValueRouter = Router()

aboutCoreValueRouter.get("/", getAboutCoreValues)
aboutCoreValueRouter.get("/:id", getAboutCoreValueById)
aboutCoreValueRouter.post("/", createAboutCoreValue)
aboutCoreValueRouter.put("/:id", updateAboutCoreValue)
aboutCoreValueRouter.delete("/:id", deleteAboutCoreValue)

export default aboutCoreValueRouter
