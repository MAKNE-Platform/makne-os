"use client";

import { setPasswordAction } from "./actions";
import { useState } from "react";

export default function SetPasswordPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <form
        action={async (formData) => {
          setLoading(true);
          await setPasswordAction(formData);
          setLoading(false);
        }}
        className="space-y-4"
      >
        <h1 className="text-2xl font-medium text-white">
          Set your password
        </h1>

        <p className="text-sm text-zinc-400">
          Choose a strong password to secure your account.
        </p>

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#636EE1]"
        />

        <input
          name="confirmPassword"
          type="password"
          required
          placeholder="Confirm password"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#636EE1]"
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-[#636EE1] py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Saving…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
