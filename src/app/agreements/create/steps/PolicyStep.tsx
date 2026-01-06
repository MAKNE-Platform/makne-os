type PolicyValue = {
  cancellationAllowed: boolean;
  cancellationWindowDays?: number;
  revisionLimit: number;
  disputeResolution: "PLATFORM" | "ARBITRATION";
};

export default function PolicyStep({
  value,
  onChange,
}: {
  value: PolicyValue | null;
  onChange: (v: PolicyValue) => void;
}) {
  const current: PolicyValue = value ?? {
    cancellationAllowed: false,
    cancellationWindowDays: undefined,
    revisionLimit: 0,
    disputeResolution: "PLATFORM",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Policy
        </h2>
        <p className="text-sm text-neutral-500">
          Define cancellation, revisions, and dispute handling.
        </p>
      </div>

      {/* Cancellation */}
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={current.cancellationAllowed}
          onChange={(e) =>
            onChange({
              ...current,
              cancellationAllowed: e.target.checked,
              cancellationWindowDays: e.target.checked
                ? current.cancellationWindowDays ?? 0
                : undefined,
            })
          }
        />
        Allow cancellation
      </label>

      {current.cancellationAllowed && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Cancellation window (days)
          </label>
          <input
            type="number"
            min={0}
            value={current.cancellationWindowDays ?? 0}
            onChange={(e) =>
              onChange({
                ...current,
                cancellationWindowDays: Number(
                  e.target.value
                ),
              })
            }
            className="w-full max-w-xs rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      )}

      {/* Revisions */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Revision limit
        </label>
        <input
          type="number"
          min={0}
          value={current.revisionLimit}
          onChange={(e) =>
            onChange({
              ...current,
              revisionLimit: Number(
                e.target.value
              ),
            })
          }
          className="w-full max-w-xs rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      {/* Dispute Resolution */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-neutral-700">
          Dispute resolution
        </p>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="radio"
            checked={
              current.disputeResolution ===
              "PLATFORM"
            }
            onChange={() =>
              onChange({
                ...current,
                disputeResolution: "PLATFORM",
              })
            }
          />
          Platform managed
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="radio"
            checked={
              current.disputeResolution ===
              "ARBITRATION"
            }
            onChange={() =>
              onChange({
                ...current,
                disputeResolution:
                  "ARBITRATION",
              })
            }
          />
          External arbitration
        </label>
      </div>
    </div>
  );
}
