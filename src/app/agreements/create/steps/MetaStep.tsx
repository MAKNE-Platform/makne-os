type MetaValue = {
  title: string;
  description?: string;
  category: string;
};

export default function MetaStep({
  value,
  onChange,
}: {
  value: MetaValue | null;
  onChange: (v: MetaValue) => void;
}) {
  const current: MetaValue = value ?? {
    title: "",
    description: "",
    category: "",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Agreement details
        </h2>
        <p className="text-sm text-neutral-500">
          Define the basic information about this agreement.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Title
        </label>
        <input
          value={current.title}
          onChange={(e) =>
            onChange({ ...current, title: e.target.value })
          }
          placeholder="e.g. Instagram collaboration"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Description
        </label>
        <textarea
          value={current.description}
          onChange={(e) =>
            onChange({
              ...current,
              description: e.target.value,
            })
          }
          placeholder="Optional description"
          rows={3}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Category
        </label>
        <input
          value={current.category}
          onChange={(e) =>
            onChange({
              ...current,
              category: e.target.value,
            })
          }
          placeholder="e.g. Sponsorship"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>
    </div>
  );
}
