import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonialById,
  getTestimonials,
  updateTestimonial,
} from "./testimonialController.js";

const testimonialRouter = Router();

testimonialRouter.get("/", getTestimonials);
testimonialRouter.get("/:id", getTestimonialById);
testimonialRouter.post("/", createTestimonial);
testimonialRouter.put("/:id", updateTestimonial);
testimonialRouter.delete("/:id", deleteTestimonial);

export default testimonialRouter;
