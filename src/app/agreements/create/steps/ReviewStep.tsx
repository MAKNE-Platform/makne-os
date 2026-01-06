type ReviewProps = {
  meta: any;
  creators: any[];
  deliverables: any[];
  milestones: any[];
  policy: any;
  payment: any;
  paymentSplits: any[];
};

export default function ReviewStep({
  meta,
  creators,
  deliverables,
  milestones,
  policy,
  payment,
  paymentSplits,
}: ReviewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Review agreement
        </h2>
        <p className="text-sm text-neutral-500">
          Please review all details carefully before creating
          the agreement. You can go back to make changes.
        </p>
      </div>

      {/* Meta */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Agreement details
        </h3>
        <div className="rounded-md border border-neutral-200 p-4 text-sm space-y-1">
          <p>
            <span className="text-neutral-500">
              Title:
            </span>{" "}
            {meta?.title}
          </p>
          <p>
            <span className="text-neutral-500">
              Category:
            </span>{" "}
            {meta?.category}
          </p>
          <p>
            <span className="text-neutral-500">
              Description:
            </span>{" "}
            {meta?.description || "—"}
          </p>
        </div>
      </section>

      {/* Creators */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Creators
        </h3>
        <div className="rounded-md border border-neutral-200 p-4 text-sm">
          <ul className="list-disc list-inside space-y-1">
            {creators.map((c, i) => (
              <li key={i}>{c.creatorId}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Deliverables */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Deliverables
        </h3>
        <div className="rounded-md border border-neutral-200 p-4 text-sm space-y-2">
          {deliverables.map((d, i) => (
            <p key={i}>
              <strong>{d.name}</strong> — {d.quantity}{" "}
              {d.format} on {d.platform}, due
              in {d.dueInDays} days
            </p>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Milestones
        </h3>
        <div className="rounded-md border border-neutral-200 p-4 text-sm space-y-2">
          {milestones.map((m, i) => (
            <p key={i}>
              <strong>{m.name}</strong> (
              {m.unlockRule}) —{" "}
              {m.deliverableIndexes.length}{" "}
              deliverables linked
            </p>
          ))}
        </div>
      </section>

      {/* Policy */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Policy
        </h3>
        <div className="rounded-md border border-neutral-200 p-4 text-sm space-y-1">
          <p>
            <span className="text-neutral-500">
              Cancellation:
            </span>{" "}
            {policy.cancellationAllowed
              ? `Allowed (${policy.cancellationWindowDays} days)`
              : "Not allowed"}
          </p>
          <p>
            <span className="text-neutral-500">
              Revision limit:
            </span>{" "}
            {policy.revisionLimit}
          </p>
          <p>
            <span className="text-neutral-500">
              Dispute resolution:
            </span>{" "}
            {policy.disputeResolution}
          </p>
        </div>
      </section>

      {/* Payment */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Payment
        </h3>
        <div className="rounded-md border border-neutral-200 p-4 text-sm space-y-2">
          <p>
            <span className="text-neutral-500">
              Total amount:
            </span>{" "}
            {payment.totalAmount}{" "}
            {payment.currency}
          </p>
          <p>
            <span className="text-neutral-500">
              Release mode:
            </span>{" "}
            {payment.releaseMode}
          </p>
          <p>
            <span className="text-neutral-500">
              Escrow required:
            </span>{" "}
            {payment.escrowRequired ? "Yes" : "No"}
          </p>

          <div className="pt-2">
            <p className="text-neutral-500">
              Payment splits:
            </p>
            <ul className="list-disc list-inside">
              {paymentSplits.map((s, i) => (
                <li key={i}>
                  Milestone #{s.milestoneIndex + 1} →{" "}
                  {s.amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final note */}
      <p className="text-sm text-neutral-600">
        By clicking <strong>Create Agreement</strong>,
        this agreement will be sent for creator
        acceptance and cannot be edited unless rejected.
      </p>
    </div>
  );
}
