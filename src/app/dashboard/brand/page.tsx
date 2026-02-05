import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";

import { connectDB } from "@/lib/db/connect";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Agreement } from "@/lib/db/models/Agreement";
import MobileTopNav from "@/components/dashboard/MobileTopNav";


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


  const agreements = (await Agreement.find(
    { brandId: new mongoose.Types.ObjectId(userId) },
    { title: 1, status: 1, creatorEmail: 1, createdAt: 1 }
  )
    .sort({ createdAt: -1 })
    .lean()) as unknown as AgreementType[];

  const active = agreements.filter(a => a.status === "ACTIVE");
  const pending = agreements.filter(a =>
    ["SUBMITTED", "REVISION_REQUESTED"].includes(a.status)
  );
  const drafts = agreements.filter(a => a.status === "DRAFT");

  const recentAgreements = agreements.slice(0, 4);

  const recentCreatorsMap = new Map<string, AgreementType>();

  agreements.forEach((agreement) => {
    if (!agreement.creatorEmail) return;

    const existing = recentCreatorsMap.get(agreement.creatorEmail);

    if (
      !existing ||
      new Date(agreement.createdAt) > new Date(existing.createdAt)
    ) {
      recentCreatorsMap.set(agreement.creatorEmail, agreement);
    }
  });

  const recentCreators = Array.from(recentCreatorsMap.values())
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 4);


  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden lg:flex h-screen sticky top-0 w-64 flex-col border-r border-white/10 bg-black px-6 py-6">
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

      </aside>

      {/* ================= MAIN ================= */}
      <main className="
  flex-1
  px-4 sm:px-6 lg:px-8
  py-6 lg:py-8
  space-y-8 lg:space-y-10
  overflow-y-auto
">
        <MobileTopNav />

        {/* Header */}
        <div>
          <h1 className="text-4xl font-medium">Dashboard</h1>
        </div>

        {/* ================= OVERVIEW ================= */}
        <h2 className="text-2xl">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

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
                  className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-black"
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
            <div className="space-y-3">
              {recentAgreements.map(a => (
                <Link
                  key={a._id.toString()}
                  href={`/agreements/${a._id}`}
                  className="
                  block rounded-xl
                  border border-white/10
                  bg-[#ffffff05]
                  p-4
                  transition
                  hover:border-[#636EE1]/50
                "
                >
                  <div className="flex justify-between items-center gap-6">
                    <div className="space-y-2">
                      <div className="font-medium">
                        {a.title}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <Pill>{a.createdAt.toDateString()}</Pill>
                        {a.creatorEmail && <Pill>{a.creatorEmail}</Pill>}
                        <Pill>{a.status}</Pill>
                      </div>
                    </div>

                    <div className="lg:h-8 lg:w-8 h-7 w-10 rounded-full bg-[#636EE1]/20 flex items-center justify-center text-xs">
                      {a.creatorEmail?.[0]?.toUpperCase() ?? "C"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent creators */}
          <div className="rounded-xl lg:w-xl w-full border-2 border-white/10 bg-[#ffffff03] p-4 space-y-4">
            <h3 className="text-sm font-medium opacity-80">
              Recent creators
            </h3>

            {recentCreators.map((a) => (
              <div
                key={a._id.toString()}
                className="
        rounded-lg
        border border-white/10
        p-3
        flex items-center justify-between
      "
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="h-8 w-8 rounded-full bg-[#636EE1]/20 flex items-center justify-center text-xs">
                    {a.creatorEmail?.[0]?.toUpperCase()}
                  </div>

                  <div>
                    <div className="text-sm font-medium truncate max-w-[180px]">
                      {a.creatorEmail}
                    </div>
                    <div className="text-xs opacity-60">
                      Last collab {a.createdAt.toDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
    <div className="rounded-xl border-2 border-white/10 bg-[#ffffff0a] p-4 flex justify-between items-center">
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
      px-2.5 py-1.5
      opacity-80
    ">
      {children}
    </span>
  );
}
