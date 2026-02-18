"use client";

import { useState } from "react";
import { PortfolioItem } from "@/types/portfolio";

type Props = {
  initialPortfolio: PortfolioItem[];
};

export default function ManagePortfolioClient({ initialPortfolio }: Props) {
  const [items, setItems] = useState<PortfolioItem[]>(initialPortfolio);
  const [saving, setSaving] = useState(false);

  const [deliverablesInputs, setDeliverablesInputs] = useState(
    initialPortfolio.map(p => (p.deliverables ?? []).join(", "))
  );


  async function savePortfolio() {
    setSaving(true);

    await fetch("/api/creator/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portfolio: items }),
    });

    setSaving(false);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium">Manage Projects</h1>
        <p className="text-sm opacity-70 mt-1">
          Add and manage your projects
        </p>
      </div>

      {/* Add project */}
      <button
        className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-black hover:bg-[#636EE1]/90"
        onClick={() =>
          setItems([
            ...items,
            {
              title: "",
              brandName: "",
              description: "",
              duration: {},
              deliverables: [],
              links: [],
              media: [],
              outcome: {},
              meta: {
                draft: true,
                featured: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              link: undefined,
              _id: undefined
            },
          ])
        }
      >
        + Add project
      </button>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#ffffff03] p-8 text-center text-sm opacity-70">
          No projects yet. Add your first one.
        </div>
      )}

      {/* Project editor */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-[#ffffff05] p-5 space-y-4"
          >
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.meta?.featured ?? false}
                onChange={(e) => {
                  const copy = [...items];
                  copy[index].meta = {
                    ...copy[index].meta,
                    featured: e.target.checked,
                    updatedAt: new Date().toISOString(),
                  };
                  setItems(copy);
                }}
              />
              Mark as Featured
            </label>

            {/* Title */}
            <input
              placeholder="Project title"
              value={item.title}
              onChange={(e) => {
                const copy = [...items];
                copy[index].title = e.target.value;
                setItems(copy);
              }}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
            />

            {/* Brand */}
            <input
              placeholder="Brand name"
              value={item.brandName}
              onChange={(e) => {
                const copy = [...items];
                copy[index].brandName = e.target.value;
                setItems(copy);
              }}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
            />

            {/* Thumbnail */}
            <input
              placeholder="Thumbnail image URL"
              value={item.thumbnail ?? ""}
              onChange={(e) => {
                const copy = [...items];
                copy[index].thumbnail = e.target.value;
                setItems(copy);
              }}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
            />

            {/* Duration */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={item.duration?.start ?? ""}
                onChange={(e) => {
                  const copy = [...items];
                  copy[index].duration = {
                    ...copy[index].duration,
                    start: e.target.value,
                  };
                  setItems(copy);
                }}
                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
              />

              <input
                type="date"
                value={item.duration?.end ?? ""}
                onChange={(e) => {
                  const copy = [...items];
                  copy[index].duration = {
                    ...copy[index].duration,
                    end: e.target.value,
                  };
                  setItems(copy);
                }}
                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Description */}
            <textarea
              placeholder="Short project description"
              value={item.description ?? ""}
              onChange={(e) => {
                const copy = [...items];
                copy[index].description = e.target.value;
                setItems(copy);
              }}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
            />

            {/* Deliverables */}
            <input
              placeholder="Deliverables (comma separated)"
              value={deliverablesInputs[index] ?? ""}
              onChange={(e) => {
                const newInputs = [...deliverablesInputs];
                newInputs[index] = e.target.value;
                setDeliverablesInputs(newInputs);
              }}
              onBlur={() => {
                const copy = [...items];
                copy[index].deliverables =
                  (deliverablesInputs[index] ?? "")
                    .split(",")
                    .map((d) => d.trim())
                    .filter(Boolean);

                setItems(copy);
              }}

              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
            />

            {/* Outcome summary */}
            <input
              placeholder="Outcome (e.g. +120% engagement)"
              value={item.outcome?.summary ?? ""}
              onChange={(e) => {
                const copy = [...items];
                copy[index].outcome = {
                  ...copy[index].outcome,
                  summary: e.target.value,
                };
                setItems(copy);
              }}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
            />

            {/* Outcome metrics */}
            {(item.outcome?.metrics ?? []).map((m, mIndex) => (
              <div key={mIndex} className="flex gap-2 items-center">
                <input
                  placeholder="Metric"
                  value={m.label}
                  onChange={(e) => {
                    const copy = [...items];
                    const metrics = copy[index].outcome?.metrics ?? [];
                    metrics[mIndex] = { ...metrics[mIndex], label: e.target.value };
                    copy[index].outcome = { ...copy[index].outcome, metrics };
                    setItems(copy);
                  }}
                  className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
                />

                <input
                  placeholder="Value"
                  value={m.value}
                  onChange={(e) => {
                    const copy = [...items];
                    const metrics = copy[index].outcome?.metrics ?? [];
                    metrics[mIndex] = { ...metrics[mIndex], value: e.target.value };
                    copy[index].outcome = { ...copy[index].outcome, metrics };
                    setItems(copy);
                  }}
                  className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
                />

                <button
                  onClick={() => {
                    const copy = [...items];
                    copy[index].outcome!.metrics = copy[index].outcome!.metrics!.filter(
                      (_, i) => i !== mIndex
                    );
                    setItems(copy);
                  }}
                  className="text-xs text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={() => {
                const copy = [...items];
                copy[index].outcome = {
                  ...copy[index].outcome,
                  metrics: [
                    ...(copy[index].outcome?.metrics ?? []),
                    { label: "", value: "" },
                  ],
                };
                setItems(copy);
              }}
              className="text-xs text-[#636EE1]"
            >
              + Add metric
            </button>

            {/* Media */}
            {(item.media ?? []).map((m, mIndex) => (
              <div key={mIndex} className="flex gap-2 items-center">
                <select
                  value={m.type}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[index].media![mIndex].type =
                      e.target.value as "image" | "video";
                    setItems(copy);
                  }}
                  className="bg-black border border-white/10 rounded-lg px-2 py-2 text-sm"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>

                <input
                  placeholder="Media URL"
                  value={m.url}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[index].media![mIndex].url = e.target.value;
                    setItems(copy);
                  }}
                  className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
                />

                <button
                  onClick={() => {
                    const copy = [...items];
                    copy[index].media = copy[index].media!.filter(
                      (_, i) => i !== mIndex
                    );
                    setItems(copy);
                  }}
                  className="text-xs text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Upload from system */}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = URL.createObjectURL(file);

                const copy = [...items];
                copy[index].media = [
                  ...(copy[index].media ?? []),
                  {
                    type: file.type.startsWith("video") ? "video" : "image",
                    url,
                  },
                ];
                setItems(copy);
              }}
              className="text-xs opacity-70"
            />

            <button
              onClick={() => {
                const copy = [...items];
                copy[index].media = [
                  ...(copy[index].media ?? []),
                  { type: "image", url: "" },
                ];
                setItems(copy);
              }}
              className="text-xs text-[#636EE1]"
            >
              + Add media via URL
            </button>

            {/* Draft toggle */}
            <label className="flex items-center gap-2 text-sm opacity-80">
              <input
                type="checkbox"
                checked={item.meta?.draft ?? true}
                onChange={(e) => {
                  const copy = [...items];
                  copy[index].meta = {
                    ...copy[index].meta,
                    draft: e.target.checked,
                    updatedAt: new Date().toISOString(),
                  };
                  setItems(copy);
                }}
              />
              Draft (not visible to brands)
            </label>

            {/* Remove project */}
            <button
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="text-xs text-red-400"
            >
              Remove project
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={savePortfolio}
        disabled={saving}
        className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-black hover:bg-[#636EE1]/90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
