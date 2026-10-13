import { Router } from "express"
import { uploadImage } from "../../utils/multer.js"
import { uploadToS3 } from "../../utils/s3.js"

const uploadRouter = Router()

uploadRouter.post("/", uploadImage.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" })
    }

    const uploaded = await uploadToS3(req.file)
    res.status(201).json(uploaded)
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Upload failed",
    })
  }
})

uploadRouter.use((error, _req, res, _next) => {
  res.status(400).json({
    message: error instanceof Error ? error.message : "Upload failed",
  })
})

export default uploadRouter
