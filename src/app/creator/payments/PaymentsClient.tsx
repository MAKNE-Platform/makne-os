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

type Props = {
    payments: any[];
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
    return (
        <div className="py-8 space-y-10">

            {/* ================= HERO ================= */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#1a1a1a] to-black p-8 lg:p-12">

                {/* Peek Cards */}
                <div className="hidden lg:block absolute right-110 top-15 pointer-events-none">
                    <div className="absolute w-76 h-48 p-2 text-xs bg-gradient-to-br from-purple-500/30 to-[#636EE1]/30 rounded-2xl rotate-12 shadow-2xl backdrop-blur-xl border border-white/10">MAKNE</div>
                    <div className="absolute w-76 h-48 p-2 text-xs bg-gradient-to-br from-[#636EE1]/40 to-indigo-500/20 rounded-2xl -rotate-6 translate-x-2 translate-y-6 shadow-2xl backdrop-blur-xl border border-white/10">MAKNE</div>
                </div>

                <div className="relative z-10">
                    <div className="text-sm text-white/60">Total Earnings</div>

                    <div className="mt-3 text-4xl lg:text-5xl font-semibold">
                        ₹{totalEarnings.toLocaleString()}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button className="px-4 py-2 rounded-lg bg-[#636EE1] text-black text-sm font-medium">
                            View History
                        </button>
                        <button className="px-4 py-2 rounded-lg border backdrop-blur-2xl border-white/20 text-sm">
                            Download Report
                        </button>
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

                    <form
                        action="/api/creator/payouts/request"
                        method="POST"
                        className="mt-6"
                    >
                        <button
                            type="submit"
                            disabled={balance.availableBalance <= 0}
                            className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition
        ${balance.availableBalance > 0
                                    ? "bg-[#636EE1] text-black hover:opacity-90"
                                    : "bg-white/5 text-white/40 cursor-not-allowed"
                                }
      `}
                        >
                            {balance.availableBalance > 0
                                ? "Withdraw to Bank"
                                : "No Funds Available"}
                        </button>
                    </form>

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