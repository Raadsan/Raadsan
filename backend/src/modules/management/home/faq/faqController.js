import { prisma } from "../../../../lib/prisma.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function getFaqs(_req, res) {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch faqs",
    });
  }
}

export async function getFaqById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid faq id" });

    const faq = await prisma.faq.findUnique({ where: { id } });
    if (!faq) return res.status(404).json({ message: "Faq not found" });

    res.json(faq);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch faq",
    });
  }
}

export async function createFaq(req, res) {
  try {
    const { question, answer, order } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "question and answer are required" });
    }

    const faq = await prisma.faq.create({
      data: {
        question: String(question).trim(),
        answer: String(answer).trim(),
        order: order !== undefined ? Number(order) || 0 : 0,
      },
    });

    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to create faq",
    });
  }
}

export async function updateFaq(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid faq id" });

    const { question, answer, order } = req.body;
    const data = {};
    if (question !== undefined) data.question = String(question).trim();
    if (answer !== undefined) data.answer = String(answer).trim();
    if (order !== undefined) data.order = Number(order) || 0;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const faq = await prisma.faq.update({ where: { id }, data });
    res.json(faq);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Faq not found" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to update faq",
    });
  }
}

export async function deleteFaq(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid faq id" });

    await prisma.faq.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Faq not found" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to delete faq",
    });
  }
}
