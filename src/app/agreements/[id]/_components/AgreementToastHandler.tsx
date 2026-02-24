"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function AgreementToastHandler({
  status,
}: {
  status: string | null;
}) {
  useEffect(() => {
    if (!status) return;

    switch (status) {
      case "AGREEMENT_SENT":
        toast.success("Agreement sent to creator 🚀");
        break;

      case "AGREEMENT_ACCEPTED":
        toast.success("Agreement accepted 🎉");
        break;

      case "AGREEMENT_REJECTED":
        toast.error("Agreement rejected");
        break;

      case "POLICIES_SAVED":
        toast.success("Policies updated successfully");
        break;

      case "DELIVERABLE_CREATED":
        toast.success("Deliverable added");
        break;

      case "DELIVERABLE_UPDATED":
        toast.success("Deliverable updated");
        break;

      case "DELIVERABLE_DELETED":
        toast.success("Deliverable deleted");
        break;

      case "MILESTONE_CREATED":
        toast.success("Milestone created");
        break;

      case "MILESTONE_APPROVED":
        toast.success("Milestone approved 🎉");
        break;

      case "MILESTONE_REVISION":
        toast("Revision requested", {
          description: "Creator has been notified.",
        });
        break;

      case "PAYMENT_INITIATED":
        toast.success("Payment initiated 💰");
        break;
    }
  }, [status]);

  return null;
}