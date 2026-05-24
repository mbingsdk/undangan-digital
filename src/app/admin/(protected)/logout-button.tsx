"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

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
      className="inline-flex h-10 items-center justify-center gap-2 border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-400"
      disabled={isLoggingOut}
      onClick={handleLogout}
      type="button"
    >
      <LogOut aria-hidden="true" className="size-4" />
      <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
    </button>
  );
}
