import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAgreementMetaAction } from "./actions";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import mongoose from "mongoose";

/* ✅ Minimal type for this page */
type DraftAgreementMeta = {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  creatorEmail?: string;
};

export default async function AgreementMetaPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  const agreementId = cookieStore.get("draft_agreement_id")?.value;

  if (role !== "BRAND") {
    redirect("/auth/login");
  }

  let agreement: DraftAgreementMeta | null = null;

  if (agreementId && mongoose.Types.ObjectId.isValid(agreementId)) {
    await connectDB();

    agreement = (await Agreement.findById(
      agreementId
    ).lean()) as DraftAgreementMeta | null;

    if (!agreement) {
      cookieStore.delete("draft_agreement_id");
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0e1324] to-[#151933] px-6 py-16">

      {/* Glow Background Accent */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#636EE1]/20 blur-[120px]" />

      <div className="relative mx-auto max-w-2xl space-y-12">

        {/* HEADER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Create Agreement
            </h1>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-zinc-400">
              Step 1 of 6
            </span>
          </div>

          <p className="text-sm text-zinc-400">
            Define the core details of this collaboration. You can refine scope,
            milestones, and payments in the next steps.
          </p>

          {/* Progress Bar */}
          <div className="mt-4 h-1 w-full rounded-full bg-white/10">
            <div className="h-full w-1/6 rounded-full bg-[#636EE1]" />
          </div>
        </div>

        {/* FORM CARD */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

          <form
            action={createAgreementMetaAction}
            className="space-y-8"
          >

            {/* TITLE */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Agreement Title *
              </label>
              <input
                name="title"
                required
                defaultValue={agreement?.title ?? ""}
                placeholder="e.g. Instagram Campaign – July"
                className="w-full rounded-2xl border border-white/10 bg-[#121420] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={agreement?.description ?? ""}
                placeholder="Brief overview of the collaboration"
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#121420] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
              />
            </div>

            {/* CREATOR EMAIL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Creator Email <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                name="creatorEmail"
                type="email"
                defaultValue={agreement?.creatorEmail ?? ""}
                placeholder="creator@email.com"
                className="w-full rounded-2xl border border-white/10 bg-[#121420] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
              />
              <p className="text-xs text-zinc-500">
                You can add or modify the creator later before sending.
              </p>
            </div>

            {/* CTA */}
            <div className="flex justify-end pt-4">
              <button
                className="group relative inline-flex items-center justify-center rounded-2xl bg-[#636EE1] px-8 py-3 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.98]"
              >
                <span className="absolute inset-0 rounded-2xl bg-[#636EE1]/20 blur-md opacity-0 transition group-hover:opacity-60" />
                <span className="relative">Continue</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}