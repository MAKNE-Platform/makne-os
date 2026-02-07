import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import Link from "next/link";

import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { Notification as NotificationModel } from "@/lib/db/models/Notification";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";
import { BrandProfile } from "@/lib/db/models/BrandProfile";

import BrandSidebar from "@/components/brand/BrandSidebar";
import MobileTopNav from "@/components/dashboard/MobileTopNav";
import DeleteNotificationButton from "@/components/brand/DeleteNotificationButton";
import { div } from "framer-motion/client";

/* ================= TYPES ================= */

type LeanMilestone = {
  _id: mongoose.Types.ObjectId;
  agreementId: mongoose.Types.ObjectId;
  amount?: number;
  submission?: {
    note?: string;
    files?: {
      name: string;
      url: string;
    }[];
    links?: string[];
    submittedAt?: Date;
  };
};

type LeanAgreement = {
  _id: mongoose.Types.ObjectId;
  title: string;
  creatorEmail?: string;
};


type BrandProfileType = {
  brandName: string;
  industry: string;
  location?: string;
};

type InboxDeliverable = {
  auditId: string;
  agreementId: string;
  agreementTitle: string;
  milestoneTitle: string;
  amount: number;
  creatorEmail?: string;
  note?: string;
  submittedAt: Date;
  files: { name: string; url: string }[];
};


type InboxNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  agreementId?: string;
  isUnread: boolean;
};

/* ================= PAGE ================= */

export default async function BrandInboxPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") redirect("/auth/login");

  await connectDB();

  /* ================= BRAND ================= */

  const brandProfile = (await BrandProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean()) as BrandProfileType | null;

  if (!brandProfile) redirect("/onboarding/brand");

  /* ================= DELIVERABLE AUDIT LOGS ================= */

  const rawLogs = (await AuditLog.find({
    action: "DELIVERABLE_SUBMITTED",
    "metadata.brandId": userId,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()) as unknown as {
      _id: mongoose.Types.ObjectId;
      entityId: mongoose.Types.ObjectId;
      createdAt: Date;
      metadata: {
        milestoneTitle?: string;
      };
    }[];

  const inboxDeliverables: InboxDeliverable[] = [];

  for (const log of rawLogs) {
    const milestone = (await Milestone.findById(log.entityId)
      .select("agreementId submission amount")
      .lean()) as LeanMilestone | null;


    if (!milestone?.agreementId) continue;

    const agreement = (await Agreement.findById(milestone.agreementId)
      .select("title creatorEmail")
      .lean()) as LeanAgreement | null;


    if (!agreement) continue;

    inboxDeliverables.push({
      auditId: log._id.toString(),
      agreementId: milestone.agreementId.toString(),
      agreementTitle: agreement.title,
      milestoneTitle: log.metadata.milestoneTitle ?? "Milestone",
      amount: milestone.amount ?? 0,
      creatorEmail: agreement.creatorEmail,
      note: milestone.submission?.note,
      submittedAt: log.createdAt,
      files: milestone.submission?.files ?? [],
    });

  }

  /* ================= NOTIFICATIONS ================= */

  const rawNotifications = (await NotificationModel.find({
    userId: new mongoose.Types.ObjectId(userId),
    role: "BRAND",
  })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean()) as unknown as {
      _id: mongoose.Types.ObjectId;
      title: string;
      message: string;
      createdAt: Date;
      readAt?: Date;
      metadata?: {
        agreementId?: string;
      };
    }[];

  const notifications: InboxNotification[] = rawNotifications.map((n) => ({
    id: n._id.toString(),
    title: n.title,
    message: n.message,
    createdAt: n.createdAt,
    agreementId: n.metadata?.agreementId,
    isUnread: !n.readAt,
  }));

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  /* ================= UI ================= */

  return (

    <div className="">
      <div className="lg:px-0 px-2">
        {/* Mobile nav */}
        <MobileTopNav
          brandName={brandProfile.brandName}
          industry={brandProfile.industry}
        />
      </div>

      <div className="flex min-h-screen bg-black text-white">

        {/* Sidebar */}
        <BrandSidebar
          active="notifications"
          brandProfile={brandProfile}
          notificationCount={unreadCount}
        />

        {/* Main */}
        <main className="flex-1 px-6 py-6 lg:px-10 space-y-8">
          <div>
            <h1 className="text-4xl font-medium">Inbox</h1>
            <p className="mt-1 text-md opacity-70">
              Submitted deliverables and system notifications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">


            {/* ================= DELIVERABLES ================= */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium opacity-80">
                Submitted deliverables
              </h2>

              {inboxDeliverables.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-4 text-sm opacity-70">
                  No deliverables submitted yet.
                </div>
              )}

              {inboxDeliverables.map((d) => (
                <Link
                  key={d.auditId}
                  href={`/agreements/${d.agreementId}`}
                  className="
  flex flex-col md:flex-row gap-4
  rounded-xl
  border border-white/10
  bg-[#ffffff05]
  p-4
  transition
  hover:border-[#636EE1]/40
  relative
"

                >
                  <div className="
  h-40 w-full
  md:h-40 md:w-60
  object-cover
  rounded-lg
  overflow-hidden
  border border-white/10
  bg-black
  flex items-center justify-center
">

                    {d.files.length > 0 && isImage(d.files[0].name) ? (
                      <img
                        src={d.files[0].url}
                        alt={d.files[0].name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs opacity-60">
                        {d.files.length > 0 ? "FILE" : "—"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1 relative">
                    <div className="flex justify-between gap-4">
                      <div className="">
                        <div className="text-lg">
                          {d.agreementTitle}
                        </div>
                        <div className="text-md opacity-80">
                          Milestone: {d.milestoneTitle}
                        </div>
                      </div>

                      <UserAvatar email={d.creatorEmail} />
                    </div>

                    <div className="text-sm opacity-60">
                      Submitted by {d.creatorEmail ?? "Creator"}
                    </div>

                    {d.note && (
                      <div className="text-sm opacity-70 line-clamp-2">
                        {d.note}
                      </div>
                    )}

                    <div className="
  flex items-end justify-between w-full
  md:absolute md:bottom-0
  mt-4 md:mt-0
">
                      <div className="text-xs opacity-50 px-3 py-1 rounded-full border border-[#636EE1]">
                        {new Date(d.submittedAt).toLocaleString()}
                      </div>

                      <a className="px-3 pb-1 border border-[#636EE1] text-[#ffffff] rounded-lg text-xl bg-[#636EE1] hover:bg-[#636EE1]/40 transition-all"
                        href={`/agreements/${d.agreementId}`}>
                        →
                      </a>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ================= NOTIFICATIONS ================= */}
            <div className="space-y-4 w-full">
              <h2 className="text-lg font-medium opacity-80">
                Notifications
              </h2>

              {notifications.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-4 text-sm opacity-70">
                  You’re all caught up.
                </div>
              )}

              {/* SCROLL CONTAINER */}
              <div className="
  space-y-3
  max-h-[60vh] md:max-h-[80vh]
  notifications-scroll
  overflow-y-auto
  pr-1
  rounded-xl
">

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="
          relative
          rounded-xl
          border border-white/10
          bg-[#ffffff05]
          p-4
          transition
          hover:border-[#636EE1]/40
          group
        "
                  >
                    {/* Delete */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 md:opacity-100">
                      <DeleteNotificationButton notificationId={n.id} />
                    </div>

                    <Link
                      href={n.agreementId ? `/agreements/${n.agreementId}` : "#"}
                      className="block space-y-1"
                    >
                      <div className="text-sm font-medium">
                        {n.title}
                      </div>

                      <div className="mt-1 text-sm opacity-70">
                        {n.message}
                      </div>

                      <div className="mt-2 text-xs opacity-50">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function isImage(fileName: string) {
  return /\.(png|jpg|jpeg|webp)$/i.test(fileName);
}


function UserAvatar({ email }: { email?: string }) {
  const letter = email?.[0]?.toUpperCase() ?? "C";

  return (
    <div
      className="
        h-9 w-9
        rounded-full
        flex items-center justify-center
        text-xs font-medium
        bg-[#636EE1]/30
        text-[#b7bbed]
        border border-[#636EE1]/30
        shrink-0
      "
      title={email}
    >
      {letter}
    </div>
  );
}
