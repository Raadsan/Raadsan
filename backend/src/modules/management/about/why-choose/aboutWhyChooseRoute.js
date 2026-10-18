import { Router } from "express"
import {
  createAboutWhyChoose,
  deleteAboutWhyChoose,
  getAboutWhyChoose,
  getAboutWhyChooseById,
  updateAboutWhyChoose,
} from "./aboutWhyChooseController.js"

const aboutWhyChooseRouter = Router()

aboutWhyChooseRouter.get("/", getAboutWhyChoose)
aboutWhyChooseRouter.get("/:id", getAboutWhyChooseById)
aboutWhyChooseRouter.post("/", createAboutWhyChoose)
aboutWhyChooseRouter.put("/:id", updateAboutWhyChoose)
aboutWhyChooseRouter.delete("/:id", deleteAboutWhyChoose)

export default aboutWhyChooseRouter
