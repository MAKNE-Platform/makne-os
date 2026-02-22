"use client";

import { onboardBrandAction } from "./actions";
import { useState } from "react";

export default function BrandOnboardingPage() {
  const [loading, setLoading] = useState(false);

  return (
       <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="relative w-full max-w-lg">

        {/* Subtle ambient glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px]
                    bg-[#636EE1]/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 rounded-3xl border border-white/10 
                    bg-white/5 backdrop-blur-xl 
                    p-6 sm:p-8 space-y-8">
        <form
          action={async (formData) => {
            setLoading(true);
            await onboardBrandAction(formData);
            setLoading(false);
          }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-white">
              Brand details
            </h1>
            <p className="text-sm text-zinc-400">
              Tell us about your brand so we can structure collaborations properly.
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">

            <input
              name="brandName"
              required
              placeholder="Brand name"
              className="w-full rounded-xl bg-white/5 border border-white/10
                         px-4 py-3 text-sm text-white placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-[#636EE1]
                         focus:border-transparent transition"
            />

            <input
              name="industry"
              required
              placeholder="Industry"
              className="w-full rounded-xl bg-white/5 border border-white/10
                         px-4 py-3 text-sm text-white placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-[#636EE1]
                         focus:border-transparent transition"
            />

            <input
              name="location"
              placeholder="Location"
              className="w-full rounded-xl bg-white/5 border border-white/10
                         px-4 py-3 text-sm text-white placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-[#636EE1]
                         focus:border-transparent transition"
            />

          </div>

          {/* CTA */}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-[#636EE1] py-3 text-sm font-medium text-white
                       hover:bg-[#7A84FF] transition
                       shadow-lg shadow-[#636EE1]/30
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Continue"}
          </button>

        </form>
      </div>
      </div>
    </div>
  );
}