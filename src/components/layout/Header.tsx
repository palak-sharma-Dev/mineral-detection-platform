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
  { href: "/admin", label: "Admin", adminOnly: true },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || user?.role === "admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenuId = window.setTimeout(() => {
      setMobileMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(closeMenuId);
  }, [pathname]);

  return (
    <header
      className={
        "sticky top-0 z-40 border-b transition-all duration-300 ease-out " +
        (isScrolled
          ? "border-white/10 bg-[color:var(--background)]/82 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "border-white/5 bg-[color:var(--background)]/72 backdrop-blur-md")
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
        >
          <div className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-[0.7rem] border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition group-hover:border-[color:var(--primary)]/50">
            <img src="/garud-icon-32.png" alt="" className="h-8 w-8" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-[color:var(--foreground)]">GARUD AI</span>
            <span className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-muted)]">
              Mineral Intelligence
            </span>
          </div>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.035] p-1 md:flex">
          {visibleNavItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
                  isActive
                    ? "bg-white/[0.09] text-[color:var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]"
                    : "text-[color:var(--foreground-secondary)] hover:bg-white/[0.06] hover:text-[color:var(--foreground)]"
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
              className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
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
          className="inline-flex items-center justify-center rounded-[0.625rem] border border-white/10 bg-white/[0.06] p-2 text-[color:var(--foreground)] transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] md:hidden"
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
          "overflow-hidden border-t border-white/10 bg-[color:var(--background)]/96 backdrop-blur-xl transition-[max-height] duration-300 ease-out md:hidden",
          mobileMenuOpen ? "max-h-[520px]" : "max-h-0"
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-5 pt-4 sm:px-6">
          {visibleNavItems.map((item) => {
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
                    ? "bg-white/[0.09] text-[color:var(--foreground)]"
                    : "text-[color:var(--foreground-secondary)] hover:bg-white/[0.06] hover:text-[color:var(--foreground)]"
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
              className="rounded-[0.5rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-[0.5rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
