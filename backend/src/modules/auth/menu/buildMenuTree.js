import { prisma } from "../../../lib/prisma.js"

/**
 * Nested menu tree for a role (only items with canView, plus ancestor folders).
 * @param {number} roleId
 */
export async function buildMenuTreeForRole(roleId) {
  const perms = await prisma.rolePermission.findMany({
    where: { roleId, canView: true },
    select: { menuId: true },
  })
  const allowedMenuIds = new Set(perms.map((p) => p.menuId))

  let allMenus = await prisma.menu.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: {
      parent: {
        select: { id: true, title: true },
      },
    },
  })

  if (allowedMenuIds.size > 0) {
    const idToParent = new Map(allMenus.map((item) => [item.id, item.parentId]))
    const expanded = new Set(allowedMenuIds)
    for (const id of allowedMenuIds) {
      let parentId = idToParent.get(id)
      while (parentId) {
        expanded.add(parentId)
        parentId = idToParent.get(parentId)
      }
    }
    allMenus = allMenus.filter((item) => expanded.has(item.id))
  } else {
    allMenus = []
  }

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

  return tree
}
