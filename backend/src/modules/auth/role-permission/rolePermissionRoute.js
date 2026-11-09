import { Router } from "express"
import {
  getPermissionsSummary,
  getRolePermissions,
  saveRolePermissions,
} from "./rolePermissionController.js"

const router = Router()

router.get("/summary", getPermissionsSummary)
router.get("/", getRolePermissions)
router.post("/bulk", saveRolePermissions)
router.post("/", saveRolePermissions)

export default router
