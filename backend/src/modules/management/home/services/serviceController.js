import { prisma } from "../../../../lib/prisma.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function getServices(_req, res) {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch services",
    });
  }
}

export async function getServiceById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch service",
    });
  }
}

export async function getServiceBySlug(req, res) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      return res.status(400).json({ message: "Invalid service slug" });
    }

    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch service",
    });
  }
}

export async function createService(req, res) {
  try {
    const { slug, title, badge, description, features, order } = req.body;

    if (!slug || !title || !badge || !description) {
      return res.status(400).json({
        message: "slug, title, badge, and description are required",
      });
    }

    if (!Array.isArray(features)) {
      return res.status(400).json({ message: "features must be an array" });
    }

    const service = await prisma.service.create({
      data: {
        slug: String(slug).trim(),
        title: String(title).trim(),
        badge: String(badge).trim(),
        description: String(description).trim(),
        features,
        order: order !== undefined ? Number(order) || 0 : 0,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Service slug already exists" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to create service",
    });
  }
}

export async function updateService(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    const { slug, title, badge, description, features, order } = req.body;
    const data = {};

    if (slug !== undefined) data.slug = String(slug).trim();
    if (title !== undefined) data.title = String(title).trim();
    if (badge !== undefined) data.badge = String(badge).trim();
    if (description !== undefined) data.description = String(description).trim();
    if (order !== undefined) data.order = Number(order) || 0;
    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return res.status(400).json({ message: "features must be an array" });
      }
      data.features = features;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const service = await prisma.service.update({
      where: { id },
      data,
    });

    res.json(service);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Service not found" });
    }
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Service slug already exists" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to update service",
    });
  }
}

export async function deleteService(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    await prisma.service.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to delete service",
    });
  }
}
