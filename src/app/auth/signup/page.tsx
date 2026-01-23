"use client";

import { createTempUserAction } from "./actions";
import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <form
        action={async (formData) => {
          setLoading(true);
          await createTempUserAction(formData);
          setLoading(false);
        }}
        className="space-y-4"
      >
        <h1 className="text-2xl font-medium text-white">
          Create your account
        </h1>

        <p className="text-sm text-zinc-400">
          Get started with MAKNE using your email.
        </p>

        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#636EE1]"
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-[#636EE1] py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Sending code…" : "Continue"}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-white hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
