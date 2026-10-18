import api from "@/api/axios"

export const contactFormApi = {
  getSubmissions: async () => {
    const { data } = await api.get("/api/contact-form/submissions")
    return data
  },

  createSubmission: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/api/contact-form/submissions", payload)
    return data
  },

  removeSubmission: async (id: number) => {
    await api.delete(`/api/contact-form/submissions/${id}`)
  },
}
