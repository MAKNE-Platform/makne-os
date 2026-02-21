import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import Link from "next/link";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Payment } from "@/lib/db/models/Payment";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { Notification } from "@/lib/db/models/Notification";

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";

/* ================= TYPES ================= */

type LeanUser = {
  _id: mongoose.Types.ObjectId;
  email: string;
};

type AgreementType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  status: string;
  brandId: mongoose.Types.ObjectId;
  amount?: number;
  createdAt: Date;
  updatedAt?: Date;
};

type BrandType = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  brandName: string;
};

type CreatorProfileLean = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  niche: string;
  platforms: string;
  portfolio?: any[];
  createdAt: Date;
};

/* ================= PAGE ================= */

export default async function CreatorDashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  const creatorObjectId = new mongoose.Types.ObjectId(userId);

  const creatorProfile = await CreatorProfile
    .findOne({ userId })
    .lean<{ profileImage?: string; displayName?: string }>();

  const user = (await User.findById(creatorObjectId, {
    email: 1,
  }).lean()) as LeanUser | null;

  if (!user) redirect("/auth/login");

  const displayName = user.email.split("@")[0];

  const rawProfile = (await CreatorProfile.findOne({
    userId: creatorObjectId,
  }).lean()) as CreatorProfileLean | null;

  if (!rawProfile) redirect("/onboarding/creator");

  /* ================= AGREEMENTS ================= */

  const agreements = (await Agreement.find(
    { creatorId: creatorObjectId },
    {
      title: 1,
      status: 1,
      brandId: 1,
      amount: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  )
    .sort({ createdAt: -1 })
    .lean()) as unknown as AgreementType[];

  const activeAgreements = agreements.filter(
    (a) => a.status === "ACTIVE"
  );

  const pendingDeliverables = agreements.filter((a) =>
    ["ACTIVE", "REVISION_REQUESTED"].includes(a.status)
  );

  const recentAgreements = agreements.slice(0, 4);

  /* ================= BRAND MAPPING ================= */

  const brandIds = agreements.map((a) => a.brandId);

  const brands = (await BrandProfile.find(
    { userId: { $in: brandIds } },
    { brandName: 1, userId: 1 }
  ).lean()) as unknown as BrandType[];

  const brandMap = new Map(
    brands.map((b) => [b.userId.toString(), b.brandName])
  );

  /* ================= PAYMENTS ================= */

  const releasedPayments = await Payment.find({
    creatorId: creatorObjectId,
    status: "RELEASED",
  }).lean();

  const pendingPaymentsCount = await Payment.countDocuments({
    creatorId: creatorObjectId,
    status: { $in: ["PENDING", "INITIATED"] },
  });

  const totalEarned = releasedPayments.reduce(
    (sum, p) => sum + (p.amount ?? 0),
    0
  );

  /* ================= NAV COUNTS ================= */

  const agreementsCount = agreements.length;

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

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Nav */}
      {/* <div className="lg:hidden sticky top-0 z-[100]">
        <CreatorMobileTopNav
          displayName={displayName}
          profileImage={creatorProfile?.profileImage}
          agreementsCount={agreementsCount}
          inboxCount={inboxCount}
          pendingPaymentsCount={pendingPaymentsCount}
          pendingDeliverablesCount={pendingDeliverablesCount}
        />
      </div> */}

      <div className="flex">
        {/* <CreatorSidebar
          creatorProfile={{ name: displayName, profileImage: creatorProfile?.profileImage, email: user.email }}
          inboxCount={inboxCount}
          agreementsCount={agreementsCount}
          pendingDeliverablesCount={pendingDeliverables.length}
          pendingPaymentsCount={pendingPaymentsCount}

        /> */}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-medium">Dashboard</h1>
            <p className="mt-1 text-md opacity-70">
              Overview of your collaborations
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Metric
              label="Active agreements"
              value={activeAgreements.length}
            />
            <Metric
              label="Pending deliverables"
              value={pendingDeliverables.length}
            />
            <Metric
              label="Earned"
              value={`₹ ${totalEarned.toLocaleString()}`}
            />
            <Metric
              label="Pending payout"
              value={pendingPaymentsCount}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Agreements */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium">
                  Recent Agreements
                </h2>

                {agreements.length > 0 && (
                  <Link
                    href="/creator/agreements"
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm"
                  >
                    View all
                  </Link>
                )}
              </div>

              {recentAgreements.map((a) => {
                const brandName =
                  brandMap.get(a.brandId.toString()) ??
                  "Unknown";

                return (
                  <Link
                    key={a._id.toString()}
                    href={`/agreements/${a._id}`}
                    className="block rounded-xl border border-white/10 bg-[#ffffff05] p-4 hover:border-[#636EE1]/40 transition group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="font-medium group-hover:text-[#636EE1] transition">
                          {a.title}
                        </div>

                        <div className="text-xs opacity-60">
                          From {brandName}
                        </div>
                      </div>

                      <StatusPill status={a.status} />
                    </div>

                    <div className="mt-3 flex justify-between items-center text-xs opacity-70">
                      <div>
                        {a.updatedAt
                          ? `Updated on ${new Date(
                            a.updatedAt
                          ).toLocaleDateString()}`
                          : `Created on ${new Date(
                            a.createdAt
                          ).toLocaleDateString()}`}
                      </div>

                      <div className="font-medium text-[#636EE1]">
                        ₹
                        {typeof a.amount === "number"
                          ? a.amount.toLocaleString()
                          : "0"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Recent Brands */}
            <div className="lg:w-80 rounded-xl border border-white/10 bg-[#ffffff05] p-4 space-y-3">
              <h3 className="text-sm font-medium opacity-80">
                Recent brands
              </h3>

              {brands.slice(0, 4).map((b) => (
                <div
                  key={b._id.toString()}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm"
                >
                  {b.brandName}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= SMALL UI ================= */

function Metric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#636EE1]/10 to-transparent p-4">
      <div className="text-xs opacity-70">{label}</div>
      <div className="mt-2 lg:text-3xl text-2xl font-medium">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "ACTIVE"
      ? "text-[#636EE1] border-[#636EE1]"
      : "opacity-60 border-white/20";

  return (
    <span className={`border px-3 py-1 rounded-full text-xs ${color}`}>
      {status}
    </span>
  );
}
