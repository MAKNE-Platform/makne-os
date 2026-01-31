import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";
import { Milestone } from "@/lib/db/models/Milestone";
import { getCreatorBalance } from "@/lib/payments/getCreatorBalance";


export default async function CreatorEarningsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    redirect("/auth/login");
  }

  await connectDB();
  const creatorId = new mongoose.Types.ObjectId(userId);

  const balance = await getCreatorBalance(creatorId);

console.log("CREATOR BALANCE:", balance);

  // 1️⃣ Fetch released payments
  const payments = await Payment.find({
    creatorId,
    status: "RELEASED",
  })
    .sort({ updatedAt: -1 })
    .lean();

  // 2️⃣ Total earnings
  const totalEarnings = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Earnings
      </h1>

      {/* TOTAL */}
      <div className="rounded-lg border p-6 mb-8 bg-green-50">
        <p className="text-sm text-gray-600">
          Total earnings
        </p>
        <p className="text-3xl font-bold text-green-700">
          ₹{totalEarnings}
        </p>
      </div>

      {/* PAYMENTS LIST */}
      <div className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-gray-500">
            No earnings yet.
          </p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment._id.toString()}
              className="rounded-lg border p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  Milestone payment received
                </p>
                <p className="text-sm text-gray-500">
                  Agreement ID:{" "}
                  {payment.agreementId.toString()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(payment.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="font-semibold text-green-600">
                + ₹{payment.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
