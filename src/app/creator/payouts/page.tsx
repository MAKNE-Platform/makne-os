import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { getCreatorBalance } from "@/lib/payments/getCreatorBalance";

import type { PayoutDocument } from "@/lib/db/models/Payout";


export default async function CreatorPayoutsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    redirect("/auth/login");
  }

  await connectDB();
  const creatorId = new mongoose.Types.ObjectId(userId);

  // Balance snapshot
  const balance = await getCreatorBalance(creatorId);

  // Payout history
  const payouts = await Payout.find({})
    .sort({ requestedAt: -1 })
    .lean<PayoutDocument[]>();


  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">

      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#1a1a1a] to-black p-8 lg:p-12">

        {/* Floating Cards */}
        <div className="hidden lg:block absolute right-114 top-33 pointer-events-none">
          <div className="absolute text-sm p-2 w-72 h-44 bg-gradient-to-br from-purple-500/30 to-[#636EE1]/30 rounded-2xl rotate-12 shadow-2xl backdrop-blur-xl border border-white/10">MAKNE</div>
          <div className="absolute text-sm p-2 w-72 h-44 bg-gradient-to-br from-[#636EE1]/40 to-indigo-500/20 rounded-2xl -rotate-6 translate-x-6 translate-y-6 shadow-2xl backdrop-blur-xl border border-white/10">MAKNE</div>
        </div>

        <div className="relative z-10">
          <div className="text-sm text-white/60">Available Balance</div>

          <div className="mt-3 text-4xl lg:text-5xl font-semibold">
            ₹{balance.availableBalance.toLocaleString()}
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/70">
            <div>
              <div>Locked</div>
              <div className="text-white font-medium">
                ₹{balance.lockedAmount.toLocaleString()}
              </div>
            </div>

            <div>
              <div>Total Withdrawn</div>
              <div className="text-white font-medium">
                ₹{balance.paidOut.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="/creator/earnings"
              className="px-4 py-2 rounded-lg bg-[#636EE1] text-black text-sm font-medium"
            >
              View Earnings
            </a>

            <a
              href="/creator/payments"
              className="px-4 py-2 rounded-lg border border-white/20 backdrop-blur-xl text-sm"
            >
              Wallet
            </a>
          </div>
        </div>
      </div>

      {/* ================= PAYOUT HISTORY ================= */}
      <div className="rounded-2xl border border-white/10 bg-[#ffffff05] p-6 space-y-6">
        <h2 className="text-lg font-medium">
          Payout History
        </h2>

        {payouts.length === 0 ? (
          <p className="text-sm text-white/50">
            You haven’t requested any payouts yet.
          </p>
        ) : (
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div
                key={payout._id.toString()}
                className="flex justify-between items-center border-b border-white/5 pb-4"
              >
                <div>
                  <div className="text-sm font-medium">
                    ₹{payout.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/50">
                    Requested on{" "}
                    {new Date(payout.requestedAt).toLocaleDateString()}
                  </div>

                  {payout.processedAt && (
                    <div className="text-xs text-white/40 mt-1">
                      Processed on{" "}
                      {new Date(payout.processedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <PayoutStatusBadge status={payout.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function PayoutStatusBadge({
  status,
}: {
  status: "REQUESTED" | "PROCESSING" | "COMPLETED" | "FAILED";
}) {
  const map = {
    REQUESTED: "bg-gray-500/20 text-gray-300",
    PROCESSING: "bg-yellow-500/20 text-yellow-400",
    COMPLETED: "bg-green-500/20 text-green-400",
    FAILED: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}