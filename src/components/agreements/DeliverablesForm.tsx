"use client";

import { useState } from "react";

export default function DeliverablesForm() {
  const [loading, setLoading] = useState(false);

  const [deliverables, setDeliverables] = useState([
    {
      title: "",
      description: "",
    },
    {
      title: "",
      description: "",
    },
    {
      title: "",
      description: "",
    },
  ]);

  async function handleGenerate() {
    try {
      setLoading(true);

      const agreementTitle =
        localStorage.getItem("agreementTitle") || "";

      const response = await fetch(
        "/api/ai/generate-deliverables",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: agreementTitle,
          }),
        }
      );

      const data = await response.json();

      const updated = [...deliverables];

      data.deliverables.forEach(
        (
          item: {
            title: string;
            description: string;
          },
          index: number
        ) => {
          if (updated[index]) {
            updated[index] = item;
          }
        }
      );

      setDeliverables(updated);
    } catch (error) {
      console.error(error);
      alert("Failed to generate deliverables");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-2xl border border-[#636EE1]/30 bg-[#636EE1]/10 px-4 py-2 text-sm font-medium text-[#A5AEFF] transition hover:bg-[#636EE1]/20"
        >
          {loading
            ? "Generating..."
            : "✨ Generate Deliverables"}
        </button>
      </div>

      {deliverables.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-[#121420] p-6 space-y-4"
        >
          <input
            name="deliverable_title"
            value={item.title}
            onChange={(e) => {
              const updated = [...deliverables];
              updated[index].title = e.target.value;
              setDeliverables(updated);
            }}
            placeholder="e.g. Instagram Reel"
            className="w-full rounded-2xl border border-white/10 bg-[#0f1322] px-4 py-3 text-sm text-white outline-none"
          />

          <textarea
            name="deliverable_description"
            value={item.description}
            onChange={(e) => {
              const updated = [...deliverables];
              updated[index].description =
                e.target.value;

              setDeliverables(updated);
            }}
            rows={3}
            placeholder="Description"
            className="w-full resize-none rounded-2xl border border-white/10 bg-[#0f1322] px-4 py-3 text-sm text-white outline-none"
          />
        </div>
      ))}
    </div>
  );
}