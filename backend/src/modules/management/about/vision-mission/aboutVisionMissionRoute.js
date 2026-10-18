import { Router } from "express"
import {
  createAboutVisionMission,
  deleteAboutVisionMission,
  getAboutVisionMissionById,
  getAboutVisionMissions,
  updateAboutVisionMission,
} from "./aboutVisionMissionController.js"

const aboutVisionMissionRouter = Router()

aboutVisionMissionRouter.get("/", getAboutVisionMissions)
aboutVisionMissionRouter.get("/:id", getAboutVisionMissionById)
aboutVisionMissionRouter.post("/", createAboutVisionMission)
aboutVisionMissionRouter.put("/:id", updateAboutVisionMission)
aboutVisionMissionRouter.delete("/:id", deleteAboutVisionMission)

export default aboutVisionMissionRouter
