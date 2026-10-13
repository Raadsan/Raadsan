import { Router } from "express";
import {
  createAchievement,
  deleteAchievement,
  getAchievementById,
  getAchievementBySlug,
  getAchievements,
  updateAchievement,
} from "./achievementController.js";

const achievementRouter = Router();

achievementRouter.get("/", getAchievements);
achievementRouter.get("/slug/:slug", getAchievementBySlug);
achievementRouter.get("/:id", getAchievementById);
achievementRouter.post("/", createAchievement);
achievementRouter.put("/:id", updateAchievement);
achievementRouter.delete("/:id", deleteAchievement);

export default achievementRouter;
