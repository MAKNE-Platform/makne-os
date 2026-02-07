import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { BrandProfile } from "@/lib/db/models/BrandProfile";

import BrandSidebar from "@/components/brand/BrandSidebar";
import MobileTopNav from "@/components/dashboard/MobileTopNav";
import SystemActivityClient from "./SystemActivityClient";
import { div } from "framer-motion/client";

type BrandProfileType = {
  brandName: string;
  industry: string;
  location?: string;
};

export default async function SystemActivityPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  /* ================= BRAND ================= */

  const brandProfile = (await BrandProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean()) as BrandProfileType | null;

  if (!brandProfile) {
    redirect("/onboarding/brand");
  }

  /* ================= AUDIT LOGS ================= */

  const logs = await AuditLog.find({
    "metadata.brandId": userId,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean<{
      _id: mongoose.Types.ObjectId;
      action: string;
      actorType: string;
      actorId?: mongoose.Types.ObjectId;
      entityType: string;
      entityId: mongoose.Types.ObjectId;
      metadata?: any;
      createdAt: Date;
    }[]>();

  // 🔥 Serialize EVERYTHING (correctly)
  const serializedLogs = logs.map((log) => ({
    id: log._id.toString(),
    action: log.action,
    actorType: log.actorType,
    actorId: log.actorId ? log.actorId.toString() : null,
    entityType: log.entityType,
    entityId: log.entityId.toString(),
    metadata: log.metadata ?? null,
    createdAt: log.createdAt.toISOString(),
  }));

  /* ================= UI ================= */

  return (
    <div className="lg:px-0 px-2">
      {/* Mobile nav */}
      <MobileTopNav />

      <div className="flex min-h-screen bg-black text-white">

        {/* Sidebar */}
        <BrandSidebar
          active="activity"
          brandProfile={{
            brandName: brandProfile.brandName,
            industry: brandProfile.industry,
            location: brandProfile.location,
          }}
        />

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <SystemActivityClient logs={serializedLogs} />
        </main>
      </div>
    </div>
  );
}
