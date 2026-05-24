"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminButtonSecondaryClass } from "@/components/admin/admin-ui";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      aria-label="Keluar"
      className={`${adminButtonSecondaryClass} h-10 gap-2 px-3`}
      disabled={isLoggingOut}
      onClick={handleLogout}
      type="button"
    >
      <LogOut aria-hidden="true" className="size-4" />
      <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
    </button>
  );
}
