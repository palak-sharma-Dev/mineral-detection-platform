"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSafeRedirectPath, useAuth } from "@/context/AuthContext";

export function PublicAuthRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    const nextPath = new URLSearchParams(window.location.search).get("next");
    router.replace(getSafeRedirectPath(nextPath, user.role));
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
