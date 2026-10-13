// multer.js
import multer from "multer"

const storage = multer.memoryStorage()

export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"))
      return
    }
    cb(null, true)
  },
})
