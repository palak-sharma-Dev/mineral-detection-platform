"use client";

import { useAuth } from "@/context/AuthContext";

export function CurrentUserName() {
  const { user } = useAuth();

  return <>{user?.name ?? "User"}</>;
}
