import { prisma } from "../../../../lib/prisma.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function getPartners(_req, res) {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    res.json(partners);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch partners",
    });
  }
}

export async function getPartnerById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid partner id" });

    const partner = await prisma.partner.findUnique({ where: { id } });
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    res.json(partner);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch partner",
    });
  }
}

export async function createPartner(req, res) {
  try {
    const { title, image, imageDark, order } = req.body;
    if (!title || !image || !imageDark) {
      return res.status(400).json({
        message: "title, light image, and dark image are required",
      });
    }

    const partner = await prisma.partner.create({
      data: {
        title: String(title).trim(),
        image: String(image).trim(),
        imageDark: String(imageDark).trim(),
        order: order !== undefined ? Number(order) || 0 : 0,
      },
    });

    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to create partner",
    });
  }
}

export async function updatePartner(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid partner id" });

    const { title, image, imageDark, order } = req.body;
    const data = {};
    if (title !== undefined) data.title = String(title).trim();
    if (image !== undefined) data.image = String(image).trim();
    if (imageDark !== undefined) {
      const dark = String(imageDark).trim();
      data.imageDark = dark || null;
    }
    if (order !== undefined) data.order = Number(order) || 0;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const partner = await prisma.partner.update({ where: { id }, data });
    res.json(partner);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to update partner",
    });
  }
}

export async function deletePartner(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid partner id" });

    await prisma.partner.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to delete partner",
    });
  }
}
