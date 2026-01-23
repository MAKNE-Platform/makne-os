"use client";

import { onboardBrandAction } from "./actions";
import { useState } from "react";

export default function BrandOnboardingPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-md">
      <form
        action={async (formData) => {
          setLoading(true);
          await onboardBrandAction(formData);
          setLoading(false);
        }}
        className="space-y-4"
      >
        <h1 className="text-2xl font-medium text-white">
          Brand details
        </h1>

        <input
          name="brandName"
          required
          placeholder="Brand name"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none"
        />

        <input
          name="industry"
          required
          placeholder="Industry"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none"
        />

        <input
          name="location"
          placeholder="Location"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none"
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
