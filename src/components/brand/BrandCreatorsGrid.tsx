"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function BrandCreatorsGrid({
    creators,
}: {
    creators: any[];
}) {
    const [search, setSearch] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [nicheFilter, setNicheFilter] = useState("All");

    const niches = Array.from(
        new Set(creators.map((c) => c.niche))
    );

    const platforms = Array.from(
        new Set(
            creators.flatMap((c) =>
                (c.platforms || "")
                    .split(",")
                    .map((p: string) => p.trim())
                    .filter(Boolean)
            )
        )
    );

    const filteredCreators = useMemo(() => {
        return creators.filter((creator) => {
            const username = creator.username || "";
            const niche = creator.niche || "";
            const platforms = creator.platforms || "";

            const matchesSearch =
                username.toLowerCase().includes(search.toLowerCase()) ||
                niche.toLowerCase().includes(search.toLowerCase());

            const matchesPlatform =
                platformFilter === "All" ||
                platforms.includes(platformFilter);

            const matchesNiche =
                nicheFilter === "All" ||
                niche === nicheFilter;

            return matchesSearch && matchesPlatform && matchesNiche;
        });
    }, [search, platformFilter, nicheFilter, creators]);

    return (
        <div className="space-y-10">

            {/* ================= FILTER BAR ================= */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">

                <input
                    type="text"
                    placeholder="Search creators..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
            w-full lg:w-80
            bg-black border border-white/10
            rounded-xl px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-[#636EE1]
          "
                />

                <div className="flex gap-3 flex-wrap">

                    {/* Platform Filter */}
                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="
              bg-black border border-white/10
              rounded-xl px-4 py-2 text-sm
            "
                    >
                        <option value="All">All Platforms</option>
                        {platforms.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>

                    {/* Niche Filter */}
                    <select
                        value={nicheFilter}
                        onChange={(e) => setNicheFilter(e.target.value)}
                        className="
              bg-black border border-white/10
              rounded-xl px-4 py-2 text-sm
            "
                    >
                        <option value="All">All Niches</option>
                        {niches.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            {/* ================= GRID ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                {filteredCreators.length === 0 && (
                    <div className="text-sm text-white/50">
                        No creators match your filters.
                    </div>
                )}

                {filteredCreators.map((creator) => (
                    <div
                        key={creator._id}
                        className="
              group
              rounded-3xl
              bg-[#ffffff08]
              border border-white/10
              p-2
              shadow-[0_10px_30px_rgba(0,0,0,0.4)]
              hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]
              transition-all duration-300
            "
                    >

                        {/* Image */}
                        <div className="relative rounded-2xl overflow-hidden">
                            {creator.profileImage ? (
                                <img
                                    src={creator.profileImage}
                                    alt={creator.username}
                                    className="
                    w-full h-56 object-cover
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                                />
                            ) : (
                                <div className="
                  w-full h-56
                  bg-gradient-to-br from-[#636EE1]/30 to-black
                  flex items-center justify-center
                  text-4xl font-semibold
                ">
                                    {creator.username?.[0]?.toUpperCase()}
                                </div>
                            )}

                            <div className="
                absolute top-3 left-3
                text-xs
                bg-black/70 backdrop-blur-md
                px-3 py-1 rounded-full
                border border-white/10
              ">
                                {creator.niche}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-5 space-y-3">
                            <div>
                                <div className="text-lg font-semibold">
                                    {creator.username}
                                </div>
                                <div className="text-sm text-white/50">
                                    {creator.platforms}
                                </div>
                            </div>

                            <p className="text-sm text-white/60 line-clamp-2">
                                {creator.bio || "No bio provided."}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-xs bg-white/10 px-3 py-1 rounded-full">
                                {creator.portfolioCount} Projects
                            </div>

                            <Link
                                href={`/brand/creators/${creator._id}`}
                                className="
                  text-sm
                  bg-[#636EE1]
                  text-black
                  px-4 py-2
                  rounded-full
                  font-medium
                  hover:opacity-90
                  transition
                "
                            >
                                View →
                            </Link>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}