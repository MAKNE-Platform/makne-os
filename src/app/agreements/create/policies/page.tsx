import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { savePoliciesAction } from "./actions";
import PolicyTextareaField from "@/components/agreements/PolicyTextareaField";

export default async function PoliciesPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  const agreementId = cookieStore.get("draft_agreement_id")?.value;

  if (role !== "BRAND") {
    redirect("/auth/login");
  }

  if (!agreementId) {
    redirect("/brand/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0e1324] to-[#151933] px-6 py-16">

      <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#636EE1]/20 blur-[120px]">
        <div className="h-[260px] w-[260px] rounded-full bg-[#636EE1]/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-2xl space-y-12">

        {/* HEADER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Define Policies
            </h1>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-zinc-400">
              Step 4 of 6
            </span>
          </div>

          <p className="text-sm text-zinc-400">
            Establish the legal and operational terms governing this agreement.
          </p>

          {/* Progress Bar */}
          <div className="mt-4 h-1 w-full rounded-full bg-white/10">
            <div className="h-full w-4/6 rounded-full bg-[#636EE1]" />
          </div>
        </div>

        {/* FORM CARD */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

          <form action={savePoliciesAction} className="space-y-10">

            <PolicyTextareaField
              label="Payment Terms"
              name="paymentTerms"
              placeholder="e.g. Payment will be released within 5 working days of milestone approval."
            />

            <PolicyTextareaField
              label="Cancellation Policy"
              name="cancellationPolicy"
              placeholder="e.g. Either party may cancel with 7 days notice."
            />

            <PolicyTextareaField
              label="Revision Policy"
              name="revisionPolicy"
              placeholder="e.g. Up to 2 revisions per deliverable."
            />

            <PolicyTextareaField
              label="Usage Rights"
              name="usageRights"
              placeholder="e.g. Brand has usage rights for 12 months across social media."
            />

            {/* CTA */}
            <div className="flex justify-end pt-4">
              <button className="group relative inline-flex items-center justify-center rounded-2xl bg-[#636EE1] px-8 py-3 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.98]">
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
