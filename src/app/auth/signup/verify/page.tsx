"use client";

import { verifySignupCodeAction } from "./actions";
import { useState } from "react";

export default function VerifySignupPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <form
        action={async (formData) => {
          setLoading(true);
          await verifySignupCodeAction(formData);
          setLoading(false);
        }}
        className="space-y-4"
      >
        <h1 className="text-2xl font-medium text-white">
          Verify your email
        </h1>

        <p className="text-sm text-zinc-400">
          Enter the verification code sent to your email.
        </p>

        <input
          name="code"
          type="text"
          inputMode="numeric"
          required
          placeholder="6-digit code"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white tracking-widest outline-none focus:ring-2 focus:ring-[#636EE1]"
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-[#636EE1] py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-400">
        Didn’t receive a code?{" "}
        <button className="text-white hover:underline">
          Resend
        </button>
      </p>
    </div>
  );
}
