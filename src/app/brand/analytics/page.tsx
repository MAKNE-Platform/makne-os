import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { BrandProfile } from "@/lib/db/models/BrandProfile";

import BrandSidebar from "@/components/brand/BrandSidebar";
import MobileTopNav from "@/components/dashboard/MobileTopNav";

type BrandProfileType = {
  brandName: string;
  industry: string;
  location?: string;
};

export default async function BrandAnalyticsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") redirect("/auth/login");

  await connectDB();

  const brandProfile = (await BrandProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean()) as BrandProfileType | null;

  if (!brandProfile) redirect("/onboarding/brand");

  const agreements = await Agreement.find({
    brandId: new mongoose.Types.ObjectId(userId),
  }).lean();

  /* ================= METRICS ================= */

  const active = agreements.filter(a => a.status === "ACTIVE").length;
  const pending = agreements.filter(a =>
    ["SUBMITTED", "REVISION_REQUESTED"].includes(a.status)
  ).length;
  const completed = agreements.filter(a => a.status === "COMPLETED").length;
  const drafts = agreements.filter(a => a.status === "DRAFT").length;

  return (
    <div className="min-h-screen bg-black text-white lg:px-0 px-2">

      {/* ================= MOBILE NAV ================= */}
      <MobileTopNav
        brandName={brandProfile.brandName}
        industry={brandProfile.industry}
      />

      <div className="flex">

        {/* ================= SIDEBAR ================= */}
        <BrandSidebar
          active="analytics"
          brandProfile={brandProfile}
        />

        {/* ================= MAIN ================= */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-12">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-medium">Analytics</h1>
            <p className="mt-1 text-md opacity-70">
              Performance overview of your collaborations
            </p>
          </div>

          {/* ================= KPI GRID ================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <MetricCard
              label="Active"
              value={active}
              hint="Currently running"
            />

            <MetricCard
              label="Pending"
              value={pending}
              hint="Needs action"
            />

            <MetricCard
              label="Completed"
              value={completed}
              hint="Successfully delivered"
            />

            <MetricCard
              label="Drafts"
              value={drafts}
              hint="Not yet sent"
            />

          </div>

          {/* ================= INSIGHT CARDS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Agreement health */}
            <InsightCard
              title="Agreement health"
              description="A quick snapshot of how your agreements are progressing."
            >
              <StatRow label="Active vs Pending">
                {active} / {pending}
              </StatRow>
              <StatRow label="Completion ratio">
                {completed} of {agreements.length}
              </StatRow>
            </InsightCard>

            {/* Operational note */}
            <InsightCard
              title="Operational insight"
              description="Where to focus your attention right now."
            >
              {pending > 0 ? (
                <p className="text-sm opacity-80">
                  You have <span className="text-[#636EE1] font-medium">{pending}</span> pending
                  submissions that may require review.
                </p>
              ) : (
                <p className="text-sm opacity-80">
                  No pending actions right now.
                </p>
              )}
            </InsightCard>

          </div>

        </main>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="
      rounded-xl
      border border-white/10
      bg-[#ffffff05]
      p-4
      flex flex-col justify-between
    ">
      <div className="text-xs opacity-70">
        {label}
      </div>

      <div className="mt-2 text-4xl font-medium">
        {value}
      </div>

      {hint && (
        <div className="mt-2 text-xs opacity-50">
          {hint}
        </div>
      )}
    </div>
  );
}

function InsightCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="
      rounded-xl
      border border-white/10
      bg-[#ffffff05]
      p-6
      space-y-4
    ">
      <div>
        <div className="text-sm font-medium">
          {title}
        </div>
        <div className="mt-1 text-sm opacity-70">
          {description}
        </div>
      </div>

      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function StatRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="opacity-70">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}
