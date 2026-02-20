"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

type TabType = "ALL" | "ACTIVE" | "COMPLETED" | "REJECTED";

export default function CreatorAgreementsClient({
  agreements,
  metrics,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");

  /* ================= FILTERING ================= */

  const filteredAgreements = useMemo(() => {
    if (activeTab === "ALL") return agreements;

    if (activeTab === "ACTIVE")
      return agreements.filter(
        (a) => a.status === "SENT" || a.status === "ACTIVE"
      );

    if (activeTab === "COMPLETED")
      return agreements.filter((a) => a.status === "COMPLETED");

    if (activeTab === "REJECTED")
      return agreements.filter((a) => a.status === "REJECTED");

    return agreements;
  }, [agreements, activeTab]);

  return (
    <div className="space-y-8 w-full">

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
          Agreements
        </h1>
        <div className="text-xs sm:text-sm text-white/50">
          {metrics.total} total agreements
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total" value={metrics.total} />
        <MetricCard label="Active" value={metrics.active} />
        <MetricCard label="Completed" value={metrics.completed} />
        <MetricCard label="Earnings" value={`₹${metrics.totalEarnings}`} />
      </div>


      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-2 overflow-x-auto">
        <TabButton
          label="All"
          active={activeTab === "ALL"}
          onClick={() => setActiveTab("ALL")}
        />
        <TabButton
          label="Active"
          active={activeTab === "ACTIVE"}
          onClick={() => setActiveTab("ACTIVE")}
        />
        <TabButton
          label="Completed"
          active={activeTab === "COMPLETED"}
          onClick={() => setActiveTab("COMPLETED")}
        />
        <TabButton
          label="Rejected"
          active={activeTab === "REJECTED"}
          onClick={() => setActiveTab("REJECTED")}
        />
      </div>

      {/* Table */}
      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {filteredAgreements.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-white/50">{a.brandName}</div>
              </div>
              <StatusBadge status={a.status} />
            </div>

            <div className="flex justify-between text-sm text-white/70">
              <span>Amount</span>
              <span className="font-medium text-white">₹{a.amount}</span>
            </div>

            <div className="flex justify-between text-xs text-white/50">
              <span>Updated</span>
              <span>{new Date(a.updatedAt).toDateString()}</span>
            </div>

            <Link
              href={`/agreements/${a.id}`}
              className="block w-full text-center rounded-lg bg-[#636EE1] py-2 text-sm font-medium text-black"
            >
              View Agreement
            </Link>
          </div>
        ))}

        {filteredAgreements.length === 0 && (
          <div className="text-center opacity-60 py-6">
            No agreements found.
          </div>
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block rounded-xl border border-white/10 overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-white/80">
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
            {filteredAgreements.map((a) => (
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
                  {new Date(a.updatedAt).toDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/agreements/${a.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[#636EE1]/40 bg-[#636EE1]/10 px-4 py-1.5 text-xs font-medium text-[#636EE1] hover:bg-[#636EE1] hover:text-black transition"
                  >
                    View
                    <ArrowRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function MetricCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br
          from-[#636EE1]/10
          via-transparent
          to-transparent p-5">
      <div className="text-sm opacity-60">{label}</div>
      <div className="text-xl font-medium mt-1">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    DRAFT: "bg-gray-500/10 text-gray-300",
    SENT: "bg-yellow-500/10 text-yellow-400",
    ACTIVE: "bg-blue-500/20 text-blue-300",
    COMPLETED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${colorMap[status] ?? "bg-white/10"
        }`}
    >
      {status}
    </span>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        text-sm pb-2 transition
        ${active
          ? "text-white border-b-2 border-[#636EE1]"
          : "text-white/60 hover:text-white"
        }
      `}
    >
      {label}
    </button>
  );
}
