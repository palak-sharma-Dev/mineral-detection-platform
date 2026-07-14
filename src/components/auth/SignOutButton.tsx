"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function SignOutButton({ className }: { className: string }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Sign Out
    </button>
  );
}
