import axios from "axios"

import { getApiBaseUrl } from "@/lib/api-base-url"

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl()

    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    return Promise.reject(
      typeof message === "string" ? new Error(message) : error,
    )
  },
)

export default api