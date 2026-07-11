import Link from "next/link";

export default function RegisterPage() {
  return (
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

          <form className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
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
                className="w-full rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--primary)]"
              />
            </div>

            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--primary)]/90"
            >
              Create Account
            </Link>
          </form>

          <div className="mt-6 text-center text-sm text-[color:var(--foreground-secondary)]">
            <Link href="/login" className="font-medium text-[color:var(--primary)] transition hover:text-[color:var(--primary)]/80">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
