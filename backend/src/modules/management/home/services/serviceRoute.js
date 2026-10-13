import { Router } from "express";
import {
  createService,
  deleteService,
  getServiceById,
  getServiceBySlug,
  getServices,
  updateService,
} from "./serviceController.js";

const serviceRouter = Router();

serviceRouter.get("/", getServices);
serviceRouter.get("/slug/:slug", getServiceBySlug);
serviceRouter.get("/:id", getServiceById);
serviceRouter.post("/", createService);
serviceRouter.put("/:id", updateService);
serviceRouter.delete("/:id", deleteService);

export default serviceRouter;
