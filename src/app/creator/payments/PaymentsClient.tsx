"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
    payments: {
        id: string;
        agreementId: string;
        milestoneId: string;
        brandId: string;
        creatorId: string;
        amount: number;
        status: string;
        createdAt: string;
        updatedAt: string;
    }[];
    totalEarnings: number;
    pendingEarnings: number;
    earningsChart: { label: string; value: number }[];
    balance: {
        availableBalance: number;
        lockedAmount: number;
        paidOut: number;
    };
};

export default function PaymentsClient({
    payments,
    totalEarnings,
    pendingEarnings,
    earningsChart,
    balance,
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

            // ✅ Clear input
            setWithdrawAmount(0);

            // ✅ Optional: redirect to payouts page
            router.push("/creator/payouts");

            // OR if you prefer staying on page:
            // router.refresh();

        } catch (err) {
            setError("Something went wrong");
        }

        setLoading(false);
    }

    return (
        <div className="py-8 space-y-10 lg:px-8">

            {/* ================= HERO ================= */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#1a1a1a] to-black p-8 lg:p-12">

                {/* Peek Cards */}
                <div className="hidden lg:block absolute right-114 top-15 pointer-events-none">
                    <div className="absolute w-76 h-48 p-2 text-xs bg-gradient-to-br from-purple-500/30 to-[#636EE1]/30 rounded-2xl rotate-12 shadow-2xl backdrop-blur-xl border border-white/10">MAKNE</div>
                    <div className="absolute w-76 h-48 p-2 text-xs bg-gradient-to-br from-[#636EE1]/40 to-indigo-500/20 rounded-2xl -rotate-6 translate-x-2 translate-y-6 shadow-2xl backdrop-blur-xl border border-white/10">MAKNE</div>
                </div>

                <div className="relative z-10">
                    <div className="text-sm text-white/60">Total Earnings</div>

                    <div className="mt-3 text-4xl lg:text-5xl font-semibold">
                        ₹{totalEarnings.toLocaleString()}
                    </div>

                    <div className="mt-6 flex gap-3">

                        {/* View History */}
                        <Link
                            href="/creator/wallet/history"
                            className="px-4 py-2 rounded-lg bg-[#636EE1] text-black text-sm font-medium hover:opacity-90 transition"
                        >
                            View History
                        </Link>

                        {/* Download Report */}
                        <a
                            href="/api/wallet/export"
                            className="px-4 py-2 rounded-lg border backdrop-blur-2xl border-white/20 text-sm hover:bg-white/5 transition flex items-center gap-2"
                        >
                            Download Report
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

                {/* Earnings Chart */}
                <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#ffffff05] p-6">
                    <div className="text-sm text-white/60 mb-4">
                        Earnings (Last 6 Months)
                    </div>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={earningsChart}>
                                <CartesianGrid stroke="#ffffff10" strokeDasharray="4 4" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fill: "#ffffff70", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#ffffff70", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "#000",
                                        border: "1px solid #636EE1",
                                        fontSize: "12px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#636EE1"
                                    strokeWidth={2.5}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ================= PAYMENT ACTIVITY ================= */}
            <div className="rounded-2xl border border-white/10 bg-[#ffffff05] p-6">
                <div className="text-lg font-medium mb-6">
                    Recent Payment Activity
                </div>

                <div className="space-y-4">
                    {payments.slice(0, 6).map((p, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center border-b border-white/5 pb-3"
                        >
                            <div>
                                <div className="text-sm">
                                    Milestone Payment
                                </div>
                                <div className="text-xs text-white/50">
                                    {new Date(p.updatedAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div
                                className={`text-sm font-medium ${p.status === "RELEASED"
                                    ? "text-green-400"
                                    : p.status === "FAILED"
                                        ? "text-red-400"
                                        : "text-yellow-400"
                                    }`}
                            >
                                ₹{p.amount.toLocaleString()}
                            </div>
                        </div>
                    ))}

                    {payments.length === 0 && (
                        <div className="text-sm text-white/50">
                            No payments yet.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}