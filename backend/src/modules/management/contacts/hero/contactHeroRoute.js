import { Router } from "express"
import {
  createContactHero,
  deleteContactHero,
  getContactHeroById,
  getContactHeroes,
  updateContactHero,
} from "./contactHeroController.js"

const contactHeroRouter = Router()

contactHeroRouter.get("/", getContactHeroes)
contactHeroRouter.get("/:id", getContactHeroById)
contactHeroRouter.post("/", createContactHero)
contactHeroRouter.put("/:id", updateContactHero)
contactHeroRouter.delete("/:id", deleteContactHero)

export default contactHeroRouter
