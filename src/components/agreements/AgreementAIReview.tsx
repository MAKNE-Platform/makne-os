"use client";

import { useState } from "react";
import { Sparkles, AlertTriangle } from "lucide-react";

type Props = {
  agreement: any;
  milestones: any[];
};

export default function AgreementAIReview({
  agreement,
  milestones,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [review, setReview] = useState<{
    summary: string;
    risks: string[];
    suggestions: string[];
  } | null>(null);

  async function handleReview() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/ai/review-agreement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: agreement.title,
            description:
              agreement.description,
            deliverables:
              agreement.deliverables
                ?.map((d: any) => d.title)
                .join(", "),
            policies: JSON.stringify(
              agreement.policies
            ),
            milestones: milestones
              .map(
                (m) =>
                  `${m.title} - ₹${m.amount}`
              )
              .join(", "),
          }),
        }
      );

      const data = await response.json();

      setReview(data);
    } catch (error) {
      console.error(error);

      alert("Failed to generate review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#636EE1]/20 bg-[#636EE1]/5 p-6 backdrop-blur-xl">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-medium text-white">
            <Sparkles size={16} />
            AI Agreement Review
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Analyze agreement quality,
            risks, and improvement areas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReview}
          disabled={loading}
          className="rounded-xl border border-[#636EE1]/30 bg-[#636EE1]/10 px-4 py-2 text-sm text-[#A5AEFF] transition hover:bg-[#636EE1]/20"
        >
          {loading
            ? "Reviewing..."
            : "Generate Review"}
        </button>
      </div>

      {review && (
        <div className="mt-6 space-y-6">

          <div>
            <h3 className="text-sm font-medium text-white">
              Summary
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {review.summary}
            </p>
          </div>

          {review.risks?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-red-300">
                <AlertTriangle size={15} />
                Risks
              </h3>

              <ul className="mt-2 space-y-2">
                {review.risks.map(
                  (risk, index) => (
                    <li
                      key={index}
                      className="text-sm text-zinc-300"
                    >
                      • {risk}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {review.suggestions?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#A5AEFF]">
                Suggestions
              </h3>

              <ul className="mt-2 space-y-2">
                {review.suggestions.map(
                  (
                    suggestion,
                    index
                  ) => (
                    <li
                      key={index}
                      className="text-sm text-zinc-300"
                    >
                      • {suggestion}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

        </div>
      )}
    </section>
  );
}