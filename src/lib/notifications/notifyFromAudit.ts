import mongoose from "mongoose";
import { createNotification } from "./createNotification";

export async function notifyFromAudit({
  action,
  actorType,
  entityType,
  entityId,
  metadata,
}: {
  action: string;
  actorType: string;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
}) {
  // MVP: handle only key events

  console.log("NOTIFY FROM AUDIT:", {
  action,
  actorType,
  entityType,
  entityId,
  metadata,
});

  switch (action) {
    case "PAYOUT_REQUESTED":
      // Notify system later (skip for now)
      break;

    case "PAYOUT_COMPLETED":
      if (metadata?.creatorId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(
            metadata.creatorId
          ),
          role: "CREATOR",
          title: "Payout completed",
          message: `₹${metadata.amount} has been sent to you`,
          entityType,
          entityId,
        });
      }
      break;

    case "PAYMENT_RELEASED":
      if (metadata?.creatorId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(
            metadata.creatorId
          ),
          role: "CREATOR",
          title: "Payment released",
          message: "A milestone payment was released",
          entityType,
          entityId,
        });
      }
      break;

    default:
      break;
  }
}
