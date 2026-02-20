"use client";

import DeliverablesLineChart from "@/components/analytics/DeliverablesLineChart";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type Props = {
    metrics: {
        totalEarnings: number;
        pendingEarnings: number;
        completionRate: number;
        avgDealValue: number;
        totalAgreements: number;
        activeAgreements: number;
        completedAgreements: number;
    };
    earningsChart: { label: string; value: number }[];
    deliverablesChart: { label: string; value: number }[];
};

export default function AnalyticsClient({
    metrics,
    earningsChart,
    deliverablesChart,
}: Props) {
    return (
        <div className="space-y-10 py-8 lg:px-8">

            {/* Header */}
            <div>
                <h1 className="text-4xl font-semibold tracking-tight">
                    Analytics
                </h1>
                <p className="text-sm text-white/50 mt-1">
                    Insights into your performance and growth
                </p>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Total Earnings" value={`₹${metrics.totalEarnings}`} />
                <MetricCard label="Pending Earnings" value={`₹${metrics.pendingEarnings}`} />
                <MetricCard label="Completion Rate" value={`${metrics.completionRate}%`} />
                <MetricCard label="Avg Deal Value" value={`₹${metrics.avgDealValue}`} />
            </div>

            {/* Deliverables Chart */}
            <div className="rounded-xl border border-white/10 p-6 bg-[#ffffff05]">
                <h2 className="text-lg font-medium mb-4">Completed Deliverables</h2>
                <DeliverablesLineChart data={deliverablesChart} />
            </div>

            {/* Earnings Chart */}
            <div className="rounded-xl border border-white/10 p-6 bg-[#ffffff05]">
                <h2 className="text-lg font-medium mb-4">Earnings (Last 6 Months)</h2>
                <DeliverablesLineChart data={earningsChart} />
            </div>

            <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-8">
                <h2 className="text-xl font-medium mb-8">
                    Agreement Status Distribution
                </h2>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">

                    {/* ===== LEFT: Donut Chart ===== */}
                    <div className="relative w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        {
                                            name: "Active",
                                            value: metrics.activeAgreements,
                                        },
                                        {
                                            name: "Completed",
                                            value: metrics.completedAgreements,
                                        },
                                        {
                                            name: "Other",
                                            value:
                                                metrics.totalAgreements -
                                                metrics.activeAgreements -
                                                metrics.completedAgreements,
                                        },
                                    ]}
                                    dataKey="value"
                                    innerRadius={90}
                                    outerRadius={120}
                                    paddingAngle={4}
                                >
                                    <Cell fill="#636EE1" />
                                    <Cell fill="#10B981" />
                                    <Cell fill="#EF4444" />
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: "#000",
                                        border: "1px solid #636EE1",
                                        fontSize: "12px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="text-3xl font-semibold">
                                {metrics.completionRate}%
                            </div>
                            <div className="text-xs text-white/50">
                                Completion Rate
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT: Insights Panel ===== */}
                    <div className="space-y-6">

                        <StatRow
                            label="Active Agreements"
                            value={metrics.activeAgreements}
                            color="#636EE1"
                        />

                        <StatRow
                            label="Completed Agreements"
                            value={metrics.completedAgreements}
                            color="#10B981"
                        />

                        <StatRow
                            label="Other / Rejected"
                            value={
                                metrics.totalAgreements -
                                metrics.activeAgreements -
                                metrics.completedAgreements
                            }
                            color="#EF4444"
                        />

                        <div className="pt-4 border-t border-white/10 text-sm text-white/60">
                            {metrics.completionRate > 70
                                ? "Strong performance — most agreements are being completed."
                                : "Opportunity to improve conversion and completion rate."}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

/* ================= SUB COMPONENTS ================= */

function MetricCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#636EE1]/10 via-transparent to-transparent p-5">
            <div className="text-sm opacity-60">{label}</div>
            <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
    );
}

function StatusBar({
    label,
    value,
    total,
}: {
    label: string;
    value: number;
    total: number;
}) {
    const percent = total > 0 ? (value / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{value}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#636EE1] transition-all"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function StatRow({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 bg-black/30">
            <div className="flex items-center gap-3">
                <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: color }}
                />
                <span className="text-sm text-white/70">{label}</span>
            </div>
            <span className="text-lg font-medium">{value}</span>
        </div>
    );
}