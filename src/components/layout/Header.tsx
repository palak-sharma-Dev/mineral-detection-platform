"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Landing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analysis", label: "Analysis" },
  { href: "/history", label: "History" },
  { href: "/reports", label: "Reports" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={
        "sticky top-0 z-40 border-b border-[color:var(--foreground-muted)]/12 transition-all duration-200 ease-out " +
        (isScrolled
          ? "bg-[color:var(--background)]/90 backdrop-blur-sm"
          : "bg-[color:var(--background)]")
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
        >
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-[0.625rem] bg-[color:var(--primary)] text-sm font-semibold uppercase tracking-[0.22em] text-white">
            G
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-[color:var(--foreground)]">GARUD AI</span>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
              Mineral Intelligence
            </span>
          </div>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
                  isActive
                    ? "text-[color:var(--foreground)]"
                    : "text-[color:var(--foreground-secondary)] hover:text-[color:var(--foreground)]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          className="inline-flex items-center justify-center rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] p-2 text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {mobileMenuOpen ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] transition-[max-height] duration-300 ease-out md:hidden",
          mobileMenuOpen ? "max-h-[520px]" : "max-h-0"
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-5 pt-4 sm:px-6">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[0.5rem] px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
                  isActive
                    ? "bg-[color:var(--surface-muted)] text-[color:var(--foreground)]"
                    : "text-[color:var(--foreground-secondary)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-4 py-3 text-left text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-4 py-3 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
