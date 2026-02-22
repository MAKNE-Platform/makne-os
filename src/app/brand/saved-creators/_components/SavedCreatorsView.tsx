"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SavedCreatorsView({
  creators,
}: {
  creators: any[];
}) {
  const [list, setList] = useState(creators);

  async function handleUnsave(creatorId: string) {
    await fetch("/api/brand/unsave-creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorId }),
    });

    setList((prev) =>
      prev.filter((c) => c._id !== creatorId)
    );
  }

  if (list.length === 0) {
    return (
      <div className="p-10 text-center text-white/60">
        No saved creators yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-12">

    <Link href="/brand/creators" className="inline-flex gap-1 border p-2 border-[#636EE1] rounded-md text-[#636EE1] hover:bg-[#636EE1] hover:text-white transition-all mb-10">
      <ArrowLeft /> Back
    </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((creator) => (
          <div
            key={creator._id}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 space-y-4 hover:border-[#636EE1]/40 transition"
          >
            {creator.profileImage ? (
              <img
                src={creator.profileImage}
                className="h-68 w-full object-cover rounded-2xl"
              />
            ) : (
              <div className="h-48 flex items-center justify-center bg-[#636EE1]/20 rounded-2xl text-3xl font-semibold">
                {creator.displayName?.[0]}
              </div>
            )}

            <div className="px-2">
              <h3 className="text-lg font-semibold text-white">
                {creator.displayName}
              </h3>
              <p className="text-sm text-white/60">
                {creator.niche}
              </p>
              <p className="text-xs text-white/40">
                {creator.platforms}
              </p>
            </div>

            <div className="flex justify-between items-center p-2">
              <Link
                href={`/brand/creators/${creator._id}`}
                className="text-sm text-[#636EE1] border border-[#636EE1] p-1 px-2 rounded-full hover:text-white transition-all hover:bg-[#636EE1]"
              >
                View Profile
              </Link>

              <button
                onClick={() => handleUnsave(creator._id)}
                className="text-xs border border-red-400/60 p-1 px-2 rounded-full hover:text-white transition-all hover:bg-red-400/60 text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}