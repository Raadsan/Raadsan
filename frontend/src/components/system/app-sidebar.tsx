"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconDashboard,
  IconFolder,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/system/nav-main"
import {
  configurationItems,
  getModuleFromPath,
  getPageModule,
  getPageUrl,
  getSectionUrl,
  managementItems,
  pageModuleKeys,
  type ModuleKey,
  type PageModuleKey,
} from "@/lib/dashboard-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [module, setModule] = useState<ModuleKey>(() =>
    getModuleFromPath(pathname),
  )

  useEffect(() => {
    setModule(getModuleFromPath(pathname))
  }, [pathname])

  const openManagement = () => {
    setModule("management")
    router.push("/dashboard/management")
  }

  const openPageModule = (key: PageModuleKey) => {
    setModule(key)
    router.push(getPageUrl(key))
  }

  const openConfiguration = () => {
    setModule("configuration")
    if (!pathname.startsWith("/dashboard/configuration")) {
      router.push("/dashboard/configuration/roles")
    }
  }

  const backToMain = () => {
    setModule("main")
    router.push("/dashboard")
  }

  const backToManagement = () => {
    setModule("management")
    router.push("/dashboard/management")
  }

  const mainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Management",
      url: "/dashboard/management",
      icon: IconFolder,
      openModule: true,
      onOpenModule: openManagement,
    },
    {
      title: "Configuration",
      url: "/dashboard/configuration",
      icon: IconSettings,
      openModule: true,
      onOpenModule: openConfiguration,
    },
  ]

  const managementNavItems = managementItems.map((item) => ({
    title: item.title,
    url: item.url,
    openModule: true,
    onOpenModule: () => openPageModule(item.module),
  }))

  const activePageModule =
    pageModuleKeys.includes(module as PageModuleKey)
      ? getPageModule(module)
      : undefined

  const pageNavItems =
    activePageModule?.sections.map((section) => ({
      title: section.title,
      url: getSectionUrl(activePageModule.key, section.slug),
    })) ?? []

  const configurationNavItems = configurationItems.map((item) => ({
    title: item.title,
    url: item.url,
  }))

  const isPageModule = pageModuleKeys.includes(module as PageModuleKey)

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-4 pb-2 pt-6">
        <Link
          href="/dashboard"
          onClick={() => setModule("main")}
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

      <SidebarContent className="mt-2 gap-0 px-1">
        {module !== "main" ? (
          <>
            <SidebarMenu className="px-3">
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  className="h-11 cursor-pointer rounded-xl px-3 text-[15px] font-medium text-white hover:bg-white/10 hover:text-white"
                  onClick={isPageModule ? backToManagement : backToMain}
                >
                  <IconArrowLeft stroke={1.6} />
                  <span>
                    {isPageModule
                      ? "Back to Management"
                      : "Back to Modules"}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator className="mx-3 my-2 bg-white/15" />
          </>
        ) : null}

        {module === "main" ? <NavMain items={mainItems} /> : null}
        {module === "management" ? (
          <NavMain items={managementNavItems} />
        ) : null}
        {isPageModule ? <NavMain items={pageNavItems} /> : null}
        {module === "configuration" ? (
          <NavMain items={configurationNavItems} />
        ) : null}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
