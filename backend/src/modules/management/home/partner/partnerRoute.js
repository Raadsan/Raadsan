import { Router } from "express";
import {
  createPartner,
  deletePartner,
  getPartnerById,
  getPartners,
  updatePartner,
} from "./partnerController.js";

const partnerRouter = Router();

partnerRouter.get("/", getPartners);
partnerRouter.get("/:id", getPartnerById);
partnerRouter.post("/", createPartner);
partnerRouter.put("/:id", updatePartner);
partnerRouter.delete("/:id", deletePartner);

export default partnerRouter;
