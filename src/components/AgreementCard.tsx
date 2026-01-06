"use client";

import Link from "next/link";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import type { AgreementState } from "@/core/agreements/state";


type AgreementCardProps = {
  agreementId: string;
  title: string;
  counterparty: string;
  agreementState: AgreementState; 
  totalMilestones: number;
  completedMilestones: number;
  paymentReleased: boolean;
  paymentReceived: boolean;
};

function getAgreementLabel(state: AgreementState) {
  switch (state) {
    case "DRAFT":
    case "NEGOTIATING":
      return "In Setup";

    case "ACTIVE":
    case "EXECUTING":
      return "In Progress";

    case "PARTIALLY_COMPLETED":
      return "Almost Done";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";
  }
}



export default function AgreementCard({
  agreementId,
  title,
  counterparty,
  agreementState,
  totalMilestones,
  completedMilestones,
  paymentReleased,
  paymentReceived,
}: AgreementCardProps) {
  const progress =
    totalMilestones === 0
      ? 0
      : Math.round((completedMilestones / totalMilestones) * 100);

  const isCompleted = agreementState === "COMPLETED";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-black">
            {title}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            With {counterparty}
          </p>
        </div>

        <span
          className={`text-xs font-medium uppercase tracking-wide ${
            isCompleted ? "text-[#526BEE]" : "text-neutral-500"
          }`}
        >
          {getAgreementLabel(agreementState)}

        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {completedMilestones}/{totalMilestones} milestones
          </span>
          <span>{progress}%</span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-[#526BEE] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Payment Status */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <StatusItem label="Payment Released" active={paymentReleased} />
        <StatusItem label="Payment Received" active={paymentReceived} />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-neutral-400">
          Updated automatically
        </span>

        <Link
          href={`/agreements/${agreementId}`}
          className="flex items-center gap-1 text-sm font-medium text-[#526BEE] hover:underline"
        >
          View agreement
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function StatusItem({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {active ? (
        <CheckCircle className="h-4 w-4 text-[#526BEE]" />
      ) : (
        <Clock className="h-4 w-4 text-neutral-400" />
      )}
      <span className="text-neutral-600">{label}</span>
    </div>
  );
}
