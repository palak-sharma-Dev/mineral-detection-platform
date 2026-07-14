"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDefaultAuthenticatedPath, useAuth, UserRole } from "@/context/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.replace(getDefaultAuthenticatedPath(user.role));
    }
  }, [allowedRoles, isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading || !isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
