import { prisma } from "../../../../lib/prisma.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function getTestimonials(_req, res) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch testimonials",
    });
  }
}

export async function getTestimonialById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid testimonial id" });

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch testimonial",
    });
  }
}

export async function createTestimonial(req, res) {
  try {
    const { name, role, company, content, rating, initials, profile, order } =
      req.body;

    if (!name || !role || !company || !content || !initials) {
      return res.status(400).json({
        message: "name, role, company, content, and initials are required",
      });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: String(name).trim(),
        role: String(role).trim(),
        company: String(company).trim(),
        content: String(content).trim(),
        rating: rating !== undefined ? Number(rating) : 5,
        initials: String(initials).trim(),
        profile: profile != null ? String(profile).trim() : null,
        order: order !== undefined ? Number(order) || 0 : 0,
      },
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create testimonial",
    });
  }
}

export async function updateTestimonial(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid testimonial id" });

    const { name, role, company, content, rating, initials, profile, order } =
      req.body;
    const data = {};

    if (name !== undefined) data.name = String(name).trim();
    if (role !== undefined) data.role = String(role).trim();
    if (company !== undefined) data.company = String(company).trim();
    if (content !== undefined) data.content = String(content).trim();
    if (rating !== undefined) data.rating = Number(rating);
    if (initials !== undefined) data.initials = String(initials).trim();
    if (order !== undefined) data.order = Number(order) || 0;
    if (profile !== undefined) {
      data.profile = profile != null ? String(profile).trim() : null;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });

    res.json(testimonial);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update testimonial",
    });
  }
}

export async function deleteTestimonial(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid testimonial id" });

    await prisma.testimonial.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete testimonial",
    });
  }
}
