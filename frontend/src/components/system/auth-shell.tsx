import Image from "next/image"
import Link from "next/link"

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-2">
        <div className="relative hidden items-center justify-center overflow-hidden bg-[#002d5e] p-10 text-center text-white lg:flex dark:bg-[#061f3f]">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#116cc6]/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full bg-[#ffbc11]/15 blur-2xl" />

          <div className="relative z-10 flex max-w-xs flex-col items-center gap-5">
            <Link href="/" className="block w-[180px]">
              <Image
                src="/images/logo-dark-mode.png"
                alt="Raadsan Technology"
                width={217}
                height={72}
                className="h-auto w-full object-contain"
                priority
              />
            </Link>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold leading-snug tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-sm leading-7 text-white/75">
                Empowering your business with smart digital solutions. Sign in to
                securely manage your platform, operations, and services.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Link href="/" className="mb-4 block w-[160px]">
              <Image
                src="/images/logo-light-mode.png"
                alt="Raadsan Technology"
                width={217}
                height={72}
                className="h-auto w-full object-contain"
                priority
              />
            </Link>
          </div>

          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
