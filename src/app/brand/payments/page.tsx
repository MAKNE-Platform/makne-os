import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";


import BrandSidebar from "@/components/brand/BrandSidebar";
import MobileTopNav from "@/components/dashboard/MobileTopNav";

import { AuditLog } from "@/lib/db/models/AuditLog";
import { Notification } from "@/lib/db/models/Notification";
import BrandPaymentsTable from "@/components/brand/BrandPaymentsTable";


type BrandProfileType = {
    brandName: string;
    industry: string;
    location?: string;
};

export default async function BrandPaymentsPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "BRAND") redirect("/auth/login");

    await connectDB();

    /* ================= BRAND PROFILE ================= */

    const brandProfile = (await BrandProfile.findOne({
        userId: new mongoose.Types.ObjectId(userId),
    }).lean()) as BrandProfileType | null;

    if (!brandProfile) redirect("/onboarding/brand");

    /* ================= PAYMENTS ================= */

    const payments = await Payment.find({
        brandId: new mongoose.Types.ObjectId(userId),
    })
        .sort({ createdAt: -1 })
        .lean();

    const released = payments.filter(p => p.status === "RELEASED");
    const pending = payments.filter(p =>
        ["PENDING", "INITIATED"].includes(p.status)
    );

    const totalPaid = released.reduce(
        (sum, p) => sum + (p.amount ?? 0),
        0
    );

    /* ================= COUNTS (SHARED LOGIC) ================= */

    // Inbox = unread notifications + submitted deliverables
    const unreadNotifications = await Notification.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        role: "BRAND",
        readAt: { $exists: false },
    });

    const pendingDeliverables = await AuditLog.countDocuments({
        action: "DELIVERABLE_SUBMITTED",
        "metadata.brandId": userId,
    });

    const inboxCount = unreadNotifications + pendingDeliverables;

    // Pending payments count
    const pendingPaymentsCount = pending.length;

    // Draft agreements count
    const draftAgreementsCount = await Agreement.countDocuments({
        brandId: new mongoose.Types.ObjectId(userId),
        status: "DRAFT",
    });


    /* ================= LOOKUPS ================= */

    // Agreements
    const agreementIds = payments.map(p => p.agreementId);
    const agreements = await Agreement.find(
        { _id: { $in: agreementIds } },
        { title: 1 }
    )
        .lean<{ _id: mongoose.Types.ObjectId; title: string }[]>();


    const agreementMap = Object.fromEntries(
        agreements.map(a => [a._id.toString(), a.title])
    );

    // Creators
    const creatorIds = payments.map(p => p.creatorId);
    const creators = await User.find(
        { _id: { $in: creatorIds } },
        { email: 1 }
    )
        .lean<{ _id: mongoose.Types.ObjectId; email: string }[]>();


    const creatorMap = Object.fromEntries(
        creators.map(c => [c._id.toString(), c.email])
    );

    const safePayments = payments.map((p: any) => ({
        _id: p._id.toString(),
        agreementId: p.agreementId?.toString(),
        milestoneId: p.milestoneId?.toString(),
        brandId: p.brandId?.toString(),
        creatorId: p.creatorId?.toString(),
        amount: p.amount,
        status: p.status,
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
    }));


    return (
        <div className="min-h-screen bg-black text-white lg:px-0 px-2">

            {/* ================= MOBILE NAV ================= */}
            <MobileTopNav
                brandName={brandProfile.brandName}
                industry={brandProfile.industry}
                pendingPaymentsCount={pendingPaymentsCount}
                inboxCount={inboxCount}
                draftAgreementsCount={draftAgreementsCount}
            />

            <div className="flex">

                {/* ================= SIDEBAR ================= */}
                <BrandSidebar
                    active="payments"
                    brandProfile={brandProfile}
                    inboxCount={inboxCount}
                    pendingPaymentsCount={pendingPaymentsCount}
                    draftAgreementsCount={draftAgreementsCount}
                />


                {/* ================= MAIN ================= */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                    {/* ================= HERO ================= */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#1a1a1a] to-black p-8 lg:p-12">

                        {/* Floating Cards */}
                        <div className="hidden lg:block absolute right-114 top-16 pointer-events-none">
                            <div className="absolute text-sm p-2 w-72 h-44 bg-gradient-to-br from-purple-500/30 to-[#636EE1]/30 rounded-2xl rotate-12 shadow-2xl backdrop-blur-xl border border-white/10">
                                MAKNE
                            </div>
                            <div className="absolute text-sm p-2 w-72 h-44 bg-gradient-to-br from-[#636EE1]/40 to-indigo-500/20 rounded-2xl -rotate-6 translate-x-6 translate-y-6 shadow-2xl backdrop-blur-xl border border-white/10">
                                MAKNE
                            </div>
                        </div>

                        <div className="relative z-10">

                            <div className="text-sm text-white/60">
                                Total Paid
                            </div>

                            <div className="mt-3 text-4xl lg:text-5xl font-semibold">
                                ₹{totalPaid.toLocaleString()}
                            </div>

                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl">

                                <div className="rounded-xl border border-white/20 bg-[#ffffff05] p-4">
                                    <div className="text-xs text-white/60">
                                        Released Payments
                                    </div>
                                    <div className="mt-1 text-xl font-medium">
                                        {released.length}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/20 bg-[#ffffff05] p-4">
                                    <div className="text-xs text-white/60">
                                        Pending Payments
                                    </div>
                                    <div className="mt-1 text-xl font-medium">
                                        {pending.length}
                                    </div>
                                </div>

                                <div className="hidden sm:block rounded-xl border border-white/20 bg-[#ffffff05] p-4">
                                    <div className="text-xs text-white/60">
                                        Total Transactions
                                    </div>
                                    <div className="mt-1 text-xl font-medium">
                                        {payments.length}
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* ================= PAYMENTS TABLE ================= */}
                    <BrandPaymentsTable
                        payments={safePayments}
                        agreementMap={agreementMap}
                        creatorMap={creatorMap}
                    />
                </main>
            </div>
        </div>
    );
}

/* ================= UI ================= */

function SummaryCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="
      rounded-xl
      border border-white/10
      inset-0
          bg-gradient-to-br
          from-[#636EE1]/10
          via-transparent
          to-transparent
      p-4
    ">
            <div className="text-xs opacity-70">
                {label}
            </div>
            <div className="mt-2 text-3xl font-medium">
                {value}
            </div>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const base =
        "inline w-max items-center rounded-full border px-3 py-1 text-xs font-medium";

    const style =
        status === "RELEASED"
            ? "bg-[#636EE1]/10 text-[#636EE1] border-[#636EE1]/40"
            : status === "FAILED"
                ? "bg-red-500/10 text-red-400 border-red-500/30"
                : "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";

    return (
        <span className={`${base} ${style}`}>
            {status}
        </span>
    );
}