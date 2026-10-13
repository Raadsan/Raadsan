import { Router } from "express";
import {
  createBlog,
  createBlogCategory,
  deleteBlog,
  deleteBlogCategory,
  getBlogById,
  getBlogBySlug,
  getBlogCategories,
  getBlogs,
  updateBlog,
  updateBlogCategory,
} from "./blogController.js";

const blogRouter = Router();

blogRouter.get("/categories", getBlogCategories);
blogRouter.post("/categories", createBlogCategory);
blogRouter.put("/categories/:id", updateBlogCategory);
blogRouter.delete("/categories/:id", deleteBlogCategory);

blogRouter.get("/", getBlogs);
blogRouter.get("/slug/:slug", getBlogBySlug);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/", createBlog);
blogRouter.put("/:id", updateBlog);
blogRouter.delete("/:id", deleteBlog);

export default blogRouter;
