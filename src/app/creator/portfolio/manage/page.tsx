import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";
import ManagePortfolioClient from "./ManagePortfolioClient";
import { PortfolioItem } from "@/types/portfolio";

export default async function ManagePortfolioPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  const user = await User.findById(userId).lean<{
    _id: mongoose.Types.ObjectId;
    email: string;
  }>();

  if (!user) redirect("/auth/login");

  const profileDoc = await CreatorProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean<{
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    niche: string;
    platforms: string;
    portfolio?: string;
    availability?: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
  }>();


  if (!profileDoc) redirect("/onboarding/creator");

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



  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile nav */}
      <div className="lg:hidden sticky top-0 z-[100]">
        <CreatorMobileTopNav
          displayName={user.email.split("@")[0]}
          agreementsCount={0}
          inboxCount={0}
          pendingPaymentsCount={0}
          pendingDeliverablesCount={0}
        />
      </div>

      <div className="flex">
        <CreatorSidebar
          active="portfolio"
          creatorProfile={{
            name: user.email.split("@")[0],
            email: user.email,
          }}
          agreementsCount={0}
          inboxCount={0}
          pendingPaymentsCount={0}
          pendingDeliverablesCount={0}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <ManagePortfolioClient initialPortfolio={portfolio} />
        </main>
      </div>
    </div>
  );
}
