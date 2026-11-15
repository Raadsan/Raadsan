import api from "@/api/axios"
import { getApiBaseUrl } from "@/lib/api-base-url"

export function mediaUrl(path?: string | null) {
  if (!path) return ""
  if (/^https?:\/\//i.test(path)) return path
  const base = getApiBaseUrl()
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`
}

export const uploadsApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const { data } = await api.post<{ url: string; key: string }>(
      "/api/uploads",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    )
    return data
  },
}
