"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Props = {
  payments: any[];
  agreementMap: Record<string, string>;
  creatorMap: Record<string, string>;
};

export default function BrandPaymentsTable({
  payments,
  agreementMap,
  creatorMap,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const creatorEmail =
        creatorMap[p.creatorId?.toString()] ?? "";

      const matchesSearch = creatorEmail
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter, creatorMap]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#ffffff05] backdrop-blur-xl overflow-hidden">

      {/* ===== FILTER BAR ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b border-white/10">

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", "RELEASED", "PENDING", "FAILED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs rounded-full border transition
                ${
                  statusFilter === status
                    ? "bg-[#636EE1] text-black border-[#636EE1]"
                    : "border-white/20 text-white/60 hover:border-white/40"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-white/40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creator..."
            className="w-full rounded-lg bg-black border border-white/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#636EE1]"
          />
        </div>
      </div>

      {/* ===== TABLE HEADER (DESKTOP) ===== */}
      <div className="hidden lg:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-xs uppercase tracking-wider text-white/50 border-b border-white/10">
        <div>Agreement</div>
        <div>Creator</div>
        <div>Amount</div>
        <div>Status</div>
        <div>Date</div>
      </div>

      {/* ===== TABLE BODY ===== */}
      {filteredPayments.length === 0 && (
        <div className="px-6 py-8 text-sm text-white/50">
          No matching payments found.
        </div>
      )}

      {filteredPayments.map((p) => {
        const agreementTitle =
          agreementMap[p.agreementId?.toString()] ?? "—";

        const creatorEmail =
          creatorMap[p.creatorId?.toString()] ?? "—";

        return (
          <div
            key={p._id.toString()}
            className="border-b border-white/5 hover:bg-white/5 transition"
          >

            {/* Desktop */}
            <div className="hidden lg:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-5 text-sm items-center">

              <div className="truncate font-medium">
                {agreementTitle}
              </div>

              <div className="truncate text-white/70">
                {creatorEmail}
              </div>

              <div className="font-semibold">
                ₹ {p.amount.toLocaleString()}
              </div>

              <StatusPill status={p.status} />

              <div className="text-xs text-white/50">
                {new Date(p.createdAt).toDateString()}
              </div>

            </div>

            {/* Mobile */}
            <div className="lg:hidden px-6 py-4 space-y-3 text-sm">

              <div className="font-medium">
                {agreementTitle}
              </div>

              <div className="text-xs text-white/60">
                {creatorEmail}
              </div>

              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  ₹ {p.amount.toLocaleString()}
                </div>

                <StatusPill status={p.status} />
              </div>

              <div className="text-xs text-white/50">
                {new Date(p.createdAt).toDateString()}
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const base =
    "inline-flex w-max items-center rounded-full border px-3 py-1 text-xs font-medium";

  const style =
    status === "RELEASED"
      ? "bg-[#636EE1]/10 text-[#636EE1] border-[#636EE1]/40"
      : status === "FAILED"
      ? "bg-red-500/10 text-red-400 border-red-500/30"
      : "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";

  return <span className={`${base} ${style}`}>{status}</span>;
}