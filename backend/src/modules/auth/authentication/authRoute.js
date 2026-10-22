import { Router } from "express"
import { login, register } from "./authController.js"

const authRouter = Router()

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.post("/signup", register)

export default authRouter
