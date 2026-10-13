import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import path from "path"

const region = process.env.AWS_REGION
const bucket = process.env.AWS_BUCKET_NAME
const prefix = (process.env.AWS_S3_UPLOAD_PREFIX || "uploads").replace(
  /^\/+|\/+$/g,
  "",
)

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

function publicUrl(key) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

export async function uploadToS3(file) {
  if (!region || !bucket) {
    throw new Error("AWS_REGION and AWS_BUCKET_NAME are required")
  }
  if (!file?.buffer) {
    throw new Error("No file buffer to upload")
  }

  const ext = path.extname(file.originalname || "").toLowerCase() || ".png"
  const key = `${prefix}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  )

  return {
    key,
    url: publicUrl(key),
  }
}
