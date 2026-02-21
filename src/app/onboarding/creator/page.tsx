"use client";

import { onboardCreatorAction } from "./actions";
import { useState } from "react";

export default function CreatorOnboardingPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-md">
      <form
        action={async (formData) => {
          setLoading(true);
          await onboardCreatorAction(formData);
          setLoading(false);
        }}
        className="space-y-4"
      >
        <h1 className="text-2xl font-medium text-white">
          Tell us about yourself
        </h1>

        <input
          name="displayName"
          required
          placeholder="Your display name (e.g. Vaidika Kaul)"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none"
        />

        <input
          name="niche"
          required
          placeholder="Your niche (e.g. Tech, Fitness)"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none"
        />

        <input
          name="platforms"
          required
          placeholder="Platforms (YouTube, Instagram)"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-sm text-white outline-none"
        />

        <input
          name="portfolio"
          placeholder="Portfolio link (optional)"
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
