"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  IconArrowLeft,
  IconArticle,
  IconBuilding,
  IconCheck,
  IconCircle,
  IconDashboard,
  IconFileText,
  IconFolder,
  IconHeartHandshake,
  IconHelpCircle,
  IconHome,
  IconInfoCircle,
  IconLogout,
  IconMail,
  IconMenu2,
  IconMessages,
  IconPackage,
  IconServer,
  IconSettings,
  IconShield,
  IconSparkles,
  IconTarget,
  IconTrophy,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react"

import { menuApi, type MenuItem } from "@/api/configuration/menu"
import { clearAuthUser, getAuthUser } from "@/lib/auth-session"
import { NavMain, type ModuleNavItem } from "@/components/system/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// Icon dictionary supporting icons configured in the database
const ICON_MAP: Record<string, any> = {
  icondashboard: IconDashboard,
  iconfolder: IconFolder,
  iconsettings: IconSettings,
  iconhome: IconHome,
  iconinfocircle: IconInfoCircle,
  iconpackage: IconPackage,
  iconmail: IconMail,
  iconusers: IconUsers,
  iconshield: IconShield,
  iconmenu: IconMenu2,
  iconmenu2: IconMenu2,
  iconserver: IconServer,
  icontrophy: IconTrophy,
  iconusersgroup: IconUsersGroup,
  iconarticle: IconArticle,
  iconmessages: IconMessages,
  iconhelpcircle: IconHelpCircle,
  iconbuilding: IconBuilding,
  icontarget: IconTarget,
  iconhearthandshake: IconHeartHandshake,
  iconcheck: IconCheck,
  iconfiletext: IconFileText,
  iconsparkles: IconSparkles,
}

function resolveMenuIcon(iconName: string | null | undefined, hasChildren: boolean) {
  if (iconName) {
    const key = iconName.toLowerCase().replace(/[^a-z0-9]/g, "")
    if (ICON_MAP[key]) return ICON_MAP[key]
  }
  if (hasChildren) return IconFolder
  return null
}

// Find a node by ID anywhere in the tree
function findNodeById(nodes: MenuItem[], id: number): MenuItem | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

// Find parent node of a given child ID
function findParentNode(nodes: MenuItem[], childId: number): MenuItem | null {
  for (const node of nodes) {
    if (node.children?.some((c) => c.id === childId)) return node
    if (node.children && node.children.length > 0) {
      const found = findParentNode(node.children, childId)
      if (found) return found
    }
  }
  return null
}

// Trace lineage [Root, Submenu, Leaf] matching the current pathname
function findLineage(nodes: MenuItem[], pathname: string): MenuItem[] {
  for (const node of nodes) {
    if (
      node.url &&
      (pathname === node.url ||
        pathname.startsWith(`${node.url}/`) ||
        // Support matching /dashboard/management if node is /management
        (node.url.startsWith("/management") &&
          pathname.startsWith(`/dashboard${node.url}`)) ||
        (node.url.startsWith("/configuration") &&
          pathname.startsWith(`/dashboard${node.url}`)))
    ) {
      if (node.children && node.children.length > 0) {
        const sub = findLineage(node.children, pathname)
        return [node, ...sub]
      }
      return [node]
    }
  }
  return []
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [sessionRoleId, setSessionRoleId] = useState<number | null | undefined>(
    undefined
  )

  useEffect(() => {
    const user = getAuthUser()
    setSessionRoleId(user?.roleId ?? null)
  }, [])

  // 1. Fetch menu tree filtered by the logged-in user's role permissions
  const { data: menuTree = [] } = useQuery({
    queryKey: ["menus", "tree", sessionRoleId ?? "none"],
    queryFn: () => {
      if (sessionRoleId == null) return Promise.resolve([])
      return menuApi.getTree(sessionRoleId)
    },
    enabled: sessionRoleId !== undefined,
  })

  // 2. Active parent ID being viewed (null = Root Level: Dashboard, Management, Configuration)
  const [activeParentId, setActiveParentId] = useState<number | null>(null)

  // 3. Automatically sync sidebar drill-down level with current pathname
  useEffect(() => {
    if (!menuTree || menuTree.length === 0) return

    const lineage = findLineage(menuTree, pathname)
    if (lineage.length === 0) {
      // If at /dashboard or unknown, show root
      setActiveParentId(null)
      return
    }

    const last = lineage[lineage.length - 1]
    const hasChildren = Boolean(last.children && last.children.length > 0)

    if (hasChildren) {
      // We are at a parent module (e.g. /management or /management/home)
      setActiveParentId(last.id)
    } else if (lineage.length >= 2) {
      // We are at a leaf item (e.g. /management/home/services), show its parent's items
      const parent = lineage[lineage.length - 2]
      setActiveParentId(parent.id)
    } else {
      // Top level item without children (e.g. /dashboard)
      setActiveParentId(null)
    }
  }, [pathname, menuTree])

  // Current parent node being viewed
  const currentParent = useMemo(() => {
    if (activeParentId == null) return null
    return findNodeById(menuTree, activeParentId)
  }, [menuTree, activeParentId])

  // Grandparent node (for Back button navigation)
  const grandParent = useMemo(() => {
    if (!currentParent) return null
    return findParentNode(menuTree, currentParent.id)
  }, [menuTree, currentParent])

  // Menu items to render at the current viewing level
  const itemsToRender: MenuItem[] = useMemo(() => {
    if (currentParent && currentParent.children) {
      return currentParent.children
    }
    return menuTree
  }, [currentParent, menuTree])

  // Handle "Back" button click
  const handleBack = () => {
    if (grandParent) {
      // Go back to grandparent level
      setActiveParentId(grandParent.id)
      if (grandParent.url) router.push(grandParent.url)
    } else {
      // Go back to root level (Dashboard, Management, Configuration)
      setActiveParentId(null)
      router.push("/dashboard")
    }
  }

  // Convert menu items into NavMain items
  const navItems: ModuleNavItem[] = useMemo(() => {
    return itemsToRender.map((item) => {
      const hasChildren = Boolean(item.children && item.children.length > 0)
      const IconComponent = resolveMenuIcon(item.icon, hasChildren)

      if (hasChildren) {
        return {
          title: item.title,
          url: item.url || undefined,
          icon: IconComponent,
          openModule: true,
          onOpenModule: () => {
            setActiveParentId(item.id)
            if (item.url) router.push(item.url)
          },
        }
      }

      return {
        title: item.title,
        url: item.url || undefined,
        icon: IconComponent,
      }
    })
  }, [itemsToRender, router])

  // Back button label
  const backLabel = useMemo(() => {
    if (!currentParent) return null
    if (grandParent) return `Back to ${grandParent.title}`
    return "Back to Modules"
  }, [currentParent, grandParent])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Brand Header */}
      <SidebarHeader className="px-4 pb-2 pt-6">
        <Link
          href="/dashboard"
          onClick={() => setActiveParentId(null)}
          className="mx-auto block w-[160px]"
          aria-label="Raadsan Technology dashboard"
        >
          <Image
            src="/images/logo-dark-mode.png"
            alt="Raadsan Technology"
            width={217}
            height={72}
            className="h-auto w-full object-contain"
            priority
          />
        </Link>
      </SidebarHeader>

      {/* Navigation Content (100% Dynamic from Database) */}
      <SidebarContent className="mt-2 gap-0 px-1">
        {/* Back Button when viewing sub-levels */}
        {currentParent ? (
          <>
            <SidebarMenu className="px-3">
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  className="h-11 cursor-pointer rounded-xl px-3 text-[15px] font-medium text-white hover:bg-white/10 hover:text-white"
                  onClick={handleBack}
                >
                  <IconArrowLeft strokeWidth={1.6} />
                  <span>{backLabel}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator className="mx-3 my-2 bg-white/15" />
          </>
        ) : null}

        {/* Dynamic Nav Items */}
        <NavMain items={navItems} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-1 pb-4">
        <SidebarSeparator className="mx-3 mb-3 bg-white/15" />
        <SidebarMenu className="px-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              className="h-11 cursor-pointer rounded-xl px-3 text-[15px] font-medium text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => {
                clearAuthUser()
                void queryClient.invalidateQueries({ queryKey: ["menus", "tree"] })
                router.push("/login")
              }}
            >
              <IconLogout strokeWidth={1.6} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
