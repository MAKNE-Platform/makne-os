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
    case "AGREEMENT_SENT": {
      if (!metadata?.creatorId) break;

      const appUrl = process.env.APP_URL;
      if (!appUrl) break;

      await createNotification({
        userId: new mongoose.Types.ObjectId(metadata.creatorId),
        role: "CREATOR",
        title: "New agreement received",
        message: "A brand has sent you a new agreement.",
        entityType,
        entityId,
      });

      // 📧 Email to creator
      await sendEmail({
        to: metadata.creatorEmail, // IMPORTANT: see note below
        subject: "[MAKNE] You received a new agreement",
        text: `
You have received a new agreement from a brand.

👉 View agreement:
${appUrl}/agreements/${entityId.toString()}
    `.trim(),
      });

      break;
    }

    // Brand approved milestone
    case "MILESTONE_APPROVED": {
      // 🔔 Creator in-app notification
      if (metadata?.creatorId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.creatorId),
          role: "CREATOR",
          title: "Deliverable approved",
          message: metadata.milestoneTitle
            ? `Your deliverable for "${metadata.milestoneTitle}" was approved`
            : "Your deliverable was approved",
          entityType,
          entityId,
        });
      }

      // 📧 Creator email - Brand approved milestone
      if (metadata?.creatorEmail && metadata?.milestoneTitle) {
        const appUrl = process.env.APP_URL;
        if (appUrl) {
          await sendEmail({
            to: metadata.creatorEmail,
            subject: "[MAKNE] Deliverable approved 🎉",
            text: `
Good news!

Your deliverable for the milestone "${metadata.milestoneTitle}" has been approved by the brand.

👉 View agreement:
${appUrl}/agreements/${metadata.agreementId ?? ""}

Keep going 🚀
        `.trim(),
          });
        }
      }

      break;
    }

    case "MILESTONE_REVISION_REQUESTED": {
      // 🔔 Creator in-app notification
      if (metadata?.creatorId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.creatorId),
          role: "CREATOR",
          title: "Changes requested",
          message: metadata.milestoneTitle
            ? `Changes were requested for "${metadata.milestoneTitle}"`
            : "Changes were requested for a milestone",
          entityType,
          entityId,
        });
      }

      // 📧 Creator email
      if (metadata?.creatorEmail && metadata?.milestoneTitle) {
        const appUrl = process.env.APP_URL;
        if (appUrl) {
          await sendEmail({
            to: metadata.creatorEmail,
            subject: "[MAKNE] Changes requested for your deliverable",
            text: `
The brand has requested changes for your deliverable.

Milestone: ${metadata.milestoneTitle}

👉 Review & resubmit:
${appUrl}/agreements/${metadata.agreementId ?? ""}

Please update and resubmit when ready.
        `.trim(),
          });
        }
      }

      break;
    }


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
    case "AGREEMENT_ACCEPTED": {
      // 🔔 Brand in-app notification
      if (metadata?.brandId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.brandId),
          role: "BRAND",
          title: "Agreement accepted",
          message: "A creator has accepted your agreement",
          entityType,
          entityId,
        });
      }

      // 📧 Brand email
      if (metadata?.brandEmail) {
        const appUrl = process.env.APP_URL;
        if (appUrl) {
          await sendEmail({
            to: metadata.brandEmail,
            subject: "[MAKNE] Agreement accepted 🎉",
            text: `
Good news!

A creator has accepted your agreement and work can now begin.

👉 View agreement:
${appUrl}/agreements/${entityId.toString()}

You're all set to move forward 🚀
        `.trim(),
          });
        }
      }

      break;
    }

    case "AGREEMENT_REJECTED": {
      // 🔔 Brand in-app notification
      if (metadata?.brandId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.brandId),
          role: "BRAND",
          title: "Agreement rejected",
          message: "A creator has rejected your agreement",
          entityType,
          entityId,
        });
      }

      // 📧 Brand email
      if (metadata?.brandEmail) {
        const appUrl = process.env.APP_URL;
        if (appUrl) {
          await sendEmail({
            to: metadata.brandEmail,
            subject: "[MAKNE] Agreement rejected",
            text: `
The creator has rejected your agreement.

You may review the agreement, update terms, and resend it if needed.

👉 View agreement:
${appUrl}/agreements/${entityId.toString()}
        `.trim(),
          });
        }
      }

      break;
    }



    // Creator submitted deliverable
    case "DELIVERABLE_SUBMITTED": {
      // 🔔 Brand in-app notification
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

      // 📧 Brand email notification
      if (metadata?.brandEmail && metadata?.milestoneTitle) {
        const appUrl = process.env.APP_URL;

        if (appUrl) {
          await sendEmail({
            to: metadata.brandEmail,
            subject: "[MAKNE] Deliverable submitted",
            text: `
A creator has submitted work for a milestone.

Milestone: ${metadata.milestoneTitle}

👉 Review submission:
${appUrl}/agreements/${metadata.agreementId ?? ""}
        `.trim(),
          });
        }
      }

      break;
    }


    /* ---------------------------------
     * INTENTIONALLY SILENT EVENTS
     * --------------------------------- */

    // Creator requesting payout → no notification (self-initiated)
    case "PAYOUT_REQUESTED":
      break;

    case "PAYMENT_INITIATED": {
      const adminEmail = process.env.ADMIN_EMAIL;
      const appUrl = process.env.APP_URL;

      if (!adminEmail || !appUrl) break;

      const systemUrl = `${appUrl}/system/payments`;

      await sendEmail({
        to: adminEmail,
        subject: "[MAKNE] Payment initiated – action required",
        text: `
A payment has been initiated and is waiting for release.

Amount: ₹${metadata?.amount}
Agreement ID: ${metadata?.agreementId}
Creator ID: ${metadata?.creatorId}

👉 Release payment:
${systemUrl}

(If you are running locally, make sure the app is running.)
    `.trim(),
      });

      break;
    }



    default:
      break;
  }
}
