import mongoose from "mongoose";
import { createNotification } from "./createNotification";
import { sendEmail } from "@/lib/email/sendEmail";
import { BrandProfile } from "../db/models/BrandProfile";


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

      if (!appUrl) {
        console.error("APP_URL is not defined");
        break;
      }


      const agreementTitle = metadata.agreementTitle ?? "Untitled agreement";
      let brandName = metadata?.brandName;

      if (!brandName && metadata?.brandId) {
        const brandProfile = (await BrandProfile.findOne({
          userId: metadata.brandId,
        }).lean()) as any;

        brandName = brandProfile?.brandName;
      }

      brandName = brandName ?? "Brand";


      await createNotification({
        userId: new mongoose.Types.ObjectId(metadata.creatorId),
        role: "CREATOR",
        title: "New Agreement",
        message: `You received "${agreementTitle}" from ${brandName}.`,
        entityType,
        entityId,
      });

      await sendEmail({
        to: metadata.creatorEmail,
        subject: `[MAKNE] New agreement from ${brandName}`,
        text: `
You have received a new agreement titled:

"${agreementTitle}"

From: ${brandName}

👉 View agreement:
${appUrl}/agreements/${entityId.toString()}
    `.trim(),
      });

      break;
    }


    // Brand approved milestone
    case "MILESTONE_APPROVED": {
      // Creator in-app notification
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
      if (!metadata?.creatorId) break;

      const milestoneTitle = metadata.milestoneTitle ?? "a milestone";
      const brandName = metadata.brandName ?? "the brand";

      await createNotification({
        userId: new mongoose.Types.ObjectId(metadata.creatorId),
        role: "CREATOR",
        title: "Revision requested",
        message: `${brandName} requested changes for "${milestoneTitle}".`,
        entityType,
        entityId,
      });

      if (metadata?.creatorEmail) {
        const appUrl = process.env.APP_URL;
        if (appUrl) {
          await sendEmail({
            to: metadata.creatorEmail,
            subject: "[MAKNE] Revision requested",
            text: `
${brandName} has requested changes for:

"${milestoneTitle}"

👉 Review & resubmit:
${appUrl}/agreements/${metadata.agreementId ?? ""}
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
      const agreementTitle = metadata?.agreementTitle ?? "your agreement";
      const creatorName = metadata?.creatorName ?? "A creator";

      // 🔔 Brand in-app notification
      if (metadata?.brandId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.brandId),
          role: "BRAND",
          title: "Agreement accepted",
          message: `${creatorName} accepted "${agreementTitle}".`,
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
            subject: `[MAKNE] ${creatorName} accepted your agreement`,
            text: `
Great news!

${creatorName} has accepted:

"${agreementTitle}"

👉 View agreement:
${appUrl}/agreements/${entityId.toString()}
        `.trim(),
          });
        }
      }

      break;
    }

    case "AGREEMENT_REJECTED": {
      const agreementTitle = metadata?.agreementTitle ?? "your agreement";
      const creatorName = metadata?.creatorName ?? "The creator";

      if (metadata?.brandId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.brandId),
          role: "BRAND",
          title: "Agreement rejected",
          message: `${creatorName} rejected "${agreementTitle}".`,
          entityType,
          entityId,
        });
      }

      if (metadata?.brandEmail) {
        const appUrl = process.env.APP_URL;
        if (appUrl) {
          await sendEmail({
            to: metadata.brandEmail,
            subject: "[MAKNE] Agreement rejected",
            text: `
${creatorName} rejected:

"${agreementTitle}"

You may revise and resend it.

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
      const milestoneTitle = metadata?.milestoneTitle ?? "a milestone";
      const creatorName = metadata?.creatorName ?? "A creator";

      if (metadata?.brandId) {
        await createNotification({
          userId: new mongoose.Types.ObjectId(metadata.brandId),
          role: "BRAND",
          title: "Deliverable submitted",
          message: `${creatorName} submitted work for "${milestoneTitle}".`,
          entityType,
          entityId,
        });
      }

      if (metadata?.brandEmail) {
        const appUrl = process.env.APP_URL;
        if (appUrl) {
          await sendEmail({
            to: metadata.brandEmail,
            subject: "[MAKNE] Deliverable submitted",
            text: `
${creatorName} submitted work for:

"${milestoneTitle}"

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
