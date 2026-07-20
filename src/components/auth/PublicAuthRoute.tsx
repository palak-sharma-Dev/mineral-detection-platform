"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDefaultAuthenticatedPath, useAuth } from "@/context/AuthContext";

export function PublicAuthRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    router.replace(getDefaultAuthenticatedPath(user.role));
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
