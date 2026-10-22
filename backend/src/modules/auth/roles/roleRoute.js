import { Router } from "express"
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./roleController.js"

const roleRouter = Router()

roleRouter.get("/", getRoles)
roleRouter.get("/:id", getRoleById)
roleRouter.post("/", createRole)
roleRouter.put("/:id", updateRole)
roleRouter.delete("/:id", deleteRole)

export default roleRouter
