"use client";

import { useState } from "react";

export default function FeedbackInterpreter({
    feedback,
    milestoneTitle,
    aiExpectationSummary,
    submissionNote
}: {
    feedback: string;

    milestoneTitle?: string;

    aiExpectationSummary?: string;

    submissionNote?: string;
}) {
    const [loading, setLoading] =
        useState(false);

    const [result, setResult] =
        useState("");

    async function interpretFeedback() {
        try {
            setLoading(true);

            const response = await fetch(
                "/api/ai/interpret-feedback",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        feedback,
                        milestoneTitle,
                        aiExpectationSummary,
                        submissionNote,
                    }),
                }
            );

            const data = await response.json();

            if (data.result) {
                setResult(data.result);
            }
        } catch (error) {
            console.error(error);

            alert(
                "Failed to interpret feedback"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4 mt-2">

            <button
                type="button"
                onClick={interpretFeedback}
                disabled={loading}
                className="rounded-xl border border-[#636EE1]/20 bg-[#636EE1]/10 px-4 py-2 text-xs text-[#A5AEFF] transition hover:bg-[#636EE1]/20"
            >
                {loading
                    ? "Analyzing..."
                    : "✨ Help Me Understand This Feedback"}
            </button>

            {result && (
                <div className="rounded-xl border border-white/5 bg-[#0F1016] p-4">

                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                        AI Breakdown
                    </p>

                    <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                        {result}
                    </div>

                </div>
            )}

        </div>
    );
}