import DeliverablesLineChart from "@/components/analytics/DeliverablesLineChart";
import PaymentsLineChart from "@/components/analytics/PaymentsLineChart";
import TopCreatorsBarChart from "@/components/analytics/TopCreatorsBarChart";
import GraphCard from "@/components/analytics/GraphCard";
import MetricCard from "@/components/analytics/MetricCard";

import BrandSidebar from "@/components/brand/BrandSidebar";
import MobileTopNav from "@/components/dashboard/MobileTopNav";
import { connectDB } from "@/lib/db/connect";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Agreement } from "@/lib/db/models/Agreement";
import { Payment } from "@/lib/db/models/Payment";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { Notification } from "@/lib/db/models/Notification";

type BrandProfileType = {
    brandName: string;
    industry: string;
    location?: string;
};

/* ================= MOCK DATA (REPLACE WITH DB LATER) ================= */

const deliverablesData = [
    { label: "01-09", value: 0 },
    { label: "01-15", value: 1 },
    { label: "01-22", value: 3 },
    { label: "01-30", value: 5 },
    { label: "02-02", value: 8 },
    { label: "02-05", value: 6 },
];

const paymentsData = [
    { label: "01-15", value: 12000 },
    { label: "01-22", value: 28000 },
    { label: "01-30", value: 45000 },
    { label: "02-02", value: 103444 },
    { label: "02-05", value: 0 },
];

const creatorsData = [
    { label: "creator1@gmail.com", value: 6 },
    { label: "creator2@gmail.com", value: 4 },
    { label: "creator3@gmail.com", value: 2 },
];

/* ================= PAGE ================= */

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

    const brandObjectId = new mongoose.Types.ObjectId(userId);

    // Inbox = unread notifications + submitted deliverables
    const unreadNotificationsCount = await Notification.countDocuments({
        userId: brandObjectId,
        role: "BRAND",
        readAt: { $exists: false },
    });

    const deliverablesCount = await AuditLog.countDocuments({
        action: "DELIVERABLE_SUBMITTED",
        "metadata.brandId": userId,
    });

    const inboxCount = unreadNotificationsCount + deliverablesCount;

    // Draft agreements
    const draftAgreementsCount = await Agreement.countDocuments({
        brandId: brandObjectId,
        status: "DRAFT",
    });

    // Pending payments
    const pendingPaymentsCount = await Payment.countDocuments({
        brandId: brandObjectId,
        status: { $in: ["PENDING", "INITIATED"] },
    });

    return (
        <div className="min-h-screen lg:px-0 px-2 bg-black text-white">

            {/* ================= MOBILE NAV ================= */}
            {/* MOBILE NAV */}
            <div className="lg:hidden sticky top-0 z-[100] bg-black">
                <MobileTopNav
                    brandName={brandProfile.brandName}
                    industry={brandProfile.industry}
                    pendingPaymentsCount={pendingPaymentsCount}
                    inboxCount={inboxCount}
                    draftAgreementsCount={draftAgreementsCount}
                />

            </div>

            <div className="flex">

                {/* SIDEBAR (hidden automatically on mobile inside component) */}
                <BrandSidebar
                    active="analytics"
                    brandProfile={brandProfile}
                    inboxCount={inboxCount}
                    draftAgreementsCount={draftAgreementsCount}
                    pendingPaymentsCount={pendingPaymentsCount}
                />


                {/* ================= MAIN ================= */}
                <main
                    className="
          flex-1
          px-3 sm:px-6 lg:px-8
          py-6 sm:py-8
          space-y-8 sm:space-y-10
        "
                >

                    {/* ================= HEADER ================= */}
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-4xl font-medium">
                            Analytics
                        </h1>
                        <p className="text-sm sm:text-md opacity-70">
                            Performance overview (last 30 days)
                        </p>
                    </div>

                    {/* ================= OVERVIEW ================= */}
                    <div
                        className="
            grid
            grid-cols-2
            sm:grid-cols-2
            lg:grid-cols-4
            gap-3 sm:gap-4
          "
                    >
                        <MetricCard label="Spend" value="₹1.2L" />
                        <MetricCard label="Active" value={12} />
                        <MetricCard label="Pending" value={4} />
                        <MetricCard label="Completed" value={9} />
                    </div>

                    {/* ================= DELIVERABLES ================= */}
                    <div className="w-full">
                        <GraphCard title="Deliverables submitted (30 days)">
                            <div className="w-full overflow-x-hidden">
                                <DeliverablesLineChart data={deliverablesData} />
                            </div>
                        </GraphCard>
                    </div>

                    {/* ================= PAYMENTS + CREATORS ================= */}
                    <div
                        className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-5 sm:gap-6
          "
                    >
                        <GraphCard title="Payments released">
                            <div className="w-full overflow-x-hidden">
                                <PaymentsLineChart data={paymentsData} />
                            </div>
                        </GraphCard>

                        <GraphCard title="Top creators">
                            <div className="w-full overflow-x-hidden">
                                <TopCreatorsBarChart data={creatorsData} />
                            </div>
                        </GraphCard>
                    </div>

                </main>
            </div>
        </div>
    );

}
