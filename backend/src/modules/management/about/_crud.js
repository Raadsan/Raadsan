export function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

export function makeCrudHandlers({
  model,
  required = [],
  mapCreate,
  mapUpdate,
  label = "item",
  orderBy = [{ order: "asc" }, { id: "asc" }],
}) {
  return {
    async getAll(_req, res) {
      try {
        const rows = await model.findMany({ orderBy })
        res.json(rows)
      } catch (error) {
        res.status(500).json({
          message:
            error instanceof Error
              ? error.message
              : `Failed to fetch ${label}`,
        })
      }
    },

    async getById(req, res) {
      try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ message: `Invalid ${label} id` })

        const row = await model.findUnique({ where: { id } })
        if (!row) return res.status(404).json({ message: `${label} not found` })

        res.json(row)
      } catch (error) {
        res.status(500).json({
          message:
            error instanceof Error ? error.message : `Failed to fetch ${label}`,
        })
      }
    },

    async create(req, res) {
      try {
        for (const key of required) {
          if (req.body[key] == null || String(req.body[key]).trim() === "") {
            return res
              .status(400)
              .json({ message: `${required.join(", ")} are required` })
          }
        }

        const row = await model.create({ data: mapCreate(req.body) })
        res.status(201).json(row)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : `Failed to create ${label}`
        const status = /must be|required/i.test(message) ? 400 : 500
        res.status(status).json({ message })
      }
    },

    async update(req, res) {
      try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ message: `Invalid ${label} id` })

        const data = mapUpdate(req.body)
        if (Object.keys(data).length === 0) {
          return res.status(400).json({ message: "No fields to update" })
        }

        const row = await model.update({ where: { id }, data })
        res.json(row)
      } catch (error) {
        if (error?.code === "P2025") {
          return res.status(404).json({ message: `${label} not found` })
        }
        const message =
          error instanceof Error ? error.message : `Failed to update ${label}`
        const status = /must be|required/i.test(message) ? 400 : 500
        res.status(status).json({ message })
      }
    },

    async remove(req, res) {
      try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ message: `Invalid ${label} id` })

        await model.delete({ where: { id } })
        res.status(204).send()
      } catch (error) {
        if (error?.code === "P2025") {
          return res.status(404).json({ message: `${label} not found` })
        }
        res.status(500).json({
          message:
            error instanceof Error
              ? error.message
              : `Failed to delete ${label}`,
        })
      }
    },
  }
}
