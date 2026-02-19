export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { Payment } from "@/lib/db/models/Payment";
import { User } from "@/lib/db/models/User";

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";
import CreatorAgreementsClient from "./CreatorAgreementsClient";

import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { Notification } from "@/lib/db/models/Notification";


export default async function CreatorAgreementsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  const creatorObjectId = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(userId).lean<{ email: string }>();
  if (!user) redirect("/auth/login");

  /* ================= FETCH AGREEMENTS ================= */

  const agreementsRaw = await Agreement.find({
    creatorId: creatorObjectId,
  })
    .sort({ updatedAt: -1 })
    .lean();


  const brandProfiles = await BrandProfile.find({
    userId: { $in: agreementsRaw.map((a) => a.brandId) },
  }).lean();

  const brandProfileMap = new Map(
    brandProfiles.map((b: any) => [b.userId.toString(), b])
  );

  const agreements = agreementsRaw.map((a: any) => {
    const brandProfile = brandProfileMap.get(
      a.brandId.toString()
    ) as any;

    return {
      id: a._id.toString(),
      title: a.title,
      brandName: brandProfile?.brandName ?? "Brand",
      status: a.status,
      amount: a.amount ?? 0,
      updatedAt: a.updatedAt?.toISOString(),
    };
  });

  console.log("AGREEMENTS RAW:", agreementsRaw[0]);


  /* ================= METRICS ================= */

  const total = agreements.length;
  const active = agreements.filter(
    (a) => a.status === "SENT" || a.status === "ACTIVE"
  ).length;
  const completed = agreements.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const earningsAgg = await Payment.aggregate([
    {
      $match: {
        creatorId: creatorObjectId,
        status: "RELEASED",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalEarnings = earningsAgg[0]?.total ?? 0;

  /* ================= COUNTS FOR SIDEBAR ================= */

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

  const inboxCount = unreadNotificationsCount + pendingDeliverablesCount;
  
  const pendingPaymentsCount = await Payment.countDocuments({
    creatorId: creatorObjectId,
    status: { $in: ["PENDING", "INITIATED"] },
  });


  return (
    <div className="min-h-screen bg-black text-white">

      <div className="lg:hidden sticky top-0 z-[100]">
        <CreatorMobileTopNav
          displayName={user.email.split("@")[0]}
          agreementsCount={total}
          inboxCount={inboxCount}
          pendingPaymentsCount={pendingPaymentsCount}
          pendingDeliverablesCount={0}
        />
      </div>

      <div className="flex">
        <CreatorSidebar
          active="agreements"
          creatorProfile={{
            name: user.email.split("@")[0],
            email: user.email,
          }}
          agreementsCount={total}
          inboxCount={inboxCount}
          pendingPaymentsCount={pendingPaymentsCount}
          pendingDeliverablesCount={0}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <CreatorAgreementsClient
            agreements={agreements}
            metrics={{
              total,
              active,
              completed,
              totalEarnings,
            }}
          />
        </main>
      </div>
    </div>
  );
}
