import { Router } from "express"
import {
  createMenu,
  deleteMenu,
  getMenuById,
  getMenus,
  seedDefaultMenus,
  updateMenu,
} from "./menuController.js"

const router = Router()

router.get("/", getMenus)
router.post("/seed-defaults", seedDefaultMenus)
router.get("/:id", getMenuById)
router.post("/", createMenu)
router.put("/:id", updateMenu)
router.delete("/:id", deleteMenu)

export default router
