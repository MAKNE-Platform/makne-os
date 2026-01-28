import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { saveDeliverablesAction } from "./actions";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import mongoose from "mongoose";

/* ✅ Minimal type for this page */
type DraftDeliverable = {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
};

type DraftAgreementDeliverables = {
  deliverables?: DraftDeliverable[];
};

export default async function DeliverablesPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  const agreementId = cookieStore.get("draft_agreement_id")?.value;

  if (role !== "BRAND") {
    redirect("/auth/login");
  }

  if (!agreementId) {
    redirect("/dashboard/brand");
  }

  let deliverables: DraftDeliverable[] = [];

  await connectDB();
  const agreement = (await Agreement.findById(
    agreementId
  ).lean()) as unknown as DraftAgreementDeliverables | null;

  if (agreement?.deliverables) {
    deliverables = agreement.deliverables;
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-medium">
          Define Deliverables
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Step 2 of 6 · What will be delivered
        </p>
      </div>

      <form
        action={saveDeliverablesAction}
        className="space-y-6"
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 p-5 bg-white/5 space-y-3"
          >
            <input
              name="deliverable_title"
              placeholder="Deliverable title (e.g. Instagram Reel)"
              required={index === 0}
              defaultValue={deliverables[index]?.title || ""}
              className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
            />
            <textarea
              name="deliverable_description"
              placeholder="Description (optional)"
              defaultValue={deliverables[index]?.description || ""}
              className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
            />
          </div>
        ))}

        <div className="flex justify-between">
          <a
            href="/agreements/create/meta"
            className="text-sm text-zinc-400"
          >
            ← Back
          </a>

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
