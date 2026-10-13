import { prisma } from "../../../../lib/prisma.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function getHostingPlans(_req, res) {
  try {
    const plans = await prisma.hostingPlan.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch hosting plans",
    });
  }
}

export async function getHostingPlanById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid hosting plan id" });
    }

    const plan = await prisma.hostingPlan.findUnique({ where: { id } });
    if (!plan) {
      return res.status(404).json({ message: "Hosting plan not found" });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch hosting plan",
    });
  }
}

export async function getHostingPlanBySlug(req, res) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      return res.status(400).json({ message: "Invalid hosting plan slug" });
    }

    const plan = await prisma.hostingPlan.findUnique({ where: { slug } });
    if (!plan) {
      return res.status(404).json({ message: "Hosting plan not found" });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch hosting plan",
    });
  }
}

export async function createHostingPlan(req, res) {
  try {
    const {
      slug,
      name,
      badge,
      popular,
      description,
      monthlyPrice,
      yearlyPrice,
      features,
      ctaText,
      order,
    } = req.body;

    if (
      !slug ||
      !name ||
      !description ||
      monthlyPrice === undefined ||
      yearlyPrice === undefined ||
      !ctaText
    ) {
      return res.status(400).json({
        message:
          "slug, name, description, monthlyPrice, yearlyPrice, and ctaText are required",
      });
    }

    if (!Array.isArray(features)) {
      return res.status(400).json({ message: "features must be an array" });
    }

    const plan = await prisma.hostingPlan.create({
      data: {
        slug: String(slug).trim(),
        name: String(name).trim(),
        badge: badge != null ? String(badge).trim() : null,
        popular: Boolean(popular),
        description: String(description).trim(),
        monthlyPrice,
        yearlyPrice,
        features,
        ctaText: String(ctaText).trim(),
        order: order !== undefined ? Number(order) || 0 : 0,
      },
    });

    res.status(201).json(plan);
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Hosting plan slug already exists" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create hosting plan",
    });
  }
}

export async function updateHostingPlan(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid hosting plan id" });
    }

    const {
      slug,
      name,
      badge,
      popular,
      description,
      monthlyPrice,
      yearlyPrice,
      features,
      ctaText,
      order,
    } = req.body;
    const data = {};

    if (slug !== undefined) data.slug = String(slug).trim();
    if (name !== undefined) data.name = String(name).trim();
    if (badge !== undefined) data.badge = badge != null ? String(badge).trim() : null;
    if (popular !== undefined) data.popular = Boolean(popular);
    if (description !== undefined) data.description = String(description).trim();
    if (monthlyPrice !== undefined) data.monthlyPrice = monthlyPrice;
    if (yearlyPrice !== undefined) data.yearlyPrice = yearlyPrice;
    if (ctaText !== undefined) data.ctaText = String(ctaText).trim();
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

    const plan = await prisma.hostingPlan.update({
      where: { id },
      data,
    });

    res.json(plan);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Hosting plan not found" });
    }
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Hosting plan slug already exists" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update hosting plan",
    });
  }
}

export async function deleteHostingPlan(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid hosting plan id" });
    }

    await prisma.hostingPlan.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Hosting plan not found" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete hosting plan",
    });
  }
}
