"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-1.5 rounded-md border 
                 text-sm text-red-500 transition hover:bg-red-500
                 border-red-500 hover:text-white mt-2 w-full"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}