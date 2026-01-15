"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { finalizeSignupAction } from "./actions";

export default function SetPasswordPage() {
  const params = useSearchParams();
  const userId = params.get("uid");
  const [loading, setLoading] = useState(false);

  if (!userId) {
    return <div className="text-red-500">Invalid signup session</div>;
  }

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        await finalizeSignupAction(formData);
      }}
      className="w-full max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-medium text-zinc-100">
        Set your password
      </h1>

      <input
        name="password"
        type="password"
        required
        placeholder="Create a password"
        className="w-full rounded-xl bg-[#161618] px-4 py-3"
      />

      <input
        name="confirmPassword"
        type="password"
        required
        placeholder="Confirm password"
        className="w-full rounded-xl bg-[#161618] px-4 py-3"
      />

      <input type="hidden" name="userId" value={userId} />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-white text-black py-3"
      >
        {loading ? "Creating account…" : "Continue"}
      </button>
    </form>
  );
}
