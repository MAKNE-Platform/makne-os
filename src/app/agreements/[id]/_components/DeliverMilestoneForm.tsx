"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeliverMilestoneForm({
  milestoneId,
}: {
  milestoneId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    await fetch(`/milestones/${milestoneId}/deliver`, {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    router.refresh(); // 🔥 THIS FIXES EVERYTHING
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="mt-4 space-y-3"
    >
      <textarea
        name="note"
        placeholder="Delivery note (optional)"
        className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
      />

      <input
        type="file"
        name="files"
        multiple
        className="w-full text-sm text-zinc-400"
      />

      <input
        type="text"
        name="links"
        placeholder="External links (comma separated)"
        className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
      />

      <button
        disabled={loading}
        className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Work"}
      </button>
    </form>
  );
}
