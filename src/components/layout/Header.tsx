"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[color:var(--foreground-secondary)] transition hover:text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="rounded-[0.5rem] bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open mobile menu"
          aria-expanded="false"
          className="inline-flex items-center justify-center rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] p-2 text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
