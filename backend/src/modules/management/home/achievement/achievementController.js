import { prisma } from "../../../../lib/prisma.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function getAchievements(_req, res) {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch achievements",
    });
  }
}

export async function getAchievementById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid achievement id" });
    }

    const achievement = await prisma.achievement.findUnique({ where: { id } });
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.json(achievement);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch achievement",
    });
  }
}

export async function getAchievementBySlug(req, res) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      return res.status(400).json({ message: "Invalid achievement slug" });
    }

    const achievement = await prisma.achievement.findUnique({ where: { slug } });
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.json(achievement);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch achievement",
    });
  }
}

export async function createAchievement(req, res) {
  try {
    const { slug, count, label, icon, order } = req.body;

    if (!slug || count === undefined || count === null || !label || !icon) {
      return res.status(400).json({
        message: "slug, count, label, and icon are required",
      });
    }

    const countValue = String(count).trim();
    if (!countValue) {
      return res.status(400).json({ message: "count is required" });
    }

    const achievement = await prisma.achievement.create({
      data: {
        slug: String(slug).trim(),
        count: countValue,
        label: String(label).trim(),
        icon: String(icon).trim(),
        order: order !== undefined ? Number(order) || 0 : 0,
      },
    });

    res.status(201).json(achievement);
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Achievement slug already exists" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create achievement",
    });
  }
}

export async function updateAchievement(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid achievement id" });
    }

    const { slug, count, label, icon, order } = req.body;
    const data = {};

    if (slug !== undefined) data.slug = String(slug).trim();
    if (count !== undefined) data.count = String(count).trim();
    if (label !== undefined) data.label = String(label).trim();
    if (icon !== undefined) data.icon = String(icon).trim();
    if (order !== undefined) data.order = Number(order) || 0;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const achievement = await prisma.achievement.update({
      where: { id },
      data,
    });

    res.json(achievement);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Achievement not found" });
    }
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Achievement slug already exists" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update achievement",
    });
  }
}

export async function deleteAchievement(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid achievement id" });
    }

    await prisma.achievement.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Achievement not found" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete achievement",
    });
  }
}
