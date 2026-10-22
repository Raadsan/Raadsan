"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import {
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconLock,
} from "@tabler/icons-react"

import api from "@/api/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const fieldClass =
  "h-12 rounded-xl border-0 bg-slate-100 pl-10 shadow-none placeholder:text-slate-400 focus-visible:ring-primary/25 dark:bg-slate-800/70 dark:placeholder:text-slate-500"

const labeledFieldClass =
  "h-11 rounded-xl border border-slate-200 bg-white shadow-none placeholder:text-slate-400 focus-visible:ring-primary/25 dark:border-slate-700 dark:bg-transparent dark:placeholder:text-slate-500"

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const fullName = (formData.get("fullName") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)

    try {
      await api.post("/api/auth/register", {
        fullName,
        email,
        password,
        confirmPassword,
      })

      // Store credentials in sessionStorage so the login form can automatically fill them
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "signup_credentials",
          JSON.stringify({ email, password }),
        )
      }

      router.push("/login")
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "Failed to create account. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Ahmed Ali"
            required
            autoComplete="name"
            className={labeledFieldClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
            className={labeledFieldClass}
          />
        </div>
      </div>

      <div className="flex h-12 items-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/70">
        <div className="flex h-full shrink-0 items-center border-r border-slate-200/80 px-3 dark:border-slate-700">
          <select
            name="countryCode"
            defaultValue="+252"
            className="appearance-none bg-transparent text-sm font-medium text-slate-600 outline-none dark:text-slate-300"
            aria-label="Country code"
          >
            <option value="+252">+252</option>
            <option value="+251">+251</option>
            <option value="+254">+254</option>
            <option value="+971">+971</option>
          </select>
        </div>
        <Input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          autoComplete="tel"
          className="h-full flex-1 rounded-none border-0 bg-transparent px-3 shadow-none placeholder:text-slate-400 focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-slate-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="relative block">
          <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            minLength={8}
            autoComplete="new-password"
            className={`${fieldClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <IconEyeOff className="size-4" />
            ) : (
              <IconEye className="size-4" />
            )}
          </button>
        </label>

        <label className="relative block">
          <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm"
            required
            minLength={8}
            autoComplete="new-password"
            className={`${fieldClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-foreground"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <IconEyeOff className="size-4" />
            ) : (
              <IconEye className="size-4" />
            )}
          </button>
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="mt-2 h-12 w-full rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase hover:bg-primary/90"
      >
        {loading ? "Creating..." : "Sign Up"}
        <IconArrowRight className="size-4" />
      </Button>

      <p className="text-center">
        <Link
          href="/login"
          className="text-sm font-bold text-primary hover:underline dark:text-[#ffbc11]"
        >
          Back to Login
        </Link>
      </p>
    </form>
  )
}
