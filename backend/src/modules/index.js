import cors from "cors"
import express from "express"
import { prisma } from "../lib/prisma.js"
import serviceRouter from "./management/home/services/serviceRoute.js"
import hostingRouter from "./management/home/web-hosting/hostingRoute.js"
import achievementRouter from "./management/home/achievement/achievementRoute.js"
import partnerRouter from "./management/home/partner/partnerRoute.js"
import blogRouter from "./management/home/blog/blogRoute.js"
import testimonialRouter from "./management/home/testimonials/testimonialRoute.js"
import faqRouter from "./management/home/faq/faqRoute.js"
import contactHeroRouter from "./management/contacts/hero/contactHeroRoute.js"
import contactInformationRouter from "./management/contacts/information/contactInformationRoute.js"
import contactFormRouter from "./management/contacts/form/contactFormRoute.js"
import aboutCompanyRouter from "./management/about/company/aboutCompanyRoute.js"
import aboutVisionMissionRouter from "./management/about/vision-mission/aboutVisionMissionRoute.js"
import aboutCoreValueRouter from "./management/about/core-values/aboutCoreValueRoute.js"
import aboutWhyChooseRouter from "./management/about/why-choose/aboutWhyChooseRoute.js"
import productRouter from "./management/products/productRoute.js"
import uploadRouter from "./uploads/uploadRoute.js"
import roleRouter from "./auth/roles/roleRoute.js"
import userRouter from "./auth/users/userRoute.js"
import authRouter from "./auth/authentication/authRoute.js"

const app = express()

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
)
app.use(express.json())

app.get("/", (_req, res) => {
  res.json({
    name: "Raadsan Teach API",
    status: "ok",
  })
})

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: "ok", database: "connected successfully" })
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message: error instanceof Error ? error.message : "Database unavailable",
    })
  }
})

app.use("/api/services", serviceRouter)
app.use("/api/hosting-plans", hostingRouter)
app.use("/api/achievements", achievementRouter)
app.use("/api/partners", partnerRouter)
app.use("/api/blogs", blogRouter)
app.use("/api/testimonials", testimonialRouter)
app.use("/api/faqs", faqRouter)
app.use("/api/contact-hero", contactHeroRouter)
app.use("/api/contact-information", contactInformationRouter)
app.use("/api/contact-form", contactFormRouter)
app.use("/api/about-company", aboutCompanyRouter)
app.use("/api/about-vision-mission", aboutVisionMissionRouter)
app.use("/api/about-core-values", aboutCoreValueRouter)
app.use("/api/about-why-choose", aboutWhyChooseRouter)
app.use("/api/products", productRouter)
app.use("/api/roles", roleRouter)
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/uploads", uploadRouter)

export default app
