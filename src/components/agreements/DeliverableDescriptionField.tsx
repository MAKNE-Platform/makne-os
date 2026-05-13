"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type Props = {
    deliverableIndex: number;
};

export default function DeliverableDescriptionField({
    deliverableIndex,
}: Props) {
    const [description, setDescription] =
        useState("");

    const [loading, setLoading] = useState(false);

    async function handleGenerate() {
        try {
            setLoading(true);

            const deliverableTitleInputs =
                document.querySelectorAll(
                    'input[name="deliverable_title"]'
                );

            const agreementTitleInput =
                document.querySelector(
                    'input[name="title"]'
                ) as HTMLInputElement;

            const agreementDescriptionInput =
                document.querySelector(
                    'textarea[name="description"]'
                ) as HTMLTextAreaElement;

            const deliverableTitle =
                (
                    deliverableTitleInputs[
                    deliverableIndex
                    ] as HTMLInputElement
                )?.value || "";

            const agreementTitle =
                agreementTitleInput?.value || "";

            const agreementDescription =
                agreementDescriptionInput?.value || "";

            if (!deliverableTitle) {
                alert("Please enter deliverable title");
                return;
            }

            const response = await fetch(
                "/api/ai/generate-deliverable-description",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        agreementTitle,
                        agreementDescription,
                        deliverableTitle,
                    }),
                }
            );

            const data = await response.json();

            setDescription(data.description);
        } catch (error) {
            console.error(error);

            alert(
                "Failed to generate description"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative">
            <textarea
                name="deliverable_description"
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value);

                    e.target.style.height = "auto";
                    e.target.style.height =
                        `${e.target.scrollHeight}px`;
                }}
                placeholder="Description (optional)"
                rows={3}
                className="min-h-[120px] w-full resize-none overflow-hidden rounded-2xl border border-white/10 bg-[#0f1322] px-4 py-3 pr-14 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
            />

            <div className="group absolute right-4 top-4">
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="text-zinc-500 transition hover:text-[#A5AEFF]"
                >
                    <Sparkles size={16} />
                </button>

                <div className="pointer-events-none absolute right-0 top-7 whitespace-nowrap rounded-lg border border-white/10 bg-[#121420] px-3 py-1 text-xs text-zinc-300 opacity-0 shadow-xl transition group-hover:opacity-100">
                    {loading
                        ? "Generating..."
                        : "Generate with AI"}
                </div>
            </div>
        </div>
    );
}