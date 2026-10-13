import { DashboardPageShell } from "@/components/system/dashboard-page-shell"

export default function MenuPage() {
  return (
    <DashboardPageShell
      title="Menu"
      description="Configure navigation menus available in the admin panel."
      badge="Configuration"
      actionLabel="Add menu item"
    />
  )
}
