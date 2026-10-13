import { AuthShell } from "@/components/system/auth-shell"
import { LoginForm } from "@/components/system/login-form"

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Enter your email and password to access the dashboard."
    >
      <LoginForm />
    </AuthShell>
  )
}
