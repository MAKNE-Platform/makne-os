"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EarningsChart from "@/components/charts/EarningsChart";

type Props = {
  balance: any;
  payments: any[];
  totalEarnings: number;
  earningsChart: { label: string; value: number }[];
};

export default function EarningsClient({
  balance,
  payments,
  totalEarnings,
  earningsChart,
}: Props) {
  const router = useRouter();

  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleWithdraw() {
    if (!withdrawAmount || withdrawAmount <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/creator/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: withdrawAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Withdrawal failed");
        setLoading(false);
        return;
      }

      setWithdrawAmount(0);
      router.push("/creator/payouts");

    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">

      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#1a1a1a] to-black p-8 lg:p-12">

        <div className="hidden lg:block absolute right-114 top-16 pointer-events-none">
          <div className="absolute text-sm p-2 w-72 h-44 bg-gradient-to-br from-purple-500/30 to-[#636EE1]/30 rounded-2xl rotate-12 shadow-2xl backdrop-blur-xl border border-white/10">MAKNE</div>
          <div className="absolute text-sm p-2 w-72 h-44 bg-gradient-to-br from-[#636EE1]/40 to-indigo-500/20 rounded-2xl -rotate-6 translate-x-6 translate-y-6 shadow-2xl backdrop-blur-xl border border-white/10">MAKNE</div>
        </div>

        <div className="relative z-10">
          <div className="text-sm text-white/60">
            Lifetime Earnings
          </div>

          <div className="mt-3 text-4xl lg:text-5xl font-semibold">
            ₹{totalEarnings.toLocaleString()}
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="/creator/payments"
              className="px-4 py-2 rounded-lg bg-[#636EE1] text-black text-sm font-medium"
            >
              Go to Wallet
            </a>

            <a
              href="/api/wallet/statement"
              className="px-4 py-2 rounded-lg border backdrop-blur-2xl border-white/20 text-sm hover:bg-white/5 transition"
            >
              Download Statement
            </a>
          </div>
        </div>
      </div>

      {/* ================= OVERVIEW ROW ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Balance Card */}
        <div className="rounded-2xl border border-white/10 bg-[#ffffff05] p-6 flex flex-col justify-between">

          <div>
            <div className="text-sm text-white/60">
              Available Balance
            </div>

            <div className="text-2xl font-semibold mt-2">
              ₹{balance.availableBalance.toLocaleString()}
            </div>

            <div className="mt-3 space-y-1 text-xs text-white/50">
              <div className="flex justify-between">
                <span>Locked (Processing)</span>
                <span>₹{balance.lockedAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Withdrawn</span>
                <span>₹{balance.paidOut.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-white/50">
              Track all withdrawal requests
            </div>

            <button
              onClick={() => router.push("/creator/payouts")}
              className="text-xs hover:text-[#636EE1] bg-[#636EE1] text-black border[#636EE1] transition-all hover:border-[#636EE1] hover:bg-[#000] border p-2 rounded-md"
            >
              View Payout History
            </button>
          </div>

          {/* Withdraw Section */}
          <div className="mt-6 space-y-3">

            <input
              type="number"
              placeholder="Enter withdrawal amount"
              value={withdrawAmount}
              max={balance.availableBalance}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#636EE1]"
            />

            <button
              disabled={
                loading ||
                withdrawAmount <= 0 ||
                withdrawAmount > balance.availableBalance
              }
              onClick={handleWithdraw}
              className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition
              ${withdrawAmount > 0 &&
                  withdrawAmount <= balance.availableBalance
                  ? "bg-[#636EE1] text-black hover:opacity-90"
                  : "bg-white/5 text-white/40 cursor-not-allowed"
                }
            `}
            >
              {loading ? "Processing..." : "Withdraw to Bank"}
            </button>

            {error && (
              <div className="text-xs text-red-400">
                {error}
              </div>
            )}

          </div>

        </div>

        {/* Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#ffffff05] p-6">
          <div className="text-sm text-white/60 mb-4">
            Earnings (Last 6 Months)
          </div>

          <EarningsChart data={earningsChart} />
        </div>
      </div>

      {/* ================= RELEASED PAYMENTS ================= */}
      <div className="rounded-2xl border border-white/10 bg-[#ffffff05] p-6 space-y-6">
        <h2 className="text-lg font-medium">
          Released Payments
        </h2>

        {payments.length === 0 ? (
          <p className="text-sm text-white/50">
            No earnings yet.
          </p>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment._id.toString()}
                className="flex justify-between items-center border-b border-white/5 pb-4"
              >
                <div>
                  <div className="text-sm font-medium">
                    Milestone Payment
                  </div>
                  <div className="text-xs text-white/50">
                    {new Date(payment.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-sm font-medium text-green-400">
                  + ₹{payment.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}