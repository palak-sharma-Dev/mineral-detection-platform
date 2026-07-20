"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDefaultAuthenticatedPath, useAuth, UserRole } from "@/context/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      const nextPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.replace(getDefaultAuthenticatedPath(user.role));
    }
  }, [allowedRoles, isAuthenticated, isLoading, router, user]);

  if (isLoading || !isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
