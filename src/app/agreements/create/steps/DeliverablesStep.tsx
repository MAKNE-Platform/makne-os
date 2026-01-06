import { useState } from "react";

type Deliverable = {
  name: string;
  platform: string;
  format: string;
  quantity: number;
  dueInDays: number;
  requiresApproval: boolean;
};

export default function DeliverablesStep({
  value,
  onChange,
}: {
  value: Deliverable[];
  onChange: (v: Deliverable[]) => void;
}) {
  const [draft, setDraft] = useState<Deliverable>({
    name: "",
    platform: "",
    format: "",
    quantity: 1,
    dueInDays: 7,
    requiresApproval: true,
  });

  function addDeliverable() {
    if (!draft.name.trim()) return;
    onChange([...value, draft]);
    setDraft({
      name: "",
      platform: "",
      format: "",
      quantity: 1,
      dueInDays: 7,
      requiresApproval: true,
    });
  }

  function removeDeliverable(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Deliverables
        </h2>
        <p className="text-sm text-neutral-500">
          Define what the creator is expected to deliver.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Deliverable name"
          value={draft.name}
          onChange={(e) =>
            setDraft({ ...draft, name: e.target.value })
          }
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />

        <input
          placeholder="Platform (e.g. Instagram)"
          value={draft.platform}
          onChange={(e) =>
            setDraft({
              ...draft,
              platform: e.target.value,
            })
          }
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />

        <input
          placeholder="Format (e.g. Reel, Post)"
          value={draft.format}
          onChange={(e) =>
            setDraft({
              ...draft,
              format: e.target.value,
            })
          }
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />

        <input
          type="number"
          min={1}
          placeholder="Quantity"
          value={draft.quantity}
          onChange={(e) =>
            setDraft({
              ...draft,
              quantity: Number(e.target.value),
            })
          }
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />

        <input
          type="number"
          min={1}
          placeholder="Due in days"
          value={draft.dueInDays}
          onChange={(e) =>
            setDraft({
              ...draft,
              dueInDays: Number(e.target.value),
            })
          }
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={draft.requiresApproval}
            onChange={(e) =>
              setDraft({
                ...draft,
                requiresApproval: e.target.checked,
              })
            }
          />
          Requires approval
        </label>
      </div>

      <button
        onClick={addDeliverable}
        className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm"
      >
        Add deliverable
      </button>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((d, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm"
            >
              <span>
                <strong>{d.name}</strong> — {d.quantity}{" "}
                {d.format} on {d.platform} (due in{" "}
                {d.dueInDays} days)
              </span>
              <button
                onClick={() => removeDeliverable(index)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
