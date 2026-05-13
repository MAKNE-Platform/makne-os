"use client";

import { useState } from "react";

type Props = {
    onGenerate: (data: {
        description: string;
    }) => void;
};

export default function AIGenerateButton({
    onGenerate,
}: Props) {
    const [loading, setLoading] = useState(false);

    async function handleGenerate() {
        try {
            setLoading(true);

            const title =
                (
                    document.querySelector(
                        'input[name="title"]'
                    ) as HTMLInputElement
                )?.value || "";

            const response = await fetch(
                "/api/ai/generate-agreement",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                    }),
                }
            );

            const data = await response.json();

            const generatedDescription = data.summary;

            onGenerate({
                description: generatedDescription,
            });
        } catch (error) {
            console.error(error);
            alert("Failed to generate agreement");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-2xl border border-[#636EE1]/30 bg-[#636EE1]/10 px-4 py-2 text-sm font-medium text-[#A5AEFF] transition hover:bg-[#636EE1]/20"
        >
            {loading
                ? "Generating..."
                : "✨ Generate with AI"}
        </button>
    );
}