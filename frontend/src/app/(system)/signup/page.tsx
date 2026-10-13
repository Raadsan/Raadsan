import { AuthShell } from "@/components/system/auth-shell"
import { SignupForm } from "@/components/system/signup-form"

export default function SignupPage() {
  return (
    <AuthShell
      title="Create Account"
      subtitle="Join us today."
    >
      <SignupForm />
    </AuthShell>
  )
}
