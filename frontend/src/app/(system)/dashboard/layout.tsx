import { AppSidebar } from "@/components/system/app-sidebar"
import { SiteHeader } from "@/components/system/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      className="bg-background"
      style={
        {
          "--sidebar-width": "17.5rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar className="border-r border-sidebar-border" />
      <SidebarInset className="overflow-hidden bg-background">
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-background">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
