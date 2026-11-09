import { prisma } from "../../../lib/prisma.js"

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

// GET /api/role-permissions/summary
export async function getPermissionsSummary(_req, res) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: true,
        _count: { select: { users: true } },
      },
      orderBy: { createdAt: "asc" },
    })

    const summary = roles.map((role) => {
      let view = 0
      let create = 0
      let edit = 0
      let del = 0

      role.rolePermissions.forEach((p) => {
        if (p.canView) view++
        if (p.canCreate) create++
        if (p.canEdit) edit++
        if (p.canDelete) del++
      })

      return {
        roleId: role.id,
        name: role.name,
        description: role.description,
        userCount: role._count.users,
        viewCount: view,
        createCount: create,
        editCount: edit,
        deleteCount: del,
        totalPermissions: view + create + edit + del,
      }
    })

    res.json(summary)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/role-permissions?roleId=X
export async function getRolePermissions(req, res) {
  const roleId = parseId(req.query.roleId)
  if (!roleId) {
    return res.status(400).json({ message: "roleId is required" })
  }

  try {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    })
    if (!role) return res.status(404).json({ message: "Role not found" })

    // Fetch existing permissions
    const existing = await prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        menu: {
          select: { id: true, title: true, url: true, parentId: true, order: true },
        },
      },
    })

    // If Admin and no permissions exist yet, initialize with all menus granted
    if (existing.length === 0 && role.name.toLowerCase().includes("admin")) {
      const allMenus = await prisma.menu.findMany()
      const created = await prisma.$transaction(
        allMenus.map((m) =>
          prisma.rolePermission.create({
            data: {
              roleId,
              menuId: m.id,
              canView: true,
              canCreate: true,
              canEdit: true,
              canDelete: true,
            },
            include: {
              menu: {
                select: { id: true, title: true, url: true, parentId: true, order: true },
              },
            },
          }),
        ),
      )
      return res.json(created)
    }

    res.json(existing)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/role-permissions/bulk
// Body: { roleId: number, permissions: Array<{ menuId: number, canView: boolean, canCreate: boolean, canEdit: boolean, canDelete: boolean }> }
export async function saveRolePermissions(req, res) {
  const roleId = parseId(req.body.roleId)
  const permissions = Array.isArray(req.body.permissions) ? req.body.permissions : []

  if (!roleId) return res.status(400).json({ message: "roleId is required" })

  try {
    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (!role) return res.status(404).json({ message: "Role not found" })

    // Perform upsert inside a transaction
    const operations = permissions.map((item) => {
      const menuId = Number(item.menuId)
      const canView = Boolean(item.canView)
      const canCreate = Boolean(item.canCreate)
      const canEdit = Boolean(item.canEdit)
      const canDelete = Boolean(item.canDelete)

      return prisma.rolePermission.upsert({
        where: {
          roleId_menuId: {
            roleId,
            menuId,
          },
        },
        update: {
          canView,
          canCreate,
          canEdit,
          canDelete,
        },
        create: {
          roleId,
          menuId,
          canView,
          canCreate,
          canEdit,
          canDelete,
        },
      })
    })

    const results = await prisma.$transaction(operations)

    res.json({
      message: "Role permissions saved successfully",
      count: results.length,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
