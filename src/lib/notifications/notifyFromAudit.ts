import mongoose from "mongoose";
import { createNotification } from "./createNotification";
import { sendEmail } from "@/lib/email/sendEmail";


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
  // Debug (keep for now, remove later if noisy)
  console.log("NOTIFY FROM AUDIT:", {
    action,
    actorType,
    entityType,
    entityId,
    metadata,
  });

  switch (action) {
    /* ---------------------------------
     * CREATOR NOTIFICATIONS
     * --------------------------------- */

    // Brand sent an agreement to creator
    case "AGREEMENT_SENT":
      if (metadata?.creatorId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.creatorId),
          role: "CREATOR",
          title: "New agreement received",
          message: "A brand has sent you a new agreement",
          entityType,
          entityId,
        });
      }
      break;

    // Brand approved milestone
    case "MILESTONE_APPROVED":
      if (metadata?.creatorId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.creatorId),
          role: "CREATOR",
          title: "Milestone approved",
          message: metadata.milestoneTitle
            ? `Milestone "${metadata.milestoneTitle}" was approved`
            : "A milestone was approved",
          entityType,
          entityId,
        });
      }
      break;

    // System released milestone payment
    case "PAYMENT_RELEASED":
      if (metadata?.creatorId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.creatorId),
          role: "CREATOR",
          title: "Payment released",
          message: metadata.amount
            ? `₹${metadata.amount} has been released to your balance`
            : "A milestone payment was released",
          entityType,
          entityId,
        });
      }
      break;

    // System completed payout
    case "PAYOUT_COMPLETED":
      if (metadata?.creatorId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.creatorId),
          role: "CREATOR",
          title: "Payout completed",
          message: metadata.amount
            ? `₹${metadata.amount} has been sent to you`
            : "Your payout has been completed",
          entityType,
          entityId,
        });
      }
      break;

    /* ---------------------------------
     * BRAND NOTIFICATIONS
     * --------------------------------- */

    // Creator accepted agreement
    case "AGREEMENT_ACCEPTED":
      if (metadata?.brandId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.brandId),
          role: "BRAND",
          title: "Agreement accepted",
          message: "A creator accepted your agreement",
          entityType,
          entityId,
        });
      }
      break;

    // Creator submitted deliverable
    case "DELIVERABLE_SUBMITTED":
      if (metadata?.brandId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.brandId),
          role: "BRAND",
          title: "Deliverable submitted",
          message: metadata.milestoneTitle
            ? `Deliverable submitted for "${metadata.milestoneTitle}"`
            : "A deliverable was submitted",
          entityType,
          entityId,
        });
      }
      break;

    /* ---------------------------------
     * INTENTIONALLY SILENT EVENTS
     * --------------------------------- */

    // Creator requesting payout → no notification (self-initiated)
    case "PAYOUT_REQUESTED":
      break;

    case "PAYMENT_INITIATED": {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) break;

      await sendEmail({
        to: adminEmail,
        subject: "[MAKNE] Payment initiated – action required",
        text: `
A payment has been initiated and is waiting for release.

Amount: ₹${metadata?.amount}
Agreement ID: ${metadata?.agreementId}
Creator ID: ${metadata?.creatorId}

Please run the payment processor from the system dashboard.
    `.trim(),
      });

      break;
    }


    default:
      break;
  }
}
