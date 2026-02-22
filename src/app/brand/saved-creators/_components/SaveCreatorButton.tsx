"use client";

import { useState } from "react";

export default function SaveCreatorButton({
  creatorId,
  initiallySaved,
}: {
  creatorId: string;
  initiallySaved: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;

    setLoading(true);

    try {
      if (saved) {
        await fetch("/api/brand/unsave-creator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creatorId }),
        });

        setSaved(false);
      } else {
        await fetch("/api/brand/save-creator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creatorId }),
        });

        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition
        ${
          saved
            ? "border border-green-400/40 bg-green-500/10 text-green-400"
            : "border border-white/20 hover:border-[#636EE1] hover:bg-[#636EE1]/10"
        }
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {saved ? "Saved ✓" : "Save"}
    </button>
  );
}