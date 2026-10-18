import { Router } from "express"
import {
  createContactSubmission,
  deleteContactSubmission,
  getContactSubmissionById,
  getContactSubmissions,
} from "./contactFormController.js"

const contactFormRouter = Router()

/* Submissions: /api/contact-form/submissions */
contactFormRouter.get("/submissions", getContactSubmissions)
contactFormRouter.get("/submissions/:id", getContactSubmissionById)
contactFormRouter.post("/submissions", createContactSubmission)
contactFormRouter.delete("/submissions/:id", deleteContactSubmission)

export default contactFormRouter
