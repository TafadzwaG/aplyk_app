import * as React from "react"
import type { FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { ApiRequestError, accountApi } from "@/lib/api"
import { Link } from "@/lib/router"
import type { RegisterRequest, RegistrationResult } from "@/types/api"

type RegistrationField = keyof RegisterRequest | "general"
type RegistrationErrors = Partial<Record<RegistrationField, string>>

const PASSWORD_PATTERN =
  "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"

function getApiFieldError(
  errors: Record<string, string[]> | undefined,
  field: RegistrationField
) {
  const matchingKey = Object.keys(errors ?? {}).find(
    (key) => key.toLowerCase() === field.toLowerCase()
  )
  return matchingKey ? errors?.[matchingKey]?.[0] : undefined
}

function getRegistrationErrors(error: ApiRequestError): RegistrationErrors {
  return {
    email: getApiFieldError(error.errors, "email"),
    password: getApiFieldError(error.errors, "password"),
    phoneNumber: getApiFieldError(error.errors, "phoneNumber"),
    firstName: getApiFieldError(error.errors, "firstName"),
    lastName: getApiFieldError(error.errors, "lastName"),
    twoFactorEnabled: getApiFieldError(error.errors, "twoFactorEnabled"),
    general: getApiFieldError(error.errors, "general"),
  }
}

function optionalValue(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim()
  return normalized || null
}

export function RegisterPage() {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false)
  const [errors, setErrors] = React.useState<RegistrationErrors>({})
  const [registration, setRegistration] = React.useState<
    (RegistrationResult & { email: string }) | null
  >(null)

  function clearError(field: RegistrationField) {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      general: undefined,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const payload: RegisterRequest = {
      email,
      password: String(form.get("password") ?? ""),
      phoneNumber: optionalValue(form.get("phoneNumber")),
      firstName: optionalValue(form.get("firstName")),
      lastName: optionalValue(form.get("lastName")),
      twoFactorEnabled,
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      const result = await accountApi.register(payload)
      setRegistration({ ...result, email })
      toast.success(result.message)
    } catch (error) {
      if (error instanceof ApiRequestError) {
        const apiErrors = getRegistrationErrors(error)
        setErrors({
          ...apiErrors,
          general:
            apiErrors.general ??
            (Object.values(apiErrors).some(Boolean)
              ? undefined
              : error.message),
        })
        toast.error(error.message)
      } else {
        const message = "Registration could not be completed."
        setErrors({ general: message })
        toast.error(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSignIn() {
    try {
      await login()
    } catch {
      toast.error("Could not start sign-in. Try again.")
    }
  }

  if (registration) {
    return (
      <>
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-[0.12em] text-brand-orange uppercase">
            Almost there
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
            {registration.canResendConfirmation
              ? "Account created"
              : "Confirm your email"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {registration.message} Your registered email is{" "}
            <span className="font-medium text-foreground">{registration.email}</span>.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            size="lg"
            className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
            onClick={() => void handleSignIn()}
          >
            Continue to sign in
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already confirmed?{" "}
            <button
              type="button"
              className="font-medium text-brand-navy underline-offset-4 hover:underline"
              onClick={() => void handleSignIn()}
            >
              Sign in now
            </button>
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.12em] text-brand-orange uppercase">
          Get started
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter your account details. You will confirm your email before signing in.
        </p>
      </div>
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="flex flex-col gap-5"
      >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.firstName)}>
                <FieldLabel htmlFor="register-first-name">
                  First name
                </FieldLabel>
                <Input
                  id="register-first-name"
                  name="firstName"
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.firstName)}
                  onChange={() => clearError("firstName")}
                />
                <FieldError>{errors.firstName}</FieldError>
              </Field>
              <Field data-invalid={Boolean(errors.lastName)}>
                <FieldLabel htmlFor="register-last-name">Last name</FieldLabel>
                <Input
                  id="register-last-name"
                  name="lastName"
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.lastName)}
                  onChange={() => clearError("lastName")}
                />
                <FieldError>{errors.lastName}</FieldError>
              </Field>
            </div>
            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="register-email">Email address</FieldLabel>
              <Input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                onChange={() => clearError("email")}
                required
              />
              <FieldError>{errors.email}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors.phoneNumber)}>
              <FieldLabel htmlFor="register-phone">Phone number</FieldLabel>
              <Input
                id="register-phone"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phoneNumber)}
                onChange={() => clearError("phoneNumber")}
                placeholder="Optional"
              />
              <FieldError>{errors.phoneNumber}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="register-password">Password</FieldLabel>
              <Input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                pattern={PASSWORD_PATTERN}
                title="Use at least 8 characters with uppercase, lowercase, a number, and a special character."
                aria-invalid={Boolean(errors.password)}
                onChange={() => clearError("password")}
                required
              />
              <FieldDescription>
                At least 8 characters, including uppercase, lowercase, a number,
                and a special character.
              </FieldDescription>
              <FieldError>{errors.password}</FieldError>
            </Field>
            <Field
              orientation="horizontal"
              data-invalid={Boolean(errors.twoFactorEnabled)}
            >
              <Checkbox
                id="register-two-factor"
                checked={twoFactorEnabled}
                onCheckedChange={(checked) => {
                  setTwoFactorEnabled(checked === true)
                  clearError("twoFactorEnabled")
                }}
                aria-invalid={Boolean(errors.twoFactorEnabled)}
              />
              <FieldContent>
                <FieldLabel htmlFor="register-two-factor">
                  Enable two-factor authentication
                </FieldLabel>
                <FieldDescription>
                  Require an additional verification step when signing in.
                </FieldDescription>
                <FieldError>{errors.twoFactorEnabled}</FieldError>
              </FieldContent>
            </Field>
            {errors.general && (
              <Field data-invalid>
                <FieldError>{errors.general}</FieldError>
              </Field>
            )}
          </FieldGroup>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-navy underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
    </>
  )
}
