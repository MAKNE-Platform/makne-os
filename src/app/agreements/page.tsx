import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";
import { ArrowRight } from "lucide-react";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";

import BrandSidebar from "@/components/brand/BrandSidebar";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { div } from "framer-motion/client";
import MobileTopNav from "@/components/dashboard/MobileTopNav";
import { Notification } from "@/lib/db/models/Notification";
import { Payment } from "@/lib/db/models/Payment";
import { AuditLog } from "@/lib/db/models/AuditLog";

type BrandProfileType = {
  brandName: string;
  industry: string;
  location?: string;
};

export default async function AgreementsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") redirect("/auth/login");

  await connectDB();

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

  const brandObjectId = new mongoose.Types.ObjectId(userId);

  const brandProfile = (await BrandProfile.findOne({
    userId: brandObjectId,
  }).lean()) as BrandProfileType | null;

  if (!brandProfile) redirect("/onboarding/brand");

  const agreements = await Agreement.find({
    brandId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .lean();

  const drafts = agreements.filter(
    (a) => a.status === "DRAFT"
  ).length;

  const pendingPayments = await Payment.countDocuments({
    brandId: new mongoose.Types.ObjectId(userId),
    status: { $in: ["PENDING", "INITIATED"] },
  });

  const draftAgreementsCount = await Agreement.countDocuments({
    brandId: brandObjectId,
    status: "DRAFT",
  });

  const draftCount = agreements.filter(a => a.status === "DRAFT").length;
  const activeCount = agreements.filter(a => a.status === "ACTIVE").length;
  const sentCount = agreements.filter(
    a => !["DRAFT", "ACTIVE"].includes(a.status)
  ).length;

  return (
    <div className="lg:px-0 px-2">
      {/* Mobile nav */}
      <MobileTopNav
        brandName={brandProfile.brandName}
        industry={brandProfile.industry}
        pendingPaymentsCount={pendingPayments}
        inboxCount={inboxCount}
        draftAgreementsCount={draftAgreementsCount}
      />


      <div className="flex min-h-screen bg-black text-white w-full relative">

        {/* ================= SIDEBAR ================= */}
        <BrandSidebar
          active="agreements"
          brandProfile={brandProfile}
          inboxCount={inboxCount}
          draftAgreementsCount={drafts}
          pendingPaymentsCount={pendingPayments}
        />


        {/* ================= MAIN ================= */}

        <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-6 w-full">

          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-medium">Agreements</h1>
              <p className="mt-1 text-md opacity-70">
                All collaborations created by your brand
              </p>
            </div>
            <Link
              href="/agreements/create/meta"
              className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-white"
            >
              Add agreement
            </Link>
          </div>

          {/* ================= AGREEMENTS OVERVIEW ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="rounded-xl border  border-white/10 inset-0
          bg-gradient-to-br
          from-[#636EE1]/10
          via-transparent
          to-transparent p-4">
              <div className="text-xs opacity-70">Active</div>
              <div className="mt-1 text-4xl font-medium text-[#636EE1]">
                {activeCount}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 inset-0
          bg-gradient-to-br
          from-[#636EE1]/10
          via-transparent
          to-transparent p-4">
              <div className="text-xs opacity-70">Draft</div>
              <div className="mt-1 text-4xl font-medium">
                {draftCount}
              </div>
            </div>

            <div className="rounded-xl border  border-white/10 inset-0
          bg-gradient-to-br
          from-[#636EE1]/10
          via-transparent
          to-transparent p-4">
              <div className="text-xs opacity-70">Sent</div>
              <div className="mt-1 text-4xl font-medium">
                {sentCount}
              </div>
            </div>


          </div>


          {/* Empty state */}
          {agreements.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-6 text-sm opacity-70">
              No agreements yet.
            </div>
          )}

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block rounded-xl border border-white/10 overflow-hidden">

            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/60 border-b-2 border-b-[#ffffff24]">
                <tr>
                  <th className="text-left px-6 py-4">Title</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Creator</th>
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {agreements.map((agreement: any) => (
                  <tr
                    key={agreement._id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/agreements/${agreement._id}`}>
                        {agreement.title}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={agreement.status} />
                    </td>

                    <td className="px-6 py-4 opacity-80">
                      {agreement.creatorEmail ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-xs opacity-60">
                      {new Date(agreement.createdAt).toDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/agreements/${agreement._id}`}
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
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>


          {/* ================= MOBILE VIEW ================= */}
          <div className="space-y-4 md:hidden">
            {agreements.map((agreement: any) => (
              <div
                key={agreement._id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3"
              >
                {/* Top Section */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {agreement.title}
                    </div>
                    <div className="text-xs text-white/50">
                      {agreement.creatorEmail ?? "No creator assigned"}
                    </div>
                  </div>

                  <StatusBadge status={agreement.status} />
                </div>

                {/* Optional Amount Row (if exists) */}
                {agreement.amount && (
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Amount</span>
                    <span className="font-medium text-white">
                      ₹{agreement.amount}
                    </span>
                  </div>
                )}

                {/* Date Row */}
                <div className="flex justify-between text-xs text-white/50">
                  <span>Created</span>
                  <span>
                    {new Date(agreement.createdAt).toDateString()}
                  </span>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/agreements/${agreement._id}`}
                  className="block w-full text-center rounded-lg bg-[#636EE1] py-2 text-sm font-medium text-black hover:opacity-90 transition"
                >
                  View Agreement
                </Link>
              </div>
            ))}

            {agreements.length === 0 && (
              <div className="text-center opacity-60 py-6">
                No agreements found.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>

  );
}

/* ================= UI HELPERS ================= */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        rounded-full
        border border-white/10
        px-2 py-0.5
        text-xs
      "
    >
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    DRAFT: "bg-gray-500/20 text-gray-300",
    SENT: "bg-yellow-500/10 text-yellow-300",
    ACTIVE: "bg-blue-500/20 text-blue-300",
    COMPLETED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${colorMap[status] ?? "bg-white/10"
        }`}
    >
      {status}
    </span>
  );
}
