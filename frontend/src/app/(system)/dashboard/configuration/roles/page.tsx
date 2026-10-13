import { DashboardPageShell } from "@/components/system/dashboard-page-shell"

export default function RolesPage() {
  return (
    <DashboardPageShell
      title="Roles"
      description="Define admin roles and access levels for your team."
      badge="Configuration"
      actionLabel="Add role"
    />
  )
}
