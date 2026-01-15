"use client";

import { createTempUserAction } from "./actions";
import { useState } from "react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        await createTempUserAction(formData);
      }}
      className="w-full max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-medium text-zinc-100">
        Create your account
      </h1>

      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="w-full rounded-xl bg-[#161618] px-4 py-3"
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-white text-black py-3"
      >
        {loading ? "Sending code…" : "Continue"}
      </button>
    </form>
  );
}
