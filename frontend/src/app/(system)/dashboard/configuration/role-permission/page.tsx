import { DashboardPageShell } from "@/components/system/dashboard-page-shell"

export default function RolePermissionPage() {
  return (
    <DashboardPageShell
      title="Role Permission"
      description="Map permissions to roles for fine-grained access control."
      badge="Configuration"
      actionLabel="Assign permission"
    />
  )
}
