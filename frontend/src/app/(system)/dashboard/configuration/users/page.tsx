import { DashboardPageShell } from "@/components/system/dashboard-page-shell"

export default function UsersPage() {
  return (
    <DashboardPageShell
      title="Users"
      description="Manage admin users and assign them to roles."
      badge="Configuration"
      actionLabel="Add user"
    />
  )
}
