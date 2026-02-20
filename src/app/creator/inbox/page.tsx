export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { Notification } from "@/lib/db/models/Notification";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { Agreement } from "@/lib/db/models/Agreement";
import { Payment } from "@/lib/db/models/Payment";
import { User } from "@/lib/db/models/User";
import { InboxRead } from "@/lib/db/models/InboxRead";

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorInboxClient from "./CreatorInboxClient";
import { log } from "console";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";

export default async function CreatorInboxPage() {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("auth_session")?.value;
  const role = (await cookieStore).get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  const creatorObjectId = new mongoose.Types.ObjectId(userId);

  const creatorProfile = await CreatorProfile
    .findOne({ userId })
    .lean<{ profileImage?: string; displayName?: string }>();

  const user = await User.findById(userId).lean<{ email: string }>();
  if (!user) redirect("/auth/login");

  /* ================= FETCH ================= */

  const notifications = await Notification.find({
    userId: creatorObjectId,
    role: "CREATOR",
  }).lean();

  // ✅ Only logs relevant to this creator
  const auditLogs = await AuditLog.find({
    "metadata.creatorId": creatorObjectId,
  }).lean();

  const pendingPayments = await Payment.find({
    creatorId: creatorObjectId,
    status: { $in: ["PENDING", "INITIATED"] },
  }).lean();

  const readEntries = await InboxRead.find({
    userId: creatorObjectId,
  }).lean();

  const readIds = new Set(readEntries.map((r: any) => r.itemId));

  /* ================= COLLECT BRAND IDS ================= */

  const auditBrandIds = auditLogs
    .map((log: any) => log.metadata?.brandId?.toString())
    .filter(Boolean);

  const paymentAgreementIds = pendingPayments
    .map((p: any) => p.agreementId?.toString())
    .filter(Boolean);

  /* ================= FETCH AGREEMENTS FOR PAYMENTS ================= */

  const agreements = await Agreement.find({
    _id: { $in: paymentAgreementIds },
  }).lean();

  const agreementMap = new Map(
    agreements.map((a: any) => [a._id.toString(), a])
  );

  const agreementBrandIds = agreements.map((a: any) =>
    a.brandId?.toString()
  );

  const allBrandIds = [
    ...new Set([...auditBrandIds, ...agreementBrandIds]),
  ];

  /* ================= FETCH BRANDS ================= */

  const brands = await User.find({
    _id: { $in: allBrandIds },
  }).lean();

  const brandMap = new Map(
    brands.map((b: any) => [
      b._id.toString(),
      b.email.split("@")[0],
    ])
  );

  /* ================= SERIALIZE ================= */

  const inboxItems = [
    // Notifications
    ...notifications.map((n: any) => ({
      id: n._id?.toString(),
      type: "notification" as const,
      title: n.title ?? "Notification",
      description: n.message ?? "",
      brandName: undefined,
      status: undefined,
      createdAt: n.createdAt?.toISOString(),
      priority: "normal" as const,
      link: `/creator/agreements`,
      read: readIds.has(n._id?.toString()),
    })),

    // Creator-relevant Audit Logs
    ...auditLogs.map((log: any) => {
      const brandId = log.metadata?.brandId?.toString();
      const brandName = brandId
        ? brandMap.get(brandId)
        : undefined;

      const isRevision =
        log.action === "REVISION_REQUESTED";

      const priority: "normal" | "urgent" =
        isRevision ? "urgent" : "normal";


      return {
        id: log._id?.toString(),
        type: "deliverable" as const,
        title: log.action.replace(/_/g, " "),
        description:
          log.metadata?.milestoneTitle ?? "",
        brandName,
        status: undefined,
        createdAt: log.createdAt?.toISOString(),
        priority,
        link: log.metadata?.agreementId
          ? `/agreements/${log.metadata.agreementId}`
          : `/creator/agreements`,
        read: readIds.has(log._id?.toString()),
      };
    }),

  ]
    .filter((item) => item.createdAt)
    .sort((a, b) => {
      const aTime = new Date(a.createdAt!).getTime();
      const bTime = new Date(b.createdAt!).getTime();
      return bTime - aTime;
    });

  const agreementsCount = await Agreement.countDocuments({
    creatorId: creatorObjectId,
  });

  const unreadNotificationsCount =
    await Notification.countDocuments({
      userId: creatorObjectId,
      role: "CREATOR",
      readAt: { $exists: false },
    });

  const pendingDeliverablesCount =
    await AuditLog.countDocuments({
      action: "DELIVERABLE_SUBMITTED",
      "metadata.creatorId": userId,
    });

  const inboxCount =
    unreadNotificationsCount + pendingDeliverablesCount;
  const pendingPaymentsCount = pendingPayments.length;

  const displayName = user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-black text-white">

      <main className="flex-1 lg:px-8 lg:py-8">
        <CreatorInboxClient items={inboxItems} />
      </main>

    </div>
  );
}
