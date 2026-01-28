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

  let agreement: DraftAgreementMeta | null = null;

  if (agreementId) {
    await connectDB();
    agreement = (await Agreement.findById(
      agreementId
    ).lean()) as unknown as DraftAgreementMeta | null;
  }

  if (role !== "BRAND") {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-medium">
          Create Agreement
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Step 1 of 6 · Agreement details
        </p>
      </div>

      <form
        action={createAgreementMetaAction}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Agreement title *
          </label>
          <input
            name="title"
            required
            defaultValue={agreement?.title || ""}
            placeholder="e.g. Instagram Campaign – July"
            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={agreement?.description || ""}
            placeholder="Brief overview of the collaboration"
            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Creator email (optional)
          </label>
          <input
            name="creatorEmail"
            type="email"
            defaultValue={agreement?.creatorEmail || ""}
            placeholder="creator@email.com"
            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
          />
          <p className="mt-1 text-xs text-zinc-500">
            You can add or change this later.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            className="rounded-lg bg-[#636EE1] px-6 py-3 text-sm text-white"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
