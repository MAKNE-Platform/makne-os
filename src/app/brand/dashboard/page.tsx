import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";

import { connectDB } from "@/lib/db/connect";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Agreement } from "@/lib/db/models/Agreement";
import MobileTopNav from "@/components/dashboard/MobileTopNav";
import BrandSidebar from "@/components/brand/BrandSidebar";

import { AuditLog } from "@/lib/db/models/AuditLog";
import { Notification } from "@/lib/db/models/Notification";
import { Payment } from "@/lib/db/models/Payment";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";


type AgreementType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  status: string;
  creatorEmail?: string;
  createdAt: Date;
};

type BrandProfileType = {
  brandName: string;
  industry: string;
  location?: string;
};


export default async function BrandDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") redirect("/auth/login");

  await connectDB();

  const brandProfile = (await BrandProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean()) as BrandProfileType | null;

  if (!brandProfile) {
    redirect("/onboarding/brand");
  }


  const agreements = await Agreement.find(
    { brandId: new mongoose.Types.ObjectId(userId) }
  )
    .populate({
      path: "creatorId",
      select: "email",
    })
    .sort({ createdAt: -1 })
    .lean();

  // Extract creator userIds
  const creatorIds = agreements
    .map((a: any) => a.creatorId?._id)
    .filter(Boolean);

  // Fetch profiles
  const creatorProfiles = await CreatorProfile.find({
    userId: { $in: creatorIds },
  })
    .select("userId profileImage")
    .lean();

  // Create lookup map
  const creatorProfileMap = new Map(
    creatorProfiles.map((profile: any) => [
      profile.userId.toString(),
      profile.profileImage,
    ])
  );

  const recentAgreements = agreements.slice(0, 5).map((a: any) => ({
    ...a,
    creatorProfileImage:
      a.creatorId?._id &&
      creatorProfileMap.get(a.creatorId._id.toString()),
  }));

  /* ================= COUNTS FOR SIDEBAR ================= */

  /* ================= INBOX COUNT ================= */

  // 1. Unread notifications
  const unreadNotifications = await Notification.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    role: "BRAND",
    readAt: { $exists: false },
  });

  // 2. Submitted deliverables (not yet approved / checked)
  const pendingDeliverables = await AuditLog.countDocuments({
    action: "DELIVERABLE_SUBMITTED",
    "metadata.brandId": userId,
    // optional: add status check if you later track approval
  });

  const inboxCount = unreadNotifications + pendingDeliverables;


  const deliverablesCount = await AuditLog.countDocuments({
    action: "DELIVERABLE_SUBMITTED",
    "metadata.brandId": userId,
  });


  /* ================= PAYMENTS COUNT ================= */

  const pendingPayments = await Payment.countDocuments({
    brandId: new mongoose.Types.ObjectId(userId),
    status: { $in: ["PENDING", "INITIATED"] },
  });



  const active = agreements.filter(a => a.status === "ACTIVE");
  const pending = agreements.filter(a =>
    ["SUBMITTED", "REVISION_REQUESTED"].includes(a.status)
  );
  const drafts = agreements.filter(a => a.status === "DRAFT");

  const recentCreatorsMap = new Map<string, any>();

  agreements.forEach((agreement: any) => {
    const email =
      agreement.creatorId?.email || agreement.creatorEmail;

    if (!email) return;

    const existing = recentCreatorsMap.get(email);

    if (
      !existing ||
      new Date(agreement.createdAt) >
      new Date(existing.createdAt)
    ) {
      recentCreatorsMap.set(email, agreement);
    }
  });

  const recentCreators = Array.from(recentCreatorsMap.values())
    .map((a: any) => ({
      ...a,
      creatorProfileImage:
        a.creatorId?._id &&
        creatorProfileMap.get(a.creatorId._id.toString()),
    }))
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 4);


  /* ================= FINAL COUNTS (USED BY NAV) ================= */

  const draftAgreementsCount = drafts.length;
  const pendingPaymentsCount = pendingPayments;

  console.log(
    recentAgreements.map(a => ({
      title: a.title,
      creator: a.creatorId
    }))
  );


  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* ================= SIDEBAR ================= */}
      {/* <aside className="hidden lg:flex h-screen sticky top-0 w-64 flex-col border-r border-white/10 bg-black px-6 py-6">
        <Image
          src="/makne-logo-lg.png"
          alt="Makne"
          width={120}
          height={32}
          priority
        />

        <nav className="mt-12 space-y-6 text-sm">
          <div className="space-y-1">
            <SidebarItem label="Dashboard" active />
            <SidebarItem label="Agreements" href="/agreements" />
            <SidebarItem label="Activity" href="/system/activity" />
          </div>

          <div className="space-y-1 border-t border-white/10 pt-4">
            <SidebarItem label="Inbox" href="/brand/notifications" />
            <SidebarItem label="Analytics" />
            <SidebarItem label="Payments" />
          </div>
        </nav>

        <div className="
  mt-auto
  border-t border-white/10
  pt-4
  space-y-1 capitalize
">
          <div className="text-sm font-medium">
            {brandProfile?.brandName}
          </div>

          <div className="text-xs opacity-70">
            {brandProfile?.industry}
          </div>

          {brandProfile?.location && (
            <div className="text-xs opacity-50">
              {brandProfile.location}
            </div>
          )}

          <Link
            href="/brand/settings"
            className="
      mt-2 inline-flex items-center gap-1
      text-xs
      border p-2 rounded-md
      border-[#636EE1]
      text-[#636EE1]
      hover:bg-[#636de142] hover:text-white
    "
          >
            Manage Brand
          </Link>
        </div>

      </aside> */}


      {/* Sidebar */}
      <BrandSidebar
        active="dashboard"
        brandProfile={brandProfile}
        inboxCount={inboxCount}
        draftAgreementsCount={drafts.length}
        pendingPaymentsCount={pendingPayments}
      />



      {/* ================= MAIN ================= */}
      <main className="
  flex-1
  px-2 sm:px-6 lg:px-8
  lg:py-8
  space-y-8 lg:space-y-10
  overflow-y-auto
">
        {/* Mobile nav */}
        <div className="lg:hidden sticky top-0 z-[100] bg-black">
          <MobileTopNav
            brandName={brandProfile.brandName}
            industry={brandProfile.industry}
            pendingPaymentsCount={pendingPaymentsCount}
            inboxCount={inboxCount}
            draftAgreementsCount={draftAgreementsCount}
          />


        </div>

        <div className="lg:px-0 px-4">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-medium mb-4">Dashboard</h1>
          </div>

          {/* ================= OVERVIEW ================= */}
          <h2 className="text-2xl mb-2">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

            <OverviewCard label="Active agreements" value={active.length} trend="up" />
            <OverviewCard label="Pending agreements" value={pending.length} trend="flat" />
            <OverviewCard label="Draft agreements" value={drafts.length} trend="down" />
          </div>

          <div className="
  flex flex-col lg:flex-row
  gap-6
  w-full
">

            {/* ================= AGREEMENTS ================= */}
            <div className="space-y-4 w-full lg:w-full">

              {/* Header actions */}
              <div className="
  flex flex-col sm:flex-row
  items-start sm:items-center
  justify-between
  gap-3
">

                <h2 className="lg:text-2xl text-sm font-medium opacity-80">
                  Agreements
                </h2>

                <div className="flex gap-3">
                  <Link
                    href="/agreements/create/meta"
                    className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-white"
                  >
                    Add agreement
                  </Link>

                  <Link
                    href="/agreements"
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm"
                  >
                    View all
                  </Link>
                </div>
              </div>

              {/* Agreement cards */}
              <div className="space-y-4">
                {recentAgreements.map((a: any) => {
                  const createdDate = a.createdAt
                    ? new Date(a.createdAt).toDateString()
                    : "—";

                  const creatorEmail =
                    a.creatorId?.email || a.creatorEmail || "No creator assigned";

                  const creatorInitial =
                    creatorEmail?.[0]?.toUpperCase() || "C";

                  return (
                    <div
                      key={a._id.toString()}
                      className="
          rounded-xl
          border border-white/10
          bg-white/[0.02]
          p-4
          space-y-3
          transition
          hover:border-[#636EE1]/40
        "
                    >
                      {/* Top Section */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {a.title || "Untitled Agreement"}
                          </div>

                          <div className="text-xs text-white/50">
                            {creatorEmail}
                          </div>
                        </div>

                        <Pill>{a.status}</Pill>
                      </div>

                      {/* Amount Row */}
                      <div className="flex justify-start gap-2 text-sm text-white/70">
                        <span>Amount:</span>
                        <span className="font-medium text-white">
                          {a.amount ? `₹${a.amount}` : "—"}
                        </span>
                      </div>

                      {/* Created Row */}
                      <div className="flex justify-start gap-1 text-xs text-white/50">
                        <span>Created:</span>
                        <span>{createdDate}</span>
                      </div>

                      {/* Bottom Section */}
                      <div className="flex justify-between items-center pt-2">
                        {/* Avatar */}
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#636EE1]/20 flex items-center justify-center text-xs font-medium">
                          {a.creatorProfileImage ? (
                            <Image
                              src={a.creatorProfileImage}
                              alt="Creator avatar"
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <span>
                              {(a.creatorId?.email ||
                                a.creatorEmail ||
                                "C")[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* View Button */}
                        <Link
                          href={`/agreements/${a._id}`}
                          className="
              inline-flex
              items-center
              gap-1
              rounded-full
              border
              border-[#636EE1]/40
              bg-[#636EE1]/10
              px-4
              py-1.5
              text-xs
              font-medium
              text-[#636EE1]
              hover:bg-[#636EE1]
              hover:text-black
              transition-all
              duration-200
            "
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent creators */}
            <div className="rounded-xl lg:w-xl w-full border-2 border-white/10 bg-[#ffffff03] p-4 space-y-4">
              <h3 className="text-sm font-medium opacity-80">
                Recent creators
              </h3>

              {recentCreators.map((a: any) => {
                const email =
                  a.creatorId?.email || a.creatorEmail || "Unknown creator";

                const profileImage =
                  a.creatorProfileImage;

                const createdDate = a.createdAt
                  ? new Date(a.createdAt).toDateString()
                  : "—";

                return (
                  <div
                    key={a._id.toString()}
                    className="
          rounded-lg
          border border-white/10
          p-3
          flex items-center justify-between
          hover:border-[#636EE1]/40
          transition
        "
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={`
              relative h-8 w-8 rounded-full overflow-hidden
              bg-[#636EE1]/20 flex items-center justify-center
              text-xs font-medium
              ${a.status === "ACTIVE" ? "ring ring-[#636EE1]" : ""}
            `}
                      >
                        {profileImage ? (
                          <Image
                            src={profileImage}
                            alt="Creator avatar"
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          <span>
                            {email[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-medium truncate max-w-[180px]">
                          {email}
                        </div>

                        <div className="text-xs opacity-60">
                          Last collab {createdDate}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({
  label,
  href,
  active,
}: {
  label: string;
  href?: string;
  active?: boolean;
}) {
  const Comp = href ? Link : "div";
  return (
    <Comp
      href={href as any}
      className={`
        block rounded-lg px-3 py-2 transition
        ${active
          ? "bg-[#636EE1]/15 text-white"
          : "hover:bg-white/5 opacity-80"}
      `}
    >
      {label}
    </Comp>
  );
}

function OverviewCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: number;
  trend: "up" | "down" | "flat";
}) {
  return (
    <div className="rounded-xl border border-white/10 inset-0
          bg-gradient-to-br
          from-[#636EE1]/10
          via-transparent
          to-transparent p-4 flex justify-between items-center">
      <div>
        <div className="text-xs opacity-70">{label}</div>
        <div className="mt-1 lg:text-6xl text-2xl font-medium">
          {value}
        </div>
      </div>

      {/* Mini graph */}
      <div className="flex items-end gap-1 h-10">
        {[2, 4, 3, 5, 6].map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-sm bg-[#636EE1]"
            style={{
              height:
                trend === "up"
                  ? `${h * 6}px`
                  : trend === "down"
                    ? `${(6 - h) * 6}px`
                    : `${4 * 6}px`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="
      rounded-full
      border-[#636de183]
      border 
      px-2.5 py-1
      opacity-80
      text-xs
    ">
      {children}
    </span>
  );
}
