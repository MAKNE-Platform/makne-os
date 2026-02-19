import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";
import { Milestone } from "@/lib/db/models/Milestone";
import DeliverMilestoneForm from "./_components/DeliverMilestoneForm";
import { Payment } from "@/lib/db/models/Payment";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT: "bg-zinc-700 text-zinc-300",
    SENT: "bg-amber-500/20 text-amber-400",
    ACTIVE: "bg-emerald-500/20 text-emerald-400",
    COMPLETED: "bg-[#636EE1]/20 text-[#636EE1]",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success" | "warning";
}) {
  const accentMap = {
    success: "text-emerald-400",
    warning: "text-amber-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F0F12] p-5">
      <p className="text-xs text-zinc-400 uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`text-xl font-semibold mt-2 ${
          accent ? accentMap[accent] : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function AgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) redirect("/auth/login");

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) redirect("/agreements");

  const agreement = (await Agreement.findById(id).lean()) as any;
  if (!agreement) redirect("/agreements");

  const isBrand = agreement.brandId.toString() === userId;
  const isCreator = agreement.creatorId?.toString() === userId;
  if (!isBrand && !isCreator) redirect("/dashboard");

  const brandUser = (await User.findById(
    agreement.brandId
  ).lean()) as any;

  const milestones = (await Milestone.find({
    agreementId: agreement._id,
  }).lean()) as any[];

  const payments = await Payment.find({
    agreementId: agreement._id,
  }).lean();

  const paymentByMilestoneId = new Map(
    payments.map((p) => [p.milestoneId.toString(), p])
  );

  const deliverables = agreement.deliverables || [];

  const isDraft = agreement.status === "DRAFT";
  const isSent = agreement.status === "SENT";
  const isActive = agreement.status === "ACTIVE";

  const totalValue = milestones.reduce((sum, m) => sum + m.amount, 0);

  const paidAmount = payments
    .filter((p) => p.status === "RELEASED")
    .reduce((sum, p) => sum + p.amount, 0);

  const processingAmount = payments
    .filter((p) => p.status === "INITIATED")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = totalValue - paidAmount - processingAmount;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {agreement.title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Agreement ID • {agreement._id.toString().slice(-6)}
          </p>
        </div>
        <StatusBadge status={agreement.status} />
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* MILESTONES */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-300 uppercase">
              Milestones
            </h3>

            {milestones.length === 0 && (
              <p className="text-sm text-zinc-500">
                No milestones added yet.
              </p>
            )}

            {milestones.map((m: any) => {
              const payment = paymentByMilestoneId.get(
                m._id.toString()
              );

              return (
                <div
                  key={m._id}
                  className="rounded-2xl border border-white/10 bg-[#101012] p-6 space-y-4 hover:border-[#636EE1]/40 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium">
                        {m.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        Covers:{" "}
                        {deliverables
                          .filter((d: any) =>
                            m.deliverableIds?.some(
                              (id: any) =>
                                id.toString() ===
                                d._id.toString()
                            )
                          )
                          .map((d: any) => d.title)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ₹{m.amount}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {m.status}
                      </p>
                    </div>
                  </div>

                  {/* CREATOR SUBMIT */}
                  {isCreator &&
                    isActive &&
                    (m.status === "PENDING" ||
                      m.status === "REVISION") && (
                      <DeliverMilestoneForm
                        milestoneId={m._id.toString()}
                      />
                    )}

                  {/* BRAND VIEW SUBMISSION */}
                  {isBrand && m.submission && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                      {m.submission.note && (
                        <p className="text-sm text-zinc-300">
                          {m.submission.note}
                        </p>
                      )}

                      {m.submission.files?.map(
                        (file: any, i: number) => (
                          <a
                            key={i}
                            href={file.url}
                            target="_blank"
                            className="block text-sm text-[#636EE1] hover:underline"
                          >
                            {file.name}
                          </a>
                        )
                      )}
                    </div>
                  )}

                  {/* BRAND APPROVAL */}
                  {isBrand &&
                    isActive &&
                    m.status === "IN_PROGRESS" && (
                      <div className="flex gap-3">
                        <form
                          action={`/milestones/${m._id}/approve`}
                          method="POST"
                        >
                          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white">
                            Approve
                          </button>
                        </form>

                        <form
                          action={`/milestones/${m._id}/request-changes`}
                          method="POST"
                        >
                          <button className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white">
                            Request Changes
                          </button>
                        </form>
                      </div>
                    )}

                  {/* PAYMENT */}
                  {m.status === "COMPLETED" && payment && (
                    <div className="pt-4 border-t border-white/10">
                      {payment.status === "PENDING" && (
                        <form
                          method="POST"
                          action={`/api/payments/${payment._id}/initiate`}
                        >
                          <button className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
                            Pay ₹{payment.amount}
                          </button>
                        </form>
                      )}

                      {payment.status === "INITIATED" && (
                        <p className="text-amber-400 text-sm">
                          Payment processing...
                        </p>
                      )}

                      {payment.status === "RELEASED" && (
                        <p className="text-emerald-400 text-sm">
                          Paid
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* PAYMENT SUMMARY */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Total Value"
              value={`₹${totalValue}`}
            />
            <MetricCard
              label="Paid"
              value={`₹${paidAmount}`}
              accent="success"
            />
            <MetricCard
              label="Processing"
              value={`₹${processingAmount}`}
              accent="warning"
            />
            <MetricCard
              label="Pending"
              value={`₹${pendingAmount}`}
            />
          </div>

          {/* BRAND INFO */}
          <div className="rounded-2xl border border-white/10 bg-[#0F0F12] p-6 space-y-2">
            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              Brand
            </p>
            <p className="text-sm text-white">
              {brandUser?.email}
            </p>

            {agreement.creatorEmail && (
              <>
                <p className="text-xs text-zinc-400 uppercase tracking-wide mt-4">
                  Creator
                </p>
                <p className="text-sm text-white">
                  {agreement.creatorEmail}
                </p>
              </>
            )}
          </div>

          <a
            href={`/agreements/${agreement._id}/print`}
            target="_blank"
            className="block text-center rounded-2xl border border-white/20 px-4 py-3 text-sm text-white hover:border-[#636EE1]/40 transition"
          >
            Export / Print Agreement
          </a>
        </div>
      </div>
    </div>
  );
}
