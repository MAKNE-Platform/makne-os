import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";

export default async function ImportCampaignPage() {

  const cookieStore = await cookies();

  const userId =
    cookieStore.get("auth_session")?.value;

  const role =
    cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    redirect("/auth/login");
  }

  await connectDB();

  const agreements =
    await Agreement.find({
      creatorId:
        new mongoose.Types.ObjectId(userId),

      status: "COMPLETED",

      portfolioSummary: {
        $exists: true,
      },
    })
      .sort({ updatedAt: -1 })
      .lean();

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">

      <div className="mx-auto max-w-5xl space-y-10">

        {/* HEADER */}
        <div className="space-y-3">

          <div className="inline-flex rounded-full border border-[#636EE1]/20 bg-[#636EE1]/10 px-4 py-1 text-xs text-[#A5AEFF]">
            Portfolio Import
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Import Completed Campaigns
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            Convert completed collaborations into portfolio-ready projects.
          </p>

        </div>

        {/* AGREEMENTS */}
        <div className="grid gap-6 md:grid-cols-2">

          {agreements.map((agreement: any) => (

            <form
              key={agreement._id.toString()}
              action="/api/creator/import-portfolio"
              method="POST"
              className="rounded-3xl border border-white/5 bg-[#101014] p-6"
            >

              <input
                type="hidden"
                name="agreementId"
                value={agreement._id.toString()}
              />

              <div className="space-y-5">

                <div className="space-y-3">

                  <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-wide text-emerald-300">
                    Completed Campaign
                  </div>

                  <div>

                    <h2 className="text-xl font-medium">
                      {agreement.title}
                    </h2>

                    {agreement.description && (
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {agreement.description}
                      </p>
                    )}

                  </div>

                </div>

                {/* AI SUMMARY */}
                {agreement.portfolioSummary && (
                  <div className="rounded-2xl border border-[#636EE1]/10 bg-[#636EE1]/5 p-4">

                    <p className="text-xs uppercase tracking-wide text-[#A5AEFF]">
                      AI Campaign Summary
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      {agreement.portfolioSummary}
                    </p>

                  </div>
                )}

                {/* CTA */}
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#636EE1] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110"
                >
                  Import Into Portfolio
                </button>

              </div>

            </form>

          ))}

        </div>

      </div>

    </div>
  );
}