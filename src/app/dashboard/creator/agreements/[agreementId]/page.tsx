import { notFound, redirect } from "next/navigation";
import { loadEvents } from "@/core/events/dispatcher";
import { projectAgreement } from "@/core/agreements/read-model";
import { reduceAgreement } from "@/core/agreements/aggregate";
import { deriveAgreementState } from "@/core/agreements/state";
import CreatorDecisionPanel from "./CreatorDecisionPanel";

import { getCurrentUser } from "@/core/auth/contract";

export default async function CreatorAgreementDetailsPage({
  params,
}: {
  params: { agreementId: string };
}) {
  const user = await getCurrentUser();

  // ✅ BUILD-SAFE AUTH GUARD
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CREATOR") {
    redirect("/dashboard");
  }

  const creatorId = user.userId;
  const { agreementId } = params;

  const events = await loadEvents(agreementId);

  if (!events || events.length === 0) {
    notFound();
  }

  const summary = projectAgreement(events);
  const state = reduceAgreement(events);
  const agreementState = deriveAgreementState(
    events.map((e) => ({ type: e.type }))
  );

  // 🔒 Creator must be assigned
  if (!summary.participants.includes(creatorId)) {
    notFound();
  }

  return (
    <div className="max-w-[900px] mx-auto p-6 space-y-10">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {summary.title}
        </h1>

        {state.status === "REJECTED" ? (
          <p className="text-sm text-neutral-600">
            You chose not to proceed with this agreement.
          </p>
        ) : state.acceptedByCreators.includes(creatorId) ? (
          <p className="text-sm text-neutral-600">
            You’ve accepted this agreement. You’ll be notified
            when it becomes active.
          </p>
        ) : (
          <p className="text-sm text-neutral-600">
            You’ve been invited to collaborate on this agreement.
            Please review the details below before responding.
          </p>
        )}

        <div className="text-sm">
          Status:{" "}
          <span className="font-medium">
            {state.status === "REJECTED"
              ? "Rejected"
              : agreementState}
          </span>
        </div>
      </section>

      {/* Milestones */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Milestones</h2>

        {Object.values(state.milestones).length === 0 ? (
          <p className="text-sm text-neutral-500">
            No milestones defined.
          </p>
        ) : (
          <ul className="border rounded-lg divide-y text-sm">
            {Object.values(state.milestones).map((m: any) => {
              const creatorStatus =
                m.status === "COMPLETED" || m.status === "RELEASED"
                  ? "Completed"
                  : m.status === "BLOCKED"
                  ? "Blocked"
                  : "Pending";

              return (
                <li
                  key={`milestone-${m.id}`}
                  className="px-4 py-3 flex justify-between"
                >
                  <span>{m.name}</span>
                  <span className="text-neutral-500">
                    {creatorStatus}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Payment */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Payment</h2>

        {!state.payment ? (
          <p className="text-sm text-neutral-500">
            Payment terms have not been defined yet.
          </p>
        ) : (
          <div className="border rounded-lg p-4 text-sm space-y-2">
            <div>
              Total payout:{" "}
              <strong>
                {state.payment.currency}{" "}
                {state.payment.totalAmount}
              </strong>
            </div>

            <div className="text-neutral-600">
              {Object.keys(state.milestones).length > 1
                ? "Payment will be released as milestones are completed."
                : "Payment will be released after final milestone completion."}
            </div>
          </div>
        )}
      </section>

      {/* Participants */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Participants</h2>

        <ul className="border rounded-lg divide-y text-sm">
          {summary.participants.map((id) => {
            let statusLabel = "Pending";
            let statusClass = "text-neutral-500";

            if (state.acceptedByCreators.includes(id)) {
              statusLabel = "Accepted";
              statusClass = "text-green-600";
            }

            if (state.status === "REJECTED" && id === creatorId) {
              statusLabel = "Rejected";
              statusClass = "text-red-600";
            }

            return (
              <li
                key={`participant-${id}`}
                className="px-4 py-2 flex justify-between"
              >
                <span>{id === creatorId ? "You" : id}</span>
                <span className={statusClass}>{statusLabel}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Decision Panel */}
      {agreementState === "NEGOTIATING" &&
        state.status !== "REJECTED" &&
        !state.acceptedByCreators.includes(creatorId) && (
          <CreatorDecisionPanel agreementId={agreementId} />
        )}
    </div>
  );
}
