import mongoose from "mongoose";
import { Payment } from "@/lib/db/models/Payment";
import { Payout } from "@/lib/db/models/Payout";


export async function getCreatorBalance(
  creatorId: mongoose.Types.ObjectId
) {
  const [payments, payouts] = await Promise.all([
    Payment.find({
      creatorId,
      status: "RELEASED",
    }).lean(),

    Payout.find({
      creatorId,
      status: { $in: ["REQUESTED", "PROCESSING", "COMPLETED"] },
    }).lean(),
  ]);

  const totalEarned = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const lockedAmount = payouts
    .filter(p => p.status !== "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  const paidOut = payouts
    .filter(p => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBalance =
    totalEarned - lockedAmount - paidOut;

  return {
    totalEarned,
    lockedAmount,
    paidOut,
    availableBalance: Math.max(availableBalance, 0),
  };
}
