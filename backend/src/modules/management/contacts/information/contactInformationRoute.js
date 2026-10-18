import { Router } from "express"
import {
  createContactInformation,
  deleteContactInformation,
  getContactInformation,
  getContactInformationById,
  updateContactInformation,
} from "./contactInformationController.js"

const contactInformationRouter = Router()

contactInformationRouter.get("/", getContactInformation)
contactInformationRouter.get("/:id", getContactInformationById)
contactInformationRouter.post("/", createContactInformation)
contactInformationRouter.put("/:id", updateContactInformation)
contactInformationRouter.delete("/:id", deleteContactInformation)

export default contactInformationRouter
