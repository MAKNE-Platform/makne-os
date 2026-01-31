"use client";

export function SystemPayoutActions({
  payoutId,
  status,
}: {
  payoutId: string;
  status: "REQUESTED" | "PROCESSING" | "COMPLETED" | "FAILED";
}) {
  async function handleAction(action: string) {
    await fetch(`/api/system/payouts/${payoutId}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-makne-system-key":
          process.env.NEXT_PUBLIC_MAKNE_SYSTEM_KEY!,
      },
      body: JSON.stringify({ action }),
    });

    window.location.reload();
  }

  return (
    <div className="flex gap-2">
      {status === "REQUESTED" && (
        <button
          onClick={() => handleAction("PROCESS")}
          className="rounded-md bg-gray-100 px-3 py-1 text-xs"
        >
          Process
        </button>
      )}

      {status === "PROCESSING" && (
        <>
          <button
            onClick={() => handleAction("COMPLETE")}
            className="rounded-md bg-emerald-100 px-3 py-1 text-xs text-emerald-700"
          >
            Complete
          </button>
          <button
            onClick={() => handleAction("FAIL")}
            className="rounded-md bg-red-100 px-3 py-1 text-xs text-red-700"
          >
            Fail
          </button>
        </>
      )}

      {status === "COMPLETED" && (
        <span className="text-xs text-emerald-600">
          Completed
        </span>
      )}

      {status === "FAILED" && (
        <span className="text-xs text-red-600">
          Failed
        </span>
      )}
    </div>
  );
}
