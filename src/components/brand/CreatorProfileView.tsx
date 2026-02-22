"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import CreatorContactCTAs from "../creator/CreatorContactCTAs";

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

    // const creator = await CreatorProfile.findOne({
    //     userId: params.id,
    // }).lean();

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
        <div className="max-w-6xl mx-auto py-10 space-y-10">

            <Link href="/brand/creators" className="inline-flex border px-2 py-1 rounded-md border-[#636EE1] text-[#636EE1] hover:bg-[#636EE1] hover:text-white transition-all">
                <ArrowLeft />Back to Creators
            </Link>

            {/* ================= HERO ================= */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#111827] to-black p-2 space-y-8">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 relative">

                    {/* Identity */}
                    <div className="flex items-center gap-8">

                        {creator.profileImage ? (
                            <img
                                src={creator.profileImage}
                                alt={creator.displayName}
                                className="h-58 w-58 rounded-2xl object-cover border border-white/10 shadow-xl"
                            />
                        ) : (
                            <div className="h-28 w-28 rounded-2xl bg-[#636EE1]/20 flex items-center justify-center text-4xl font-semibold">
                                {creator.displayName?.[0]?.toUpperCase()}
                            </div>
                        )}

                        <div className="space-y-2">
                            <h1 className="text-4xl font-semibold tracking-tight">
                                {creator.displayName || creator.username || "Creator"}
                            </h1>

                            <p className="font-semibold text-[#ffffffbc] tracking-tight">
                                {creator.email}
                            </p>

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
                            {/* Bio */}
                            {creator.bio && (
                                <p className="text-sm text-white/70 max-w-3xl">
                                    {creator.bio}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saved}
                        className={`px-6 py-3 rounded-xl absolute right-2 top-2 border text-sm font-medium transition
              ${saved
                                ? "border-green-400 text-green-400"
                                : "border-white/20 hover:border-[#636EE1]"
                            }
            `}
                    >
                        {saved ? "Saved ✓" : "Save Creator"}
                    </button>
                </div>

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

            {/* ================= CONTACT CTAs ================= */}
            <CreatorContactCTAs
                email={creator.email}
                portfolioLink={creator.portfolio[0]?.link}
            />

            {/* ================= PORTFOLIO ================= */}
            <div className="space-y-10">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Portfolio
                </h2>

                {creator.portfolio?.length === 0 ? (
                    <div className="text-sm text-white/50">
                        No projects added yet.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-10">
                        {creator.portfolio.map((p: any) => {

                            // Normalize deliverables (new + legacy support)
                            const normalizedDeliverables = (p.deliverables || []).map((d: any) => {
                                if (typeof d === "string") {
                                    return { title: d };
                                }
                                return d;
                            });

                            return (
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

                                    <div className="p-6 space-y-5">

                                        {/* Title */}
                                        <div>
                                            <div className="text-lg font-semibold group-hover:text-[#636EE1] transition">
                                                {p.title}
                                            </div>

                                            {p.brandName && (
                                                <div className="text-xs text-white/50 mt-1">
                                                    {p.brandName}
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {p.description && (
                                            <p className="text-sm text-white/60 line-clamp-3">
                                                {p.description}
                                            </p>
                                        )}

                                        {/* Deliverables Preview */}
                                        {normalizedDeliverables.length > 0 && (
                                            <div className="space-y-2">

                                                <div className="text-xs uppercase tracking-wide opacity-50">
                                                    Deliverables
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {normalizedDeliverables.slice(0, 2).map((d: any, i: number) => (
                                                        <span
                                                            key={i}
                                                            className="text-[11px] px-3 py-1 rounded-full border border-white/15 bg-black/40"
                                                        >
                                                            {d.title}
                                                        </span>
                                                    ))}

                                                    {normalizedDeliverables.length > 2 && (
                                                        <span className="text-[11px] px-3 py-1 rounded-full border border-white/10 opacity-50">
                                                            +{normalizedDeliverables.length - 2} more
                                                        </span>
                                                    )}
                                                </div>

                                            </div>
                                        )}

                                        {/* Outcome Preview */}
                                        {p.outcome?.summary && (
                                            <div className="text-xs text-[#636EE1] font-medium line-clamp-2">
                                                {p.outcome.summary}
                                            </div>
                                        )}

                                    </div>
                                </Link>
                            );
                        })}
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