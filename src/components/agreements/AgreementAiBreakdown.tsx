"use client";

import { useState } from "react";

export default function AgreementAiBreakdown({
  agreementId,
}: {
  agreementId: string;
}) {

  const [loading, setLoading] =
    useState(false);

  const [summary, setSummary] =
    useState("");

  async function handleGenerate() {

    if (summary) return;

    setLoading(true);

    try {

      const response = await fetch(
        `/agreements/${agreementId}/ai-breakdown`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setSummary(data.summary || "");

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-xl border border-[#636EE1]/20 bg-[#636EE1]/10 px-4 py-2 text-sm text-[#A5AEFF] hover:bg-[#636EE1]/20 transition disabled:opacity-50"
      >
        {loading
          ? "Understanding Agreement..."
          : "✨ Understand Agreement With AI"}
      </button>

      {summary && (
        <div className="rounded-2xl border border-[#636EE1]/20 bg-[#636EE1]/5 p-6 space-y-4">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-[#636EE1]">
              AI Agreement Breakdown
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              Creator Guidance
            </h3>

          </div>

          <div className="rounded-xl border border-white/5 bg-[#0F1016] p-5">

            <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
              {summary}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}