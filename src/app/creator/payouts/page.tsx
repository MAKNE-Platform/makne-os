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
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold">
        Payouts
      </h1>

      {/* Balance snapshot */}
      <div className="mb-8 rounded-2xl bg-muted/40 p-6">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Balance overview
        </h3>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Available balance
            </span>
            <span className="font-medium">
              ₹{balance.availableBalance}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Locked (processing)
            </span>
            <span className="font-medium">
              ₹{balance.lockedAmount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Total withdrawn
            </span>
            <span className="font-medium">
              ₹{balance.paidOut}
            </span>
          </div>
        </div>
      </div>

      {/* Payout history */}
      <div className="space-y-3">
        {payouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You haven’t requested any payouts yet.
          </p>
        ) : (
          payouts.map((payout) => (
            <div
              key={payout._id.toString()}
              className="rounded-xl border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    ₹{payout.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requested on{" "}
                    {new Date(
                      payout.requestedAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <PayoutStatusBadge status={payout.status} />
              </div>

              {payout.processedAt && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Processed on{" "}
                  {new Date(
                    payout.processedAt
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
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
    REQUESTED: {
      label: "Requested",
      className: "bg-gray-100 text-gray-700",
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-amber-100 text-amber-700",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-emerald-100 text-emerald-700",
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-100 text-red-700",
    },
  };

  const config = map[status];

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
