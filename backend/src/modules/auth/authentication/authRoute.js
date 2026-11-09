import { Router } from "express"
import { requireAuth } from "../../../middleware/authMiddleware.js"
import { getMe, login, register } from "./authController.js"

const authRouter = Router()

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.post("/signup", register)
authRouter.get("/me", requireAuth, getMe)

export default authRouter
