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

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";
import CreatorInboxClient from "./CreatorInboxClient";

export default async function CreatorInboxPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  const creatorObjectId = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(userId).lean<{ email: string }>();
  if (!user) redirect("/auth/login");

  /* ================= FETCH ================= */

  const notifications = await Notification.find({
    userId: creatorObjectId,
    role: "CREATOR",
  }).lean();

  const revisionLogs = await AuditLog.find({
    action: "REVISION_REQUESTED",
    "metadata.creatorId": userId,
  }).lean();

  const pendingPayments = await Payment.find({
    creatorId: creatorObjectId,
    status: { $in: ["PENDING", "INITIATED"] },
  }).lean();

  /* ================= SERIALIZE ================= */

  const inboxItems = [
    // 🔔 Notifications
    ...notifications.map((n: any) => ({
      id: n._id?.toString(),
      type: "notification" as const,
      title: n.title ?? "Notification",
      description: n.message ?? "",
      createdAt: n.createdAt ? n.createdAt.toISOString() : null,
      priority: "normal" as const,
      read: !!n.readAt,
    })),

    // ⚡ Urgent revisions
    ...revisionLogs.map((log: any) => ({
      id: log._id?.toString(),
      type: "deliverable" as const,
      title: "Revision requested",
      description: "A brand requested changes on your submission.",
      createdAt: log.createdAt ? log.createdAt.toISOString() : null,
      priority: "urgent" as const,
      link: log.metadata?.agreementId
        ? `/agreements/${log.metadata.agreementId}`
        : undefined,
    })),

    // 💰 Payments
    ...pendingPayments.map((p: any) => ({
      id: p._id?.toString(),
      type: "payment" as const,
      title: "Payment pending",
      description: `₹${p.amount ?? 0} awaiting release`,
      createdAt: p.createdAt ? p.createdAt.toISOString() : null,
      priority: "normal" as const,
    })),
  ]
    .filter((item) => item.createdAt) // remove bad items
    .sort((a, b) => {
      const aTime = new Date(a.createdAt!).getTime();
      const bTime = new Date(b.createdAt!).getTime();
      return bTime - aTime;
    });

  /* ================= COUNTS ================= */

  const agreementsCount = await Agreement.countDocuments({
    creatorId: creatorObjectId,
  });

  const inboxCount = revisionLogs.length; // urgent only
  const pendingPaymentsCount = pendingPayments.length;

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="lg:hidden sticky top-0 z-[100]">
        <CreatorMobileTopNav
          displayName={user.email.split("@")[0]}
          agreementsCount={agreementsCount}
          inboxCount={inboxCount}
          pendingPaymentsCount={pendingPaymentsCount}
          pendingDeliverablesCount={revisionLogs.length}
        />
      </div>

      <div className="flex">
        <CreatorSidebar
          active="inbox"
          creatorProfile={{
            name: user.email.split("@")[0],
            email: user.email,
          }}
          agreementsCount={agreementsCount}
          inboxCount={inboxCount}
          pendingPaymentsCount={pendingPaymentsCount}
          pendingDeliverablesCount={revisionLogs.length}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <CreatorInboxClient items={inboxItems} />
        </main>
      </div>
    </div>
  );
}
