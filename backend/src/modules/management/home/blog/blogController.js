import { prisma } from "../../../../lib/prisma.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ── Blog categories ──────────────────────────────────────────

export async function getBlogCategories(_req, res) {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { id: "asc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch blog categories",
    });
  }
}

export async function createBlogCategory(req, res) {
  try {
    const { slug, title } = req.body;
    if (!slug || !title) {
      return res.status(400).json({ message: "slug and title are required" });
    }

    const category = await prisma.blogCategory.create({
      data: {
        slug: String(slug).trim(),
        title: String(title).trim(),
      },
    });

    res.status(201).json(category);
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Category slug already exists" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create blog category",
    });
  }
}

export async function updateBlogCategory(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid category id" });

    const { slug, title } = req.body;
    const data = {};
    if (slug !== undefined) data.slug = String(slug).trim();
    if (title !== undefined) data.title = String(title).trim();

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const category = await prisma.blogCategory.update({ where: { id }, data });
    res.json(category);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Category slug already exists" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update blog category",
    });
  }
}

export async function deleteBlogCategory(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid category id" });

    await prisma.blogCategory.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete blog category",
    });
  }
}

// ── Blogs ────────────────────────────────────────────────────

export async function getBlogs(_req, res) {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: [{ order: "asc" }, { date: "desc" }],
      include: { category: true },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch blogs",
    });
  }
}

export async function getBlogById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid blog id" });

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch blog",
    });
  }
}

export async function getBlogBySlug(req, res) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) return res.status(400).json({ message: "Invalid blog slug" });

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch blog",
    });
  }
}

function normalizeHashtags(value) {
  if (Array.isArray(value)) {
    return value
      .map((tag) => String(tag).trim().replace(/^#/, ""))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\s,]+/)
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter(Boolean);
  }
  return [];
}

export async function createBlog(req, res) {
  try {
    const {
      slug,
      title,
      excerpt,
      content,
      hashtags,
      categoryId,
      date,
      readTime,
      author,
      image,
      order,
    } = req.body;

    if (
      !slug ||
      !title ||
      !excerpt ||
      !content ||
      !categoryId ||
      !date ||
      !readTime ||
      !author ||
      !image
    ) {
      return res.status(400).json({
        message:
          "slug, title, excerpt, content, categoryId, date, readTime, author, and image are required",
      });
    }

    const blog = await prisma.blog.create({
      data: {
        slug: String(slug).trim(),
        title: String(title).trim(),
        excerpt: String(excerpt).trim(),
        content: String(content).trim(),
        hashtags: normalizeHashtags(hashtags),
        categoryId: Number(categoryId),
        date: new Date(date),
        readTime: String(readTime).trim(),
        author: String(author).trim(),
        image: String(image).trim(),
        order: order !== undefined ? Number(order) || 0 : 0,
      },
      include: { category: true },
    });

    res.status(201).json(blog);
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Blog slug already exists" });
    }
    if (error?.code === "P2003") {
      return res.status(400).json({ message: "Invalid categoryId" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to create blog",
    });
  }
}

export async function updateBlog(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid blog id" });

    const {
      slug,
      title,
      excerpt,
      content,
      hashtags,
      categoryId,
      date,
      readTime,
      author,
      image,
      order,
    } = req.body;
    const data = {};

    if (slug !== undefined) data.slug = String(slug).trim();
    if (title !== undefined) data.title = String(title).trim();
    if (excerpt !== undefined) data.excerpt = String(excerpt).trim();
    if (content !== undefined) data.content = String(content).trim();
    if (hashtags !== undefined) data.hashtags = normalizeHashtags(hashtags);
    if (categoryId !== undefined) data.categoryId = Number(categoryId);
    if (date !== undefined) data.date = new Date(date);
    if (readTime !== undefined) data.readTime = String(readTime).trim();
    if (author !== undefined) data.author = String(author).trim();
    if (image !== undefined) data.image = String(image).trim();
    if (order !== undefined) data.order = Number(order) || 0;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data,
      include: { category: true },
    });

    res.json(blog);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Blog slug already exists" });
    }
    if (error?.code === "P2003") {
      return res.status(400).json({ message: "Invalid categoryId" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to update blog",
    });
  }
}

export async function deleteBlog(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid blog id" });

    await prisma.blog.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to delete blog",
    });
  }
}
