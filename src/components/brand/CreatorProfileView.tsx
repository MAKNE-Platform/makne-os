"use client";

import { useState } from "react";
import Link from "next/link";

type Draft = {
    _id: string;
    title: string;
};

export default function CreatorProfileView({
    creator,
    draftAgreements,
    alreadySaved,
}: {
    creator: any;
    draftAgreements: Draft[];
    alreadySaved: boolean;
}) {
    const [showPanel, setShowPanel] = useState(false);
    const [selectedAgreement, setSelectedAgreement] = useState("");
    const [sending, setSending] = useState(false);
    const [saved, setSaved] = useState(alreadySaved);

    async function handleSave() {
        if (saved) return;

        await fetch("/api/brand/save-creator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ creatorId: creator._id }),
        });

        setSaved(true);
    }

    async function handleSendAgreement() {
        if (!selectedAgreement) return;

        setSending(true);

        const formData = new FormData();
        formData.append("creatorEmail", creator.email);

        try {
            await fetch(`/agreements/${selectedAgreement}/send`, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            });

            alert("Agreement sent successfully!");
            setShowPanel(false);
            setSelectedAgreement("");
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }

        setSending(false);
    }

    return (
        <div className="max-w-6xl mx-auto py-14 space-y-20">

            {/* ================= HERO ================= */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#111827] to-black p-10 space-y-8">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

                    {/* Identity */}
                    <div className="flex items-center gap-8">

                        {creator.profileImage ? (
                            <img
                                src={creator.profileImage}
                                alt={creator.displayName}
                                className="h-28 w-28 rounded-2xl object-cover border border-white/10 shadow-xl"
                            />
                        ) : (
                            <div className="h-28 w-28 rounded-2xl bg-[#636EE1]/20 flex items-center justify-center text-4xl font-semibold">
                                {creator.displayName?.[0]?.toUpperCase()}
                            </div>
                        )}

                        <div className="space-y-2">
                            <h1 className="text-4xl font-semibold tracking-tight">
                                {creator.displayName}
                            </h1>

                            <div className="text-white/60 text-sm">
                                {creator.niche}
                            </div>

                            <div className="text-white/50 text-xs">
                                {creator.platforms}
                            </div>

                            {creator.location && (
                                <div className="text-white/40 text-xs">
                                    {creator.location}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saved}
                        className={`px-6 py-3 rounded-xl border text-sm font-medium transition
              ${saved
                                ? "border-green-400 text-green-400"
                                : "border-white/20 hover:border-[#636EE1]"
                            }
            `}
                    >
                        {saved ? "Saved ✓" : "Save Creator"}
                    </button>
                </div>

                {/* Bio */}
                {creator.bio && (
                    <p className="text-sm text-white/70 max-w-3xl">
                        {creator.bio}
                    </p>
                )}
            </div>

            {/* ================= SKILLS ================= */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Skills & Capabilities</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <SkillGroup title="Content Formats" items={creator.skills?.contentFormats} />
                    <SkillGroup title="Tools & Software" items={creator.skills?.tools} />
                    <SkillGroup title="Languages" items={creator.skills?.languages} />
                    <SkillGroup title="Strengths" items={creator.skills?.strengths} />

                </div>
            </div>

            {/* ================= PORTFOLIO ================= */}
            <div className="space-y-8">
                <h2 className="text-2xl font-semibold">Portfolio</h2>

                {creator.portfolio?.length === 0 ? (
                    <div className="text-sm text-white/50">
                        No projects added yet.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-10">
                        {creator.portfolio.map((p: any) => (
                            <Link
                                key={p._id}
                                href={`/brand/creators/${creator._id}/projects/${p._id}`}
                                className="block rounded-2xl border border-white/10 bg-[#ffffff05] overflow-hidden hover:border-[#636EE1]/40 transition group"
                            >

                                {/* Thumbnail */}
                                <div className="aspect-[16/9] bg-black/30 overflow-hidden">
                                    {p.thumbnail ? (
                                        <img
                                            src={p.thumbnail}
                                            alt={p.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-xs opacity-40">
                                            No thumbnail
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 space-y-4">

                                    <div>
                                        <div className="text-lg font-semibold">
                                            {p.title}
                                        </div>

                                        {p.brandName && (
                                            <div className="text-xs text-white/50">
                                                {p.brandName}
                                            </div>
                                        )}
                                    </div>

                                    {p.description && (
                                        <p className="text-sm text-white/60 line-clamp-3">
                                            {p.description}
                                        </p>
                                    )}

                                    {p.deliverables?.length > 0 && (
                                        <div className="space-y-1">
                                            <div className="text-xs opacity-60">Deliverables:</div>
                                            <ul className="text-xs text-white/70 list-disc list-inside space-y-1">
                                                {p.deliverables.map((d: string, i: number) => (
                                                    <li key={i}>{d}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {p.outcome?.summary && (
                                        <div className="text-xs text-[#636EE1] font-medium">
                                            {p.outcome.summary}
                                        </div>
                                    )}

                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= SEND AGREEMENT ================= */}
            <div className="border-t border-white/10 pt-16 space-y-10">

                <div className="flex justify-center">
                    <button
                        onClick={() => setShowPanel((prev) => !prev)}
                        className="px-8 py-3 rounded-xl bg-[#636EE1] text-black font-medium hover:opacity-90 transition"
                    >
                        Send Agreement
                    </button>
                </div>

                {showPanel && (
                    <div className="max-w-md mx-auto bg-[#ffffff05] border border-white/10 rounded-2xl p-8 space-y-6">

                        {draftAgreements.length === 0 ? (
                            <div className="text-sm text-white/60 text-center">
                                No draft agreements available.
                            </div>
                        ) : (
                            <>
                                <select
                                    value={selectedAgreement}
                                    onChange={(e) => setSelectedAgreement(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm"
                                >
                                    <option value="">Choose agreement</option>
                                    {draftAgreements.map((d) => (
                                        <option key={d._id} value={d._id}>
                                            {d.title}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleSendAgreement}
                                    disabled={!selectedAgreement || sending}
                                    className="w-full rounded-lg px-4 py-2 text-sm font-medium bg-[#636EE1] text-black disabled:opacity-40"
                                >
                                    {sending ? "Sending..." : "Confirm & Send"}
                                </button>
                            </>
                        )}

                    </div>
                )}
            </div>

        </div>
    );
}

/* ================= SUB COMPONENTS ================= */

function SkillGroup({ title, items }: { title: string; items?: string[] }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="rounded-2xl border border-white/10 bg-[#ffffff05] p-5 space-y-3">
            <div className="text-sm font-medium opacity-70">{title}</div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <span
                        key={i}
                        className="px-3 py-1 rounded-full border border-white/15 text-xs"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}