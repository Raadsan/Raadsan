import { Router } from "express"
import {
  createAboutCompany,
  deleteAboutCompany,
  getAboutCompanies,
  getAboutCompanyById,
  updateAboutCompany,
} from "./aboutCompanyController.js"

const aboutCompanyRouter = Router()

aboutCompanyRouter.get("/", getAboutCompanies)
aboutCompanyRouter.get("/:id", getAboutCompanyById)
aboutCompanyRouter.post("/", createAboutCompany)
aboutCompanyRouter.put("/:id", updateAboutCompany)
aboutCompanyRouter.delete("/:id", deleteAboutCompany)

export default aboutCompanyRouter
