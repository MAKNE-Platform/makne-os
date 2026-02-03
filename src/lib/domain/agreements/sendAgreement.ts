import mongoose from "mongoose";
import { Agreement } from "@/lib/db/models/Agreement";
import { logAudit } from "@/lib/audit/logAudit";
import { connectDB } from "@/lib/db/connect"; // ✅ ADD THIS

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

  // ✅ ENSURE DB CONNECTION
  await connectDB();

  // 1️⃣ Core mutation
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

  // 2️⃣ Audit log (powers activity + notifications + email)
  await logAudit({
    actorType: "BRAND",
    actorId: brandId,
    action: "AGREEMENT_SENT",
    entityType: "AGREEMENT",
    entityId: agreementId,
    metadata: {
      creatorId: creatorId.toString(),
      creatorEmail,
      brandId: brandId.toString(),
    },
  });
}
