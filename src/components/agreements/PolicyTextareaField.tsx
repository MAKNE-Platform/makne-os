"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type Props = {
  name: string;
  label: string;
  placeholder: string;
};

export default function PolicyTextareaField({
  name,
  label,
  placeholder,
}: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);

      const agreementTitle =
        (
          document.querySelector(
            'input[name="title"]'
          ) as HTMLInputElement
        )?.value || "";

      const agreementDescription =
        (
          document.querySelector(
            'textarea[name="description"]'
          ) as HTMLTextAreaElement
        )?.value || "";

      const deliverableTitles = Array.from(
        document.querySelectorAll(
          'input[name="deliverable_title"]'
        )
      )
        .map(
          (el) =>
            (el as HTMLInputElement).value
        )
        .filter(Boolean)
        .join(", ");

      const response = await fetch(
        "/api/ai/generate-policy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            policyType: label,
            agreementTitle,
            agreementDescription,
            deliverables: deliverableTitles,
          }),
        }
      );

      const data = await response.json();

      setValue(data.content);
    } catch (error) {
      console.error(error);

      alert("Failed to generate policy");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);

            e.target.style.height = "auto";
            e.target.style.height =
              `${e.target.scrollHeight}px`;
          }}
          
          placeholder={placeholder}
          className="min-h-35 w-full rounded-2xl border border-white/10 bg-[#0f1322] px-4 py-4 pr-14 text-sm leading-normal text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
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
    </div>
  );
}