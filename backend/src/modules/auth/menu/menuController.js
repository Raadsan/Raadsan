import { prisma } from "../../../lib/prisma.js"
import { getBearerPayload } from "../../../middleware/authMiddleware.js"
import { buildMenuTreeForRole } from "./buildMenuTree.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function str(value) {
  return String(value ?? "").trim()
}

// GET /api/menus
// Optional ?tree=true returns nested tree
// Optional ?roleId=X filters menus by canView permission
// If no roleId but Authorization: Bearer <token>, uses role from JWT
export async function getMenus(req, res) {
  try {
    const isTree = req.query.tree === "true"
    let roleId = parseId(req.query.roleId)
    if (!roleId) {
      const auth = getBearerPayload(req)
      if (auth?.roleId) roleId = parseId(auth.roleId)
    }

    let allowedMenuIds = null
    if (roleId) {
      const perms = await prisma.rolePermission.findMany({
        where: { roleId, canView: true },
        select: { menuId: true },
      })
      allowedMenuIds = new Set(perms.map((p) => p.menuId))
    }

    if (isTree) {
      if (roleId) {
        const tree = await buildMenuTreeForRole(roleId)
        return res.json(tree)
      }

      const allMenus = await prisma.menu.findMany({
        orderBy: [{ order: "asc" }, { id: "asc" }],
        include: {
          parent: {
            select: { id: true, title: true },
          },
        },
      })

      const map = new Map()
      allMenus.forEach((item) => {
        map.set(item.id, { ...item, children: [] })
      })

      const tree = []
      allMenus.forEach((item) => {
        const node = map.get(item.id)
        if (item.parentId && map.has(item.parentId)) {
          map.get(item.parentId).children.push(node)
        } else {
          tree.push(node)
        }
      })

      return res.json(tree)
    }

    let menus = await prisma.menu.findMany({
      orderBy: [{ parentId: "asc" }, { order: "asc" }, { id: "asc" }],
      include: {
        parent: {
          select: { id: true, title: true },
        },
        _count: {
          select: { children: true },
        },
      },
    })

    if (allowedMenuIds) {
      const idToParent = new Map(menus.map((item) => [item.id, item.parentId]))
      const expanded = new Set(allowedMenuIds)
      for (const id of allowedMenuIds) {
        let parentId = idToParent.get(id)
        while (parentId) {
          expanded.add(parentId)
          parentId = idToParent.get(parentId)
        }
      }
      menus = menus.filter((item) => expanded.has(item.id))
    }

    res.json(menus)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/menus/:id
export async function getMenuById(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        parent: {
          select: { id: true, title: true },
        },
        children: {
          orderBy: { order: "asc" },
        },
      },
    })
    if (!menu) return res.status(404).json({ message: "Menu not found" })
    res.json(menu)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/menus
export async function createMenu(req, res) {
  const title = str(req.body.title)
  const url = str(req.body.url) || null
  const icon = str(req.body.icon) || null
  const order = Number.isInteger(Number(req.body.order)) ? Number(req.body.order) : 0
  const parentId = parseId(req.body.parentId)

  if (!title) return res.status(422).json({ message: "Title is required" })

  // Verify parent exists if parentId provided
  if (parentId) {
    const parent = await prisma.menu.findUnique({ where: { id: parentId } })
    if (!parent) return res.status(404).json({ message: "Parent menu not found" })
  }

  try {
    const menu = await prisma.menu.create({
      data: {
        title,
        url,
        icon,
        order,
        parentId,
      },
      include: {
        parent: {
          select: { id: true, title: true },
        },
      },
    })
    res.status(201).json(menu)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/menus/:id
export async function updateMenu(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  const title = str(req.body.title)
  const url = str(req.body.url) || null
  const icon = str(req.body.icon) || null
  const order = Number.isInteger(Number(req.body.order)) ? Number(req.body.order) : 0
  const parentId = parseId(req.body.parentId)

  if (!title) return res.status(422).json({ message: "Title is required" })

  if (parentId === id) {
    return res.status(400).json({ message: "A menu item cannot be its own parent" })
  }

  if (parentId) {
    const parent = await prisma.menu.findUnique({ where: { id: parentId } })
    if (!parent) return res.status(404).json({ message: "Parent menu not found" })
  }

  try {
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        title,
        url,
        icon,
        order,
        parentId: parentId || null,
      },
      include: {
        parent: {
          select: { id: true, title: true },
        },
      },
    })
    res.json(menu)
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ message: "Menu not found" })
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/menus/:id
export async function deleteMenu(req, res) {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: "Invalid id" })

  try {
    await prisma.menu.delete({
      where: { id },
    })
    res.json({ message: "Menu item and any submenus deleted" })
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ message: "Menu not found" })
    res.status(500).json({ message: error.message })
  }
}

// POST /api/menus/seed-defaults
export async function seedDefaultMenus(_req, res) {
  try {
    const count = await prisma.menu.count()
    if (count > 0) {
      return res.status(400).json({ message: "Menus table already has data. Clear existing menus first to seed defaults." })
    }

    // Level 1: Root menus
    const dashboard = await prisma.menu.create({
      data: { title: "Dashboard", url: "/dashboard", icon: "IconDashboard", order: 1 },
    })

    const management = await prisma.menu.create({
      data: { title: "Management", url: "/management", icon: "IconFolder", order: 2 },
    })

    const configuration = await prisma.menu.create({
      data: { title: "Configuration", url: "/configuration", icon: "IconSettings", order: 3 },
    })

    // Level 2 under Management
    const home = await prisma.menu.create({
      data: { title: "Home", url: "/management/home", icon: "IconHome", order: 1, parentId: management.id },
    })

    const about = await prisma.menu.create({
      data: { title: "About", url: "/management/about", icon: "IconInfoCircle", order: 2, parentId: management.id },
    })

    const products = await prisma.menu.create({
      data: { title: "Products", url: "/management/products", icon: "IconPackage", order: 3, parentId: management.id },
    })

    const contacts = await prisma.menu.create({
      data: { title: "Contacts", url: "/management/contacts", icon: "IconMail", order: 4, parentId: management.id },
    })

    // Level 3 under Home
    await prisma.menu.createMany({
      data: [
        { title: "Services", url: "/management/home/services", order: 1, parentId: home.id },
        { title: "Web Hosting", url: "/management/home/web-hosting", order: 2, parentId: home.id },
        { title: "Our Achievement", url: "/management/home/our-achievement", order: 3, parentId: home.id },
        { title: "Our Partners", url: "/management/home/our-partners", order: 4, parentId: home.id },
        { title: "Blog Category", url: "/management/home/blog-category", order: 5, parentId: home.id },
        { title: "Recent Blogs", url: "/management/home/recent-blogs", order: 6, parentId: home.id },
        { title: "What Our Clients Says", url: "/management/home/what-our-clients-says", order: 7, parentId: home.id },
        { title: "FAQ", url: "/management/home/faq", order: 8, parentId: home.id },
      ],
    })

    // Level 3 under About
    await prisma.menu.createMany({
      data: [
        { title: "About Company", url: "/management/about/about-company", order: 1, parentId: about.id },
        { title: "Vision & Mission", url: "/management/about/vision-mission", order: 2, parentId: about.id },
        { title: "Core Values", url: "/management/about/core-values", order: 3, parentId: about.id },
        { title: "Why Choose Us", url: "/management/about/why-choose-us", order: 4, parentId: about.id },
      ],
    })

    // Level 3 under Contacts
    await prisma.menu.createMany({
      data: [
        { title: "Hero", url: "/management/contacts/hero", order: 1, parentId: contacts.id },
        { title: "Contact Information", url: "/management/contacts/contact-information", order: 2, parentId: contacts.id },
        { title: "Messages", url: "/management/contacts/messages", order: 3, parentId: contacts.id },
      ],
    })

    // Level 2 under Configuration
    await prisma.menu.createMany({
      data: [
        { title: "Roles", url: "/configuration/roles", order: 1, parentId: configuration.id },
        { title: "Users", url: "/configuration/users", order: 2, parentId: configuration.id },
        { title: "Menu", url: "/configuration/menu", order: 3, parentId: configuration.id },
        { title: "Role Permission", url: "/configuration/role-permission", order: 4, parentId: configuration.id },
      ],
    })

    res.json({ message: "Default menus seeded successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
