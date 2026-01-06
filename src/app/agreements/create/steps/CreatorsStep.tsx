import { useState } from "react";

type Creator = {
  creatorId: string;
};

export default function CreatorsStep({
  value,
  onChange,
}: {
  value: Creator[];
  onChange: (v: Creator[]) => void;
}) {
  const [input, setInput] = useState("");

  function addCreator() {
    if (!input.trim()) return;
    onChange([...value, { creatorId: input.trim() }]);
    setInput("");
  }

  function removeCreator(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Creators
        </h2>
        <p className="text-sm text-neutral-500">
          Add one or more creators involved in this agreement.
        </p>
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Creator ID"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <button
          onClick={addCreator}
          className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((creator, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm"
            >
              {creator.creatorId}
              <button
                onClick={() => removeCreator(index)}
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
