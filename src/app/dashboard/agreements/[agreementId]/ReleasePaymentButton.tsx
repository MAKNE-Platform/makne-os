"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ReleasePaymentButton({
  agreementId,
  milestoneId,
  amount,
}: {
  agreementId: string;
  milestoneId: string;
  amount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={isPending}
      className="px-3 py-1 rounded-md border hover:bg-muted disabled:opacity-50"
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/payments/release", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              agreementId,
              milestoneId,
              amount,
            }),
            cache: "no-store", // 🔒 IMPORTANT
          });

          // ✅ THIS triggers server re-render
          router.refresh();
        });
      }}
    >
      {isPending ? "Releasing..." : "Release"}
    </button>
  );
}
