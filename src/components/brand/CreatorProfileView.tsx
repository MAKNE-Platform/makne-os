"use client";

import { useState } from "react";

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
            body: JSON.stringify({
                creatorId: creator._id,
            }),
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
                headers: {
                    Accept: "application/json",
                },
            });

            // DO NOT check res.ok
            // Because redirect causes non-ok status in fetch

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
        <div className="max-w-5xl mx-auto py-10 space-y-16">

            {/* ================= HERO ================= */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#1a1a1a] to-black p-8">

                <div className="text-3xl font-semibold">
                    {creator.username}
                </div>

                <div className="text-white/60 mt-2">
                    {creator.niche} • {creator.platforms}
                </div>

                {creator.location && (
                    <div className="text-white/40 text-sm mt-1">
                        {creator.location}
                    </div>
                )}

                <div className="mt-4 text-sm text-white/70">
                    {creator.bio}
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleSave}
                        disabled={saved}
                        className={`px-4 py-2 rounded-lg border text-sm transition ${saved
                            ? "border-green-400 text-green-400"
                            : "border-white/20 hover:border-[#636EE1]"
                            }`}
                    >
                        {saved ? "Saved ✓" : "Save Creator"}
                    </button>
                </div>
            </div>

            {/* ================= PORTFOLIO ================= */}
            <div>
                <h2 className="text-xl font-medium mb-6">
                    Portfolio
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {creator.portfolio?.length === 0 && (
                        <div className="text-sm text-white/50">
                            No portfolio projects yet.
                        </div>
                    )}

                    {creator.portfolio?.map((p: any) => (
                        <div
                            key={p._id}
                            className="rounded-2xl border border-white/10 bg-[#ffffff05] p-6"
                        >
                            <div className="text-lg font-medium">
                                {p.title}
                            </div>

                            {p.brandName && (
                                <div className="text-xs text-white/50 mt-1">
                                    {p.brandName}
                                </div>
                            )}

                            <div className="text-sm text-white/60 mt-2">
                                {p.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= SEND AGREEMENT SECTION ================= */}
            <div className="border-t border-white/10 pt-12">

                <div className="flex justify-center">
                    <button
                        onClick={() => setShowPanel((prev) => !prev)}
                        className="px-6 py-3 rounded-xl bg-[#636EE1] text-black font-medium hover:opacity-90 transition"
                    >
                        Send Agreement
                    </button>
                </div>

                {showPanel && (
                    <div className="mt-8 max-w-md mx-auto bg-[#ffffff05] border border-white/10 rounded-2xl p-6 space-y-6">

                        {draftAgreements.length === 0 ? (
                            <div className="text-sm text-white/60 text-center">
                                No draft agreements available.
                                <div className="mt-2 text-xs opacity-50">
                                    Create a draft agreement first.
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm opacity-70">
                                        Select Draft Agreement
                                    </label>

                                    <select
                                        value={selectedAgreement}
                                        onChange={(e) =>
                                            setSelectedAgreement(e.target.value)
                                        }
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#636EE1]"
                                    >
                                        <option value="">Choose agreement</option>
                                        {draftAgreements.map((d) => (
                                            <option key={d._id} value={d._id}>
                                                {d.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

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