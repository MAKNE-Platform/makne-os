import mongoose from "mongoose";
import { Agreement } from "@/lib/db/models/Agreement";
import { logAudit } from "@/lib/audit/logAudit";

/**
 * Domain-level agreement send
 * This MUST be the single source of truth
*/
console.log("🔥 DOMAIN sendAgreement FILE LOADED 🔥");
export async function sendAgreement({
  agreementId,
  brandId,
  creatorId,
  creatorEmail,
}: {
  agreementId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  creatorEmail: string;
}) {

    console.log("🔥 sendAgreement FUNCTION CALLED 🔥");

  // 1️⃣ Core mutation (same as your current route)
  await Agreement.findByIdAndUpdate(agreementId, {
    creatorId,
    creatorEmail,
    status: "SENT",
    $push: {
      activity: {
        message: "Agreement sent to creator",
        createdAt: new Date(),
      },
    },
  });

  // 2️⃣ Side-effect: audit log (notifications depend on this)
  await logAudit({
    actorType: "BRAND",
    actorId: brandId,
    action: "AGREEMENT_SENT",
    entityType: "AGREEMENT",
    entityId: agreementId,
    metadata: {
      creatorId: creatorId.toString(),
      brandId: brandId.toString(),
    },
  });
}
