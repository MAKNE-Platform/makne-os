"use client";

import { useState } from "react";
import { MessageCircleWarning } from "lucide-react";

type Props = {
  milestoneId: string;

  milestoneTitle: string;

  aiExpectationSummary?: string;

  submissionNote?: string;

  reviewSummary?: string;

  concerns?: string[];
};

export default function RequestRevisionForm({
  milestoneId,
  milestoneTitle,
  aiExpectationSummary,
  submissionNote,
  reviewSummary,
  concerns,
}: Props) {
  const [open, setOpen] = useState(false);

  const [feedback, setFeedback] =
    useState("");

  const [generating, setGenerating] =
    useState(false);

  async function generateFeedback() {
    try {
      setGenerating(true);

      const response = await fetch(
        "/api/ai/generate-revision-feedback",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            milestoneTitle,
            aiExpectationSummary,
            submissionNote,
            reviewSummary,
            concerns,
          }),
        }
      );

      const data = await response.json();

      if (data.feedback) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Failed to generate feedback"
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="w-full">

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-white/10 bg-[#161618] px-4 py-2 text-sm text-white transition hover:border-white/20 hover:bg-[#1E1E22]"
        >
          Request Revision
        </button>
      ) : (
        <form
          action={`/milestones/${milestoneId}/request-changes`}
          method="POST"
          className="space-y-5 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-[#14161F] to-[#101117] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        >

          {/* Header */}
          <div className="flex items-start gap-3">

            <div className="mt-0.5 rounded-lg bg-yellow-500/10 p-2 text-yellow-300">
              <MessageCircleWarning size={16} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-white">
                Request Revision
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Explain clearly what should be improved
                before the creator resubmits this milestone.
              </p>
            </div>

          </div>

          <div className="flex justify-end">

            <button
              type="button"
              onClick={generateFeedback}
              disabled={generating}
              className="rounded-xl border border-[#636EE1]/20 bg-[#636EE1]/10 px-4 py-2 text-xs text-[#A5AEFF] transition hover:bg-[#636EE1]/20"
            >
              {generating
                ? "Generating..."
                : "✨ Generate with AI"}
            </button>

          </div>

          {/* Textarea */}
          <textarea
            name="revisionFeedback"
            required
            value={feedback}
            onChange={(e) =>
              setFeedback(e.target.value)
            }
            placeholder="e.g. Please improve product visibility in the opening scene and include the final caption assets before resubmission."
            className="min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-[#0F1322] px-4 py-4 text-sm leading-relaxed text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
          />

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#636EE1] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.99] sm:w-auto"
            >
              Send Revision Request
            </button>

          </div>

        </form>
      )}

    </div>
  );
}