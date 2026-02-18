"use client";

import Link from "next/link";

type Agreement = {
  id: string;
  title: string;
  brandName: string;
  status: string;
  amount: number;
  updatedAt: string;
};

type Props = {
  agreements: Agreement[];
  metrics: {
    total: number;
    active: number;
    completed: number;
    totalEarnings: number;
  };
};

export default function CreatorAgreementsClient({
  agreements,
  metrics,
}: Props) {
  return (
    <div className="space-y-8">

      {/* Heading */}
      <h1 className="text-2xl font-medium">Agreements</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <MetricCard label="Total" value={metrics.total} />
        <MetricCard label="Active" value={metrics.active} />
        <MetricCard label="Completed" value={metrics.completed} />
        <MetricCard
          label="Total Earnings"
          value={`₹${metrics.totalEarnings}`}
        />

      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="text-left px-6 py-4">Agreement</th>
              <th className="text-left px-6 py-4">Brand</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Amount</th>
              <th className="text-left px-6 py-4">Updated</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {agreements.map((a) => (
              <tr
                key={a.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4 font-medium">{a.title}</td>
                <td className="px-6 py-4">{a.brandName}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-6 py-4">₹{a.amount}</td>
                <td className="px-6 py-4 opacity-60">
                  {new Date(a.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/agreements/${a.id}`}
                    className="text-[#636EE1] hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {agreements.length === 0 && (
          <div className="p-8 text-center opacity-60">
            No agreements yet.
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function MetricCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-5">
      <div className="text-sm opacity-60">{label}</div>
      <div className="text-xl font-medium mt-1">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    DRAFT: "bg-gray-500/20 text-gray-300",
    SENT: "bg-yellow-500/20 text-yellow-400",
    ACTIVE: "bg-blue-500/20 text-blue-400",
    COMPLETED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        colorMap[status] ?? "bg-white/10"
      }`}
    >
      {status}
    </span>
  );
}
