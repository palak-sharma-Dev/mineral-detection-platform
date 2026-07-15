"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const SIDEBAR_KEY = "garud-sidebar-collapsed";

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore persisted collapsed state from localStorage (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_KEY);
      if (stored !== null) setCollapsed(JSON.parse(stored) as boolean);
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      href: "/analysis",
      label: "New Prediction",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      href: "/history",
      label: "History",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5M12 7v5l4 2" />
        </svg>
      ),
    },
    {
      href: "/dashboard#snapshots",
      label: "Snapshots",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      href: "/reports",
      label: "Reports",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      href: "/subscription",
      label: "Subscription",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
  ];

  // If Admin role is detected, show Admin navigation links
  if (user?.role === "admin") {
    navItems.push({
      href: "/admin",
      label: "Admin Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    });
  }

  // Generate short initial placeholder for user profile avatar (e.g. "PS" for Palak Sharma)
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // Chevron icons for toggle button
  const ChevronLeft = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
  const ChevronRight = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  const renderNavLinks = (forMobile = false) => {
    const isCollapsed = collapsed && !forMobile;
    return (
      <nav className="flex-1 px-2 py-4 space-y-0.5" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard#snapshots"
              ? false
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]",
                isCollapsed ? "justify-center px-2" : "px-3.5",
                isActive
                  ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-indigo-400" : "text-zinc-500"
                )}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    );
  };

  const LogoutIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );

  return (
    <div
      className="min-h-screen flex bg-zinc-950 text-zinc-50"
      data-sidebar-collapsed={collapsed ? "true" : "false"}
    >
      {/* ── Desktop Sidebar ───────────────────────────────────────── */}
      <aside className="app-sidebar hidden md:flex md:flex-col md:fixed md:inset-y-0 border-r border-zinc-900/80 bg-zinc-900/40 backdrop-blur-md overflow-hidden z-20">
        {/* Brand header */}
        <div className="relative flex h-16 flex-shrink-0 items-center border-b border-zinc-900/60 px-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 min-w-0 flex-1 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]",
              collapsed ? "justify-center" : ""
            )}
          >
            {/* Icon mark — always visible */}
            <div className="relative flex-shrink-0 h-8 w-8 rounded-lg overflow-hidden bg-white shadow-md">
              <Image
                src="/garud-icon-32.png"
                alt="GARUD AI"
                fill
                sizes="32px"
                className="object-contain p-0.5"
                priority
              />
            </div>

            {/* Full logo — visible when expanded */}
            {!collapsed && (
              <div className="flex flex-col leading-tight min-w-0 overflow-hidden">
                <span className="text-sm font-semibold tracking-wide text-white uppercase truncate">
                  GARUD AI
                </span>
                <span className="text-[10px] font-medium tracking-[0.22em] text-zinc-500 uppercase truncate">
                  Intelligence
                </span>
              </div>
            )}
          </Link>

          {/* Collapse / expand toggle */}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "absolute -right-3 top-1/2 -translate-y-1/2 z-30",
              "inline-flex h-6 w-6 items-center justify-center rounded-full",
              "border border-zinc-700/80 bg-zinc-900 text-zinc-400",
              "hover:text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600",
              "transition-colors duration-150 shadow-md",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]"
            )}
          >
            {collapsed ? ChevronRight : ChevronLeft}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        {renderNavLinks(false)}

        {/* Profile Card and Logout */}
        <div className="flex-shrink-0 p-3 border-t border-zinc-900/80">
          {/* User avatar */}
          {collapsed ? (
            <div
              className="flex justify-center mb-2"
              title={user?.name ?? "User"}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-xs font-bold text-white shadow-inner flex-shrink-0">
                {userInitials}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-xs font-bold text-white shadow-inner flex-shrink-0">
                {userInitials}
              </div>
              <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                <span className="text-xs font-semibold text-zinc-200 truncate">{user?.name ?? "User"}</span>
                <span className="text-[10px] text-zinc-500 truncate">{user?.email ?? ""}</span>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Sign Out" : undefined}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 py-2 text-xs font-semibold text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700",
              collapsed ? "px-2" : "px-3"
            )}
          >
            {LogoutIcon}
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content area ────────────────────────────────────── */}
      <div className="app-main-content flex-1 flex flex-col min-w-0">
        {/* Mobile Shell Header */}
        <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-zinc-900/60 bg-zinc-950/80 backdrop-blur-md px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)] rounded-md">
            <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-white shadow-sm">
              <Image
                src="/garud-icon-32.png"
                alt="GARUD AI"
                fill
                sizes="32px"
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-white">GARUD AI</span>
          </Link>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-sidebar-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]"
          >
            {mobileMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </header>

        {/* Mobile menu drawer overlay */}
        {mobileMenuOpen && (
          <div
            id="mobile-sidebar-menu"
            className="fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col pt-16 md:hidden"
          >
            {renderNavLinks(true)}
            <div className="p-4 border-t border-zinc-900 mt-auto bg-zinc-900/20">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-zinc-900/40 border border-zinc-900/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-xs font-bold text-white shadow-inner flex-shrink-0">
                  {userInitials}
                </div>
                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                  <span className="text-xs font-semibold text-zinc-200 truncate">{user?.name ?? "User"}</span>
                  <span className="text-[10px] text-zinc-500 truncate">{user?.email ?? ""}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700"
              >
                {LogoutIcon}
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Platform Content Wrapper */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
