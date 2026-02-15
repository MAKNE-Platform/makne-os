"use client";

import { useState } from "react";
import { upsertPortfolioItem } from "@/app/creator/portfolio/actions";

type Props = {
  onClose: () => void;
  initial?: {
    id?: string;
    title: string;
    description?: string;
    link?: string;
    image?: string;
  };
};

export default function PortfolioModal({ onClose, initial }: Props) {
  const [form, setForm] = useState(
    initial ?? { title: "", description: "", link: "", image: "" }
  );
  const [loading, setLoading] = useState(false);

  async function onSave() {
    setLoading(true);
    await upsertPortfolioItem({ ...form, id: initial?.id });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e1117] p-6 space-y-4">

        <h2 className="text-lg font-medium">
          {initial ? "Edit portfolio item" : "Add portfolio item"}
        </h2>

        <input
          className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 text-sm"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 text-sm"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 text-sm"
          placeholder="External link"
          value={form.link}
          onChange={e => setForm({ ...form, link: e.target.value })}
        />

        <input
          className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 text-sm"
          placeholder="Image URL"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="text-sm opacity-70">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading || !form.title}
            className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
