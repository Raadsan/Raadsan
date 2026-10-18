import { Router } from "express"
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "./productController.js"

const productRouter = Router()

productRouter.get("/", getProducts)
productRouter.get("/slug/:slug", getProductBySlug)
productRouter.get("/:id", getProductById)
productRouter.post("/", createProduct)
productRouter.put("/:id", updateProduct)
productRouter.delete("/:id", deleteProduct)

export default productRouter
