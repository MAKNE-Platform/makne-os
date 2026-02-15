export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";
import { Agreement } from "@/lib/db/models/Agreement";
import { Payment } from "@/lib/db/models/Payment";
import { Notification } from "@/lib/db/models/Notification";
import { AuditLog } from "@/lib/db/models/AuditLog";

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";
import CreatorPortfolioClient from "./CreatorPortfolioClient";
import type { PortfolioItem } from "@/types/portfolio";


/* ================= TYPES ================= */

type CreatorBasicInfo = {
  displayName: string;
  niche: string;
  platforms: string;
  bio?: string;
  location?: string;
};

type CaseStudy = {
  title: string;
  brand?: string;
  campaignType?: string;

  problem?: string;
  approach?: string;

  deliverables?: string[]; // bullet list
  timeline?: string;       // "2 weeks", "10 days", etc.

  results?: string;        // metrics or qualitative
  testimonial?: string;    // optional
};


export default async function CreatorPortfolioPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  /* ================= USER ================= */

  const user = (await User.findById(userId).lean()) as unknown as {
    email: string;
  };

  if (!user) redirect("/auth/login");

  /* ================= PROFILE ================= */

  const profileDoc = (await CreatorProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean()) as unknown as {
    bio: string;
    location: string;
    profileImage: string;
    niche: string;
    platforms: string;
    portfolio?: string;
    availability?: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
  };


  if (!profileDoc) redirect("/onboarding/creator");

  /* ================= OVERVIEW METRICS ================= */

  // Total campaigns
  const totalCampaigns = await Agreement.countDocuments({
    creatorId: new mongoose.Types.ObjectId(userId),
  });

  // Completed agreements
  const completedAgreementsList = await Agreement.find({
    creatorId: new mongoose.Types.ObjectId(userId),
    status: "COMPLETED",
  }).lean();


  // Revisions
  const revisionLogs = await AuditLog.countDocuments({
    actorType: "BRAND",
    action: "REVISION_REQUESTED",
    "metadata.creatorId": userId,
  });

  const avgRevisions =
    completedAgreementsList.length === 0
      ? 0
      : Number((revisionLogs / completedAgreementsList.length).toFixed(1));

  // Repeat brands
  const brandCounts: Record<string, number> = {};

  completedAgreementsList.forEach((a: any) => {
    if (!a.brandId) return;
    const id = a.brandId.toString();
    brandCounts[id] = (brandCounts[id] || 0) + 1;
  });

  const repeatBrands = Object.values(brandCounts).filter(c => c > 1).length;

  const repeatBrandsPercent =
    completedAgreementsList.length === 0
      ? 0
      : Math.round((repeatBrands / completedAgreementsList.length) * 100);

  // Turnaround time (days)
  const submissionLogs = await AuditLog.find({
    action: "DELIVERABLE_SUBMITTED",
    "metadata.creatorId": userId,
  }).lean();

  let totalDays = 0;

  submissionLogs.forEach((l: any) => {
    if (!l.metadata?.assignedAt) return;
    const start = new Date(l.metadata.assignedAt).getTime();
    const end = new Date(l.createdAt).getTime();
    totalDays += (end - start) / (1000 * 60 * 60 * 24);
  });

  const avgTurnaround =
    submissionLogs.length === 0
      ? 0
      : Number((totalDays / submissionLogs.length).toFixed(1));

  // On-time delivery (fallback-safe)
  const onTimePercent =
    submissionLogs.length === 0
      ? 0
      : Math.round(
        (submissionLogs.filter(l => l.metadata?.onTime === true).length /
          submissionLogs.length) *
        100
      );


  /* ================= PORTFOLIO PARSE ================= */

  const portfolio: PortfolioItem[] = Array.isArray(profileDoc.portfolio)
    ? profileDoc.portfolio.map((project: any) => ({
      ...project,
      _id: project._id?.toString(),

      media: Array.isArray(project.media)
        ? project.media.map((m: any) => ({
          type: m.type,
          url: m.url,
        }))
        : [],

      links: Array.isArray(project.links)
        ? project.links.map((l: any) => ({
          label: l.label,
          url: l.url,
        }))
        : [],

      outcome: project.outcome
        ? {
          summary: project.outcome.summary,
          metrics: Array.isArray(project.outcome.metrics)
            ? project.outcome.metrics.map((m: any) => ({
              label: m.label,
              value: m.value,
            }))
            : [],
        }
        : undefined,
    }))
    : [];




  /* ================= COUNTS ================= */

  // Agreements
  const agreementsCount = await Agreement.countDocuments({
    creatorId: new mongoose.Types.ObjectId(userId),
  });

  const inboxCount =
    (await Notification.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      role: "CREATOR",
      readAt: { $exists: false },
    })) +
    (await AuditLog.countDocuments({
      actorType: "BRAND",
      action: "DELIVERABLE_SUBMITTED",
      "metadata.creatorId": userId,
    }));

  const pendingPaymentsCount = await Payment.countDocuments({
    creatorId: new mongoose.Types.ObjectId(userId),
    status: { $in: ["PENDING", "INITIATED"] },
  });


  /* ================= PERFORMANCE ================= */

  const completedAgreements = await Agreement.countDocuments({
    creatorId: new mongoose.Types.ObjectId(userId),
    status: "COMPLETED",
  });

  const totalEarningsAgg = await Payment.aggregate([
    {
      $match: {
        creatorId: new mongoose.Types.ObjectId(userId),
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

  const totalEarnings = totalEarningsAgg[0]?.total ?? 0;

  const completionRate =
    agreementsCount === 0
      ? 0
      : Math.round((completedAgreements / agreementsCount) * 100);

  const performance = {
    collaborations: agreementsCount,
    completed: completedAgreements,
    earnings: totalEarnings,
    completionRate,
  };


  /* ================= SERIALIZED PROFILE ================= */

  const profile = {
    displayName: user.email.split("@")[0],
    email: user.email,
    niche: profileDoc.niche,
    platforms: profileDoc.platforms,
    profileImage: profileDoc.profileImage ?? "",
    availability: profileDoc.availability ?? "AVAILABLE",
    bio: profileDoc.bio ?? "",
    location: profileDoc.location ?? "",
    portfolio,

    overview: {
      totalCampaigns,
      onTimePercent,
      avgRevisions,
      repeatBrandsPercent,
      avgTurnaround,
    },

    performance: {
      collaborations: totalCampaigns,
      completed: completedAgreements,
      earnings: totalEarnings,
      completionRate,
    },
  };


  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile nav */}
      <div className="lg:hidden sticky top-0 z-[100]">
        <CreatorMobileTopNav
          displayName={profile.displayName}
          agreementsCount={agreementsCount}
          inboxCount={inboxCount}
          pendingPaymentsCount={pendingPaymentsCount}
          pendingDeliverablesCount={0}
        />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <CreatorSidebar
          active="portfolio"
          creatorProfile={{
            name: profile.displayName,
            email: user.email,
          }}
          agreementsCount={agreementsCount}
          inboxCount={inboxCount}
          pendingPaymentsCount={pendingPaymentsCount}
          pendingDeliverablesCount={0}
        />


        {/* Main */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <CreatorPortfolioClient profile={profile} />
        </main>

      </div>
    </div>
  );
}
