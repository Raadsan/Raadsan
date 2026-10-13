import { Router } from "express";
import {
  createHostingPlan,
  deleteHostingPlan,
  getHostingPlanById,
  getHostingPlanBySlug,
  getHostingPlans,
  updateHostingPlan,
} from "./hostingController.js";

const hostingRouter = Router();

hostingRouter.get("/", getHostingPlans);
hostingRouter.get("/slug/:slug", getHostingPlanBySlug);
hostingRouter.get("/:id", getHostingPlanById);
hostingRouter.post("/", createHostingPlan);
hostingRouter.put("/:id", updateHostingPlan);
hostingRouter.delete("/:id", deleteHostingPlan);

export default hostingRouter;
