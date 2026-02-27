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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">

  <Link
    href="/brand/creators"
    className="inline-flex items-center gap-2 border px-3 py-1.5 rounded-md border-[#636EE1] text-[#636EE1] hover:bg-[#636EE1] hover:text-white transition-all text-sm"
  >
    <ArrowLeft size={16} />
    Back to Creators
  </Link>

  {/* ================= HERO ================= */}
  <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#111827] to-black p-5 sm:p-8 space-y-8">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative">

      {/* Identity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">

        {creator.profileImage ? (
          <img
            src={creator.profileImage}
            alt={creator.displayName}
            className="h-28 w-28 sm:h-36 sm:w-36 lg:h-52 lg:w-52 rounded-2xl object-cover border border-white/10 shadow-xl"
          />
        ) : (
          <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-[#636EE1]/20 flex items-center justify-center text-3xl sm:text-4xl font-semibold">
            {creator.displayName?.[0]?.toUpperCase()}
          </div>
        )}

        <div className="space-y-2 max-w-2xl">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
            {creator.displayName || creator.username || "Creator"}
          </h1>

          <p className="font-semibold text-white/80 text-sm sm:text-base">
            {creator.email}
          </p>

          <div className="text-white/60 text-sm">
            {creator.niche}
          </div>

          <div className="text-white/50 text-xs sm:text-sm">
            {creator.platforms}
          </div>

          {creator.location && (
            <div className="text-white/40 text-xs">
              {creator.location}
            </div>
          )}

          {creator.bio && (
            <p className="text-sm text-white/70 leading-relaxed">
              {creator.bio}
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saved}
        className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl 
        lg:absolute lg:right-2 lg:top-2 
        border text-sm font-medium transition
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
    <h2 className="text-xl sm:text-2xl font-semibold">
      Skills & Capabilities
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  <div className="space-y-8 sm:space-y-10">
    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
      Portfolio
    </h2>

    {creator.portfolio?.length === 0 ? (
      <div className="text-sm text-white/50">
        No projects added yet.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* your map stays unchanged */}
      </div>
    )}
  </div>

  {/* ================= SEND AGREEMENT ================= */}
  <div className="border-t border-white/10 pt-12 sm:pt-16 space-y-10">

    <div className="flex justify-center">
      <button
        onClick={() => setShowPanel((prev) => !prev)}
        className="px-6 sm:px-8 py-3 rounded-xl bg-[#636EE1] text-black font-medium hover:opacity-90 transition text-sm sm:text-base"
      >
        Send Agreement
      </button>
    </div>

    {showPanel && (
      <div className="max-w-md mx-auto bg-[#ffffff05] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">

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