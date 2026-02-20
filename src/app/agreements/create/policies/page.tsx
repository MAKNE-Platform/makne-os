import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { savePoliciesAction } from "./actions";

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
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-medium">
          Define Policies
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Step 4 of 6 · Terms & conditions
        </p>
      </div>

      <form action={savePoliciesAction} className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Payment terms
          </label>
          <textarea
            name="paymentTerms"
            placeholder="e.g. Payment will be released within 5 working days of milestone approval."
            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Cancellation policy
          </label>
          <textarea
            name="cancellationPolicy"
            placeholder="e.g. Either party may cancel with 7 days notice."
            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Revision policy
          </label>
          <textarea
            name="revisionPolicy"
            placeholder="e.g. Up to 2 revisions per deliverable."
            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Usage rights
          </label>
          <textarea
            name="usageRights"
            placeholder="e.g. Brand has usage rights for 12 months across social media."
            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
          />
        </div>

        <div className="flex justify-between">
          <button className="rounded-lg bg-[#636EE1] px-6 py-3 text-sm text-white">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
