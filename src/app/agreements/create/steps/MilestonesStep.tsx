import { useState } from "react";

type Milestone = {
  name: string;
  unlockRule: "ALL_COMPLETED" | "ANY_COMPLETED";
  deliverableIndexes: number[];
};

export default function MilestonesStep({
  deliverables,
  value,
  onChange,
}: {
  deliverables: { name: string }[];
  value: Milestone[];
  onChange: (v: Milestone[]) => void;
}) {
  const [draft, setDraft] = useState<Milestone>({
    name: "",
    unlockRule: "ALL_COMPLETED",
    deliverableIndexes: [],
  });

  function toggleDeliverable(index: number) {
    setDraft((prev) => ({
      ...prev,
      deliverableIndexes: prev.deliverableIndexes.includes(index)
        ? prev.deliverableIndexes.filter((i) => i !== index)
        : [...prev.deliverableIndexes, index],
    }));
  }

  function addMilestone() {
    if (
      !draft.name.trim() ||
      draft.deliverableIndexes.length === 0
    )
      return;

    onChange([...value, draft]);
    setDraft({
      name: "",
      unlockRule: "ALL_COMPLETED",
      deliverableIndexes: [],
    });
  }

  function removeMilestone(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Milestones
        </h2>
        <p className="text-sm text-neutral-500">
          Group deliverables into milestones that unlock
          payments.
        </p>
      </div>

      <input
        placeholder="Milestone name"
        value={draft.name}
        onChange={(e) =>
          setDraft({ ...draft, name: e.target.value })
        }
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />

      <div className="flex gap-6 text-sm text-neutral-700">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={draft.unlockRule === "ALL_COMPLETED"}
            onChange={() =>
              setDraft({
                ...draft,
                unlockRule: "ALL_COMPLETED",
              })
            }
          />
          All deliverables completed
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={draft.unlockRule === "ANY_COMPLETED"}
            onChange={() =>
              setDraft({
                ...draft,
                unlockRule: "ANY_COMPLETED",
              })
            }
          />
          Any deliverable completed
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-neutral-700">
          Link deliverables
        </p>

        {deliverables.map((d, index) => (
          <label
            key={index}
            className="flex items-center gap-2 text-sm text-neutral-700"
          >
            <input
              type="checkbox"
              checked={draft.deliverableIndexes.includes(index)}
              onChange={() => toggleDeliverable(index)}
            />
            {d.name}
          </label>
        ))}
      </div>

      <button
        onClick={addMilestone}
        className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm"
      >
        Add milestone
      </button>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((m, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm"
            >
              <span>
                <strong>{m.name}</strong> (
                {m.unlockRule}) —{" "}
                {m.deliverableIndexes.length}{" "}
                deliverables
              </span>
              <button
                onClick={() => removeMilestone(index)}
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
