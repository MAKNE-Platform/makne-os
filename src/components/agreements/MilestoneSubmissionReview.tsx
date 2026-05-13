"use client";

import { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type Props = {
  milestone: any;
};

export default function MilestoneSubmissionReview({
  milestone,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [review, setReview] = useState<{
    summary: string;
    completionStatus: string;
    strengths: string[];
    concerns: string[];
    revisionSuggestion: string;
  } | null>(null);

  async function handleReview() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/ai/review-submission",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            milestoneTitle: milestone.title,
            aiExpectationSummary:
              milestone.aiExpectationSummary,
            submissionNote:
              milestone.submission?.note,
            submissionLinks:
              milestone.submission?.links?.join(
                ", "
              ),
          }),
        }
      );

      const data = await response.json();

      setReview(data);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to generate AI review"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#636EE1]/20 bg-[#636EE1]/5 p-5 space-y-5">

      <div className="flex items-start justify-between gap-4">

        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white">
            <Sparkles size={16} />
            AI Submission Review
          </h3>

          <p className="mt-1 text-xs text-zinc-400">
            Analyze creator submission
            quality and milestone alignment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReview}
          disabled={loading}
          className="rounded-lg border border-[#636EE1]/20 bg-[#636EE1]/10 px-4 py-2 text-xs text-[#A5AEFF] transition hover:bg-[#636EE1]/20"
        >
          {loading
            ? "Reviewing..."
            : "Generate Review"}
        </button>

      </div>

      {review && (
        <div className="space-y-5">

          <div className="flex items-center gap-2">

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium
              ${
                review.completionStatus ===
                "STRONG"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : review.completionStatus ===
                    "PARTIAL"
                  ? "bg-yellow-500/15 text-yellow-300"
                  : "bg-red-500/15 text-red-300"
              }
            `}
            >
              {review.completionStatus}
            </span>

          </div>

          <div>
            <h4 className="text-sm font-medium text-white">
              Summary
            </h4>

            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {review.summary}
            </p>
          </div>

          {review.strengths?.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                <CheckCircle2 size={15} />
                Strengths
              </h4>

              <ul className="mt-2 space-y-2">
                {review.strengths.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="text-sm text-zinc-300"
                    >
                      • {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {review.concerns?.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-yellow-300">
                <AlertTriangle size={15} />
                Concerns
              </h4>

              <ul className="mt-2 space-y-2">
                {review.concerns.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="text-sm text-zinc-300"
                    >
                      • {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {review.revisionSuggestion && (
            <div className="rounded-lg border border-white/10 bg-[#0F1016] p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Suggested Revision Request
              </p>

              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {review.revisionSuggestion}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}