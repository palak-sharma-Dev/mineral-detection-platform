"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicAuthRoute } from "@/components/auth/PublicAuthRoute";
import { getDefaultAuthenticatedPath, useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("fullName") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      await register(name, email, password);
      const user = await login(email, password);
      router.replace(getDefaultAuthenticatedPath(user.role));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicAuthRoute>
      <main className="min-h-screen bg-[color:var(--background)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
          <div className="w-full max-w-[26rem] rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] px-6 py-8 shadow-[0_1px_2px_rgba(15,26,43,0.04)] sm:px-8 sm:py-9">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-[0.625rem] bg-[color:var(--primary)] text-sm font-semibold uppercase tracking-[0.22em] text-white">
                G
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-[color:var(--foreground)]">GARUD AI</span>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                  Mineral Intelligence
                </span>
              </div>
            </div>

            <h1 className="mt-8 text-2xl font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
              Create Account
            </h1>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--primary)]"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--primary)]"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--primary)]"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--primary)]"
                />
              </div>

              {error ? (
                <p className="text-sm font-medium text-[color:var(--error)]">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--primary)]/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating Account" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[color:var(--foreground-secondary)]">
              <Link href="/login" className="font-medium text-[color:var(--primary)] transition hover:text-[color:var(--primary)]/80">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </PublicAuthRoute>
  );
}
