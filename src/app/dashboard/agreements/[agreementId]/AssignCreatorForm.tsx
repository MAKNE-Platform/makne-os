"use client";

import { useState, useTransition } from "react";

export default function AssignCreatorForm({
  agreementId,
}: {
  agreementId: string;
}) {
  const [creatorId, setCreatorId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="font-medium text-sm">Assign Creator</div>

      <div className="flex gap-2">
        <input
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
          placeholder="Enter creator ID"
          className="flex-1 border rounded px-3 py-1 text-sm"
        />

        <button
          disabled={!creatorId || isPending}
          className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
          onClick={() => {
            setError(null);

            startTransition(async () => {
              const res = await fetch("/api/agreements/assign-creator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  agreementId,
                  creatorId,
                }),
              });

              if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Assignment failed");
              } else {
                setCreatorId("");
                // simple refresh to reflect new participant
                window.location.reload();
              }
            });
          }}
        >
          {isPending ? "Assigning..." : "Assign"}
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-600">{error}</div>
      )}
    </div>
  );
}
