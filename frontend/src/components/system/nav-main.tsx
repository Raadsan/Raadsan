"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import type { Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/app/lib/utils"

type NavIcon = LucideIcon | Icon

export type ModuleNavItem = {
  title: string
  url?: string
  icon?: NavIcon
  /** Opens another sidebar module (no dropdown) */
  openModule?: boolean
  onOpenModule?: () => void
}

const itemButtonClass =
  "h-11 rounded-xl px-3 text-[15px] font-medium text-white hover:bg-white/10 hover:text-white data-[active=true]:bg-secondary data-[active=true]:text-white data-[active=true]:hover:bg-secondary data-[active=true]:hover:text-white dark:data-[active=true]:bg-white dark:data-[active=true]:text-slate-900 dark:data-[active=true]:hover:bg-white dark:data-[active=true]:hover:text-slate-900 [&>svg]:size-5"

export function NavMain({ items }: { items: ModuleNavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="px-3 py-2">
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {items.map((item) => {
            const isActive = item.url
              ? pathname === item.url || pathname.startsWith(`${item.url}/`)
              : false

            if (item.openModule && item.onOpenModule) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    type="button"
                    tooltip={item.title}
                    isActive={isActive}
                    className={cn(itemButtonClass, "cursor-pointer")}
                    onClick={item.onOpenModule}
                  >
                    {item.icon ? <item.icon stroke={1.6} /> : null}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={Boolean(item.url && pathname === item.url)}
                  className={itemButtonClass}
                >
                  <Link href={item.url ?? "#"}>
                    {item.icon ? <item.icon stroke={1.6} /> : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
