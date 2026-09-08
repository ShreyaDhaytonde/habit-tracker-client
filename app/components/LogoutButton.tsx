"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "habit_auth=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full px-3 py-1 text-sm text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
    >
      Logout
    </button>
  );
}
