"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

export default function CreatorDecisionPanel({
    agreementId,
}: {
    agreementId: string;
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [reason, setReason] = useState("");

    function accept() {
        setError(null);

        startTransition(async () => {
            const res = await fetch("/api/agreements/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agreementId }),
            });

            if (!res.ok) {
                let errorMessage = "Failed to accept agreement";

                try {
                    const data = await res.json();
                    if (data?.error) {
                        errorMessage = data.error;
                    }
                } catch { }

                setError(errorMessage);
            } else {
                const router = useRouter();
                router.refresh();
            }

        });
    }

    function reject() {
        if (!reason.trim()) {
            setError("Please provide a reason for rejection.");
            return;
        }

        setError(null);

        startTransition(async () => {
            const res = await fetch("/api/agreements/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agreementId,
                    reason,
                }),
            });

            if (!res.ok) {
                let errorMessage = "Failed to reject agreement";

                try {
                    const data = await res.json();
                    if (data?.error) {
                        errorMessage = data.error;
                    }
                } catch {
                    // no JSON body
                }

                setError(errorMessage);
            } else {
                const router = useRouter();
                router.refresh();
            }

        });
    }

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">
                Your Decision
            </h3>

            {error && (
                <div className="text-xs text-red-600">
                    {error}
                </div>
            )}

            {!showRejectReason ? (
                <div className="flex gap-3">
                    <button
                        disabled={isPending}
                        onClick={accept}
                        className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {isPending ? "Accepting..." : "Accept"}
                    </button>

                    <button
                        disabled={isPending}
                        onClick={() => setShowRejectReason(true)}
                        className="px-4 py-2 rounded-md border text-sm disabled:opacity-50 cursor-pointer"
                    >
                        Reject
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason for rejection"
                        className="w-full border rounded-md p-2 text-sm"
                        rows={3}
                    />

                    <div className="flex gap-2">
                        <button
                            disabled={isPending}
                            onClick={reject}
                            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm disabled:opacity-50"
                        >
                            {isPending ? "Rejecting..." : "Confirm Reject"}
                        </button>

                        <button
                            disabled={isPending}
                            onClick={() => {
                                setShowRejectReason(false);
                                setReason("");
                            }}
                            className="px-4 py-2 rounded-md border text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
