import { useState } from "react";

type PaymentValue = {
  currency: "INR" | "USD";
  totalAmount: number;
  releaseMode: "MANUAL" | "AUTO";
  escrowRequired: boolean;
};

type PaymentSplit = {
  milestoneIndex: number;
  amount: number;
};

export default function PaymentStep({
  payment,
  splits,
  milestones,
  onPaymentChange,
  onSplitsChange,
}: {
  payment: PaymentValue | null;
  splits: PaymentSplit[];
  milestones: { name: string }[];
  onPaymentChange: (v: PaymentValue) => void;
  onSplitsChange: (v: PaymentSplit[]) => void;
}) {
  const current: PaymentValue = payment ?? {
    currency: "INR",
    totalAmount: 0,
    releaseMode: "MANUAL",
    escrowRequired: false,
  };

  const [draftSplit, setDraftSplit] =
    useState<PaymentSplit>({
      milestoneIndex: 0,
      amount: 0,
    });

  function addSplit() {
    if (draftSplit.amount <= 0) return;
    onSplitsChange([...splits, draftSplit]);
    setDraftSplit({ milestoneIndex: 0, amount: 0 });
  }

  function removeSplit(index: number) {
    onSplitsChange(
      splits.filter((_, i) => i !== index)
    );
  }

  const totalSplit = splits.reduce(
    (s, p) => s + p.amount,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Payment
        </h2>
        <p className="text-sm text-neutral-500">
          Define total payment and how it is released.
        </p>
      </div>

      {/* Payment basics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Currency
          </label>
          <select
            value={current.currency}
            onChange={(e) =>
              onPaymentChange({
                ...current,
                currency: e.target
                  .value as "INR" | "USD",
              })
            }
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Total amount
          </label>
          <input
            type="number"
            min={0}
            value={current.totalAmount}
            onChange={(e) =>
              onPaymentChange({
                ...current,
                totalAmount: Number(
                  e.target.value
                ),
              })
            }
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Release mode
          </label>
          <select
            value={current.releaseMode}
            onChange={(e) =>
              onPaymentChange({
                ...current,
                releaseMode: e.target
                  .value as "MANUAL" | "AUTO",
              })
            }
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="MANUAL">
              Manual
            </option>
            <option value="AUTO">Auto</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={current.escrowRequired}
            onChange={(e) =>
              onPaymentChange({
                ...current,
                escrowRequired:
                  e.target.checked,
              })
            }
          />
          Escrow required
        </label>
      </div>

      {/* Payment splits */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-neutral-700">
          Payment splits
        </h3>

        {milestones.length > 0 && (
          <div className="flex gap-3">
            <select
              value={draftSplit.milestoneIndex}
              onChange={(e) =>
                setDraftSplit({
                  ...draftSplit,
                  milestoneIndex: Number(
                    e.target.value
                  ),
                })
              }
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              {milestones.map((m, i) => (
                <option key={i} value={i}>
                  {m.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={0}
              placeholder="Amount"
              value={draftSplit.amount}
              onChange={(e) =>
                setDraftSplit({
                  ...draftSplit,
                  amount: Number(
                    e.target.value
                  ),
                })
              }
              className="w-32 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />

            <button
              onClick={addSplit}
              className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm"
            >
              Add
            </button>
          </div>
        )}

        {splits.length > 0 && (
          <ul className="space-y-2">
            {splits.map((s, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm"
              >
                <span>
                  {milestones[s.milestoneIndex]?.name} →{" "}
                  {s.amount}
                </span>
                <button
                  onClick={() =>
                    removeSplit(index)
                  }
                  className="text-neutral-500 hover:text-neutral-900"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm text-neutral-600">
          Total split amount:{" "}
          <strong>{totalSplit}</strong>
        </p>
      </div>
    </div>
  );
}
