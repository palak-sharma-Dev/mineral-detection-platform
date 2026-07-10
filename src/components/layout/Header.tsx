"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#solutions", label: "Solutions" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
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
        "sticky top-0 z-40 transition-all duration-300 ease-out " +
        (isScrolled
          ? "bg-[color:var(--card)]/90 backdrop-blur-xl border-b border-[color:var(--foreground-muted)]/15 shadow-[var(--shadow-elevated)]"
          : "bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--primary)] text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[var(--shadow-card)]">
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
            className="rounded-full border border-[color:var(--foreground-muted)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--foreground)] hover:text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          >
            Login
          </Link>
          <Link
            href="/get-started"
            className="rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open mobile menu"
          aria-expanded="false"
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--foreground-muted)] bg-[color:var(--card)]/90 p-2 text-[color:var(--foreground)] transition hover:border-[color:var(--foreground)] hover:bg-[color:var(--card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
