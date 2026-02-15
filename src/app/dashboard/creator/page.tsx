import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import Link from "next/link";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Payment } from "@/lib/db/models/Payment";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { Notification } from "@/lib/db/models/Notification";

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";


/* ================= TYPES ================= */

type LeanUser = {
    _id: mongoose.Types.ObjectId;
    email: string;
};

type AgreementType = {
    _id: mongoose.Types.ObjectId;
    title: string;
    status: string;
    brandId: mongoose.Types.ObjectId;
    createdAt: Date;
};

type BrandType = {
    _id: mongoose.Types.ObjectId;
    brandName: string;
};

type CreatorNavCounts = {
    agreementsCount: number;
    inboxCount: number;
    pendingPaymentsCount: number;
};

type CreatorProfileLean = {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    niche: string;
    platforms: string;
    portfolio?: any[];
    createdAt: Date;
};


/* ================= PAGE ================= */

export default async function CreatorDashboardPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "CREATOR") redirect("/auth/login");

    await connectDB();

    const user = (await User.findById(
        new mongoose.Types.ObjectId(userId),
        { email: 1 }
    ).lean()) as LeanUser | null;

    if (!user) redirect("/auth/login");

    const displayName = user.email.split("@")[0];



    const rawProfile = (await CreatorProfile.findOne({
        userId: new mongoose.Types.ObjectId(userId),
    }).lean()) as CreatorProfileLean | null;

    if (!rawProfile) redirect("/onboarding/creator");

    const profile = {
        id: rawProfile._id.toString(),
        niche: rawProfile.niche,
        platforms: rawProfile.platforms,
        portfolio: Array.isArray(rawProfile.portfolio)
            ? rawProfile.portfolio
            : [],
        createdAt: rawProfile.createdAt.toISOString(),
    };


    if (!profile) redirect("/onboarding/creator");

    const creatorObjectId = new mongoose.Types.ObjectId(userId);

    /* ================= AGREEMENTS ================= */

    const agreements = (await Agreement.find(
        { creatorId: creatorObjectId },
        { title: 1, status: 1, brandId: 1, createdAt: 1 }
    )
        .sort({ createdAt: -1 })
        .lean()) as unknown as AgreementType[];

    const activeAgreements = agreements.filter(a => a.status === "ACTIVE");
    const pendingDeliverables = agreements.filter(a =>
        ["ACTIVE", "REVISION_REQUESTED"].includes(a.status)
    );

    /* ================= PAYMENTS ================= */

    const releasedPayments = await Payment.find({
        creatorId: creatorObjectId,
        status: "RELEASED",
    }).lean();

    const pendingPayments = await Payment.countDocuments({
        creatorId: creatorObjectId,
        status: { $in: ["PENDING", "INITIATED"] },
    });

    const totalEarned = releasedPayments.reduce(
        (sum, p) => sum + (p.amount ?? 0),
        0
    );

    /* ================= INBOX COUNT ================= */

    const unreadNotifications = await Notification.countDocuments({
        userId: creatorObjectId,
        role: "CREATOR",
        readAt: { $exists: false },
    });

    const deliverablesSubmitted = await AuditLog.countDocuments({
        action: "DELIVERABLE_SUBMITTED",
        "metadata.creatorId": userId,
    });

    /* ================= BRANDS ================= */

    const brandIds = agreements.map(a => a.brandId);
    const brands = (await BrandProfile.find(
        { userId: { $in: brandIds } },
        { brandName: 1 }
    ).lean()) as unknown as BrandType[];

    const brandMap = new Map(
        brands.map(b => [b._id.toString(), b.brandName])
    );

    const recentAgreements = agreements.slice(0, 4);


    /* ================= CREATOR NAV COUNTS ================= */

    // Agreements
    const agreementsCount = await Agreement.countDocuments({
        creatorId: new mongoose.Types.ObjectId(userId),
    });

    // Inbox
    const unreadNotificationsCount = await Notification.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        role: "CREATOR",
        readAt: { $exists: false },
    });

    const pendingDeliverablesCount = await AuditLog.countDocuments({
        action: "DELIVERABLE_SUBMITTED",
        "metadata.creatorId": userId,
    });

    const inboxCount = unreadNotificationsCount + pendingDeliverablesCount;

    // Payments
    const pendingPaymentsCount = await Payment.countDocuments({
        creatorId: new mongoose.Types.ObjectId(userId),
        status: { $in: ["PENDING", "INITIATED"] },
    });


    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-black text-white">

            {/* Mobile Nav */}
            <div className="lg:hidden sticky top-0 z-[100]">
                <CreatorMobileTopNav
                    displayName={displayName}
                    agreementsCount={agreementsCount}
                    inboxCount={inboxCount}
                    pendingPaymentsCount={pendingPaymentsCount}
                    pendingDeliverablesCount={pendingDeliverablesCount}
                />

            </div>

            <div className="flex">

                {/* Sidebar */}
                <CreatorSidebar
                    active="dashboard"
                    creatorProfile={{ name: "Creator" }}
                    inboxCount={inboxCount}
                    pendingDeliverablesCount={pendingDeliverables.length}
                    pendingPaymentsCount={pendingPayments} agreementsCount={0}
                />

                {/* ================= MAIN ================= */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-10">

                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-medium">Dashboard</h1>
                        <p className="mt-1 text-md opacity-70">
                            Overview of your collaborations
                        </p>
                    </div>

                    {/* ================= OVERVIEW ================= */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Metric label="Active agreements" value={activeAgreements.length} />
                        <Metric label="Pending deliverables" value={pendingDeliverables.length} />
                        <Metric label="Earned" value={`₹ ${totalEarned.toLocaleString()}`} />
                        <Metric label="Pending payout" value={pendingPayments} />
                    </div>

                    {/* ================= CONTENT ================= */}
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Agreements */}
                        <div className="flex-1 space-y-4">
                            <h2 className="text-xl font-medium opacity-80">
                                Recent agreements
                            </h2>

                            {recentAgreements.map(a => (
                                <Link
                                    key={a._id.toString()}
                                    href={`/agreements/${a._id}`}
                                    className="block rounded-xl border border-white/10 bg-[#ffffff05] p-4 hover:border-[#636EE1]/40 transition"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">{a.title}</div>
                                            <div className="text-xs opacity-60">
                                                {brandMap.get(a.brandId.toString()) ?? "Brand"}
                                            </div>
                                        </div>
                                        <StatusPill status={a.status} />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Brands */}
                        <div className="lg:w-80 rounded-xl border border-white/10 bg-[#ffffff05] p-4 space-y-3">
                            <h3 className="text-sm font-medium opacity-80">
                                Recent brands
                            </h3>

                            {brands.slice(0, 4).map(b => (
                                <div
                                    key={b._id.toString()}
                                    className="rounded-lg border border-white/10 px-3 py-2 text-sm"
                                >
                                    {b.brandName}
                                </div>
                            ))}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

/* ================= SMALL UI ================= */

function Metric({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#636EE1]/10 to-transparent p-4">
            <div className="text-xs opacity-70">{label}</div>
            <div className="mt-2 text-3xl font-medium">{value}</div>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const color =
        status === "ACTIVE"
            ? "text-[#636EE1] border-[#636EE1]"
            : "opacity-60 border-white/20";

    return (
        <span className={`border px-3 py-1 rounded-full text-xs ${color}`}>
            {status}
        </span>
    );
}
