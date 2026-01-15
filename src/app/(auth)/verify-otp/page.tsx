"use client";

import { useState } from "react";
import { verifyOtpAction } from "./actions";

export default function VerifyOtpPage() {
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        await verifyOtpAction(formData);
      }}
      className="w-full max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-medium text-zinc-100">
        Verify your email
      </h1>

      <p className="text-sm text-zinc-400">
        Enter the code sent to your email.
      </p>

      <input
        name="otp"
        inputMode="numeric"
        required
        placeholder="Enter verification code"
        className="w-full rounded-xl bg-[#161618] px-4 py-3"
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-white text-black py-3"
      >
        {loading ? "Verifying…" : "Verify"}
      </button>
    </form>
  );
}
