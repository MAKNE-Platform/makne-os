import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Notification } from "@/lib/db/models/Notification";
import { Agreement } from "@/lib/db/models/Agreement";
import { Payment } from "@/lib/db/models/Payment";

import BrandSidebar from "@/components/brand/BrandSidebar";
import MobileTopNav from "@/components/dashboard/MobileTopNav";
import SystemActivityClient from "./SystemActivityClient";

type BrandProfileType = {
  brandName: string;
  industry: string;
  location?: string;
};

export default async function SystemActivityPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  /* ================= BRAND ================= */

  const brandProfile = (await BrandProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean()) as BrandProfileType | null;

  if (!brandProfile) {
    redirect("/onboarding/brand");
  }

  const brandObjectId = new mongoose.Types.ObjectId(userId);

  /* ================= AUDIT LOGS ================= */

  const logs = await AuditLog.find({
    "metadata.brandId": userId,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean<{
      _id: mongoose.Types.ObjectId;
      action: string;
      actorType: string;
      actorId?: mongoose.Types.ObjectId;
      entityType: string;
      entityId: mongoose.Types.ObjectId;
      metadata?: any;
      createdAt: Date;
    }[]>();

  const serializedLogs = logs.map((log) => ({
    id: log._id.toString(),
    action: log.action,
    actorType: log.actorType,
    actorId: log.actorId ? log.actorId.toString() : null,
    entityType: log.entityType,
    entityId: log.entityId.toString(),
    metadata: log.metadata ?? null,
    createdAt: log.createdAt.toISOString(),
  }));

  /* ================= COUNTS (SHARED) ================= */

  // Inbox = unread notifications + submitted deliverables
  const unreadNotifications = await Notification.countDocuments({
    userId: brandObjectId,
    role: "BRAND",
    readAt: { $exists: false },
  });

  const pendingDeliverables = await AuditLog.countDocuments({
    action: "DELIVERABLE_SUBMITTED",
    "metadata.brandId": userId,
  });

  const inboxCount = unreadNotifications + pendingDeliverables;

  // Draft agreements
  const draftAgreementsCount = await Agreement.countDocuments({
    brandId: brandObjectId,
    status: "DRAFT",
  });

  // Pending payments
  const pendingPaymentsCount = await Payment.countDocuments({
    brandId: brandObjectId,
    status: { $in: ["PENDING", "INITIATED"] },
  });

  /* ================= UI ================= */

  return (
    <div className="lg:px-0 px-2">
      {/* ================= MOBILE NAV ================= */}
      <MobileTopNav
        brandName={brandProfile.brandName}
        industry={brandProfile.industry}
        pendingPaymentsCount={pendingPaymentsCount}
        inboxCount={inboxCount}
        draftAgreementsCount={draftAgreementsCount}
      />

      <div className="flex min-h-screen bg-black text-white">
        {/* ================= SIDEBAR ================= */}
        <BrandSidebar
          active="activity"
          brandProfile={brandProfile}
          inboxCount={inboxCount}
          draftAgreementsCount={draftAgreementsCount}
          pendingPaymentsCount={pendingPaymentsCount}
        />

        {/* ================= MAIN ================= */}
        <main className="flex-1 overflow-y-auto">
          <SystemActivityClient logs={serializedLogs} />
        </main>
      </div>
    </div>
  );
}
