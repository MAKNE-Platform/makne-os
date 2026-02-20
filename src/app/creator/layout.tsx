import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";
import { Notification } from "@/lib/db/models/Notification";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";

export default async function CreatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "CREATOR") redirect("/auth/login");

    await connectDB();

    const creatorObjectId = new mongoose.Types.ObjectId(userId);

    const user = await User
        .findById(userId)
        .lean<{ email: string }>();

    if (!user) redirect("/auth/login");

    const creatorProfile = await CreatorProfile
        .findOne({ userId })
        .lean<{
            displayName?: string;
            profileImage?: string;
        }>();

    /* ================= COUNTS ================= */

    const agreementsCount = await Agreement.countDocuments({
        creatorId: creatorObjectId,
    });

    const inboxCount = await Notification.countDocuments({
        userId: creatorObjectId,
        role: "CREATOR",
        readAt: { $exists: false },
    });

    const pendingPaymentsCount = await Payment.countDocuments({
        creatorId: creatorObjectId,
        status: { $in: ["PENDING", "INITIATED"] },
    });

    const displayName =
        creatorProfile?.displayName ||
        user.email?.split("@")[0] ||
        "Creator";

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">

            {/* MOBILE NAV */}
            <div className="lg:hidden sticky top-0 z-[100] w-full">
                <CreatorMobileTopNav
                    displayName={displayName}
                    profileImage={creatorProfile?.profileImage}
                    agreementsCount={agreementsCount}
                    inboxCount={inboxCount}
                    pendingPaymentsCount={pendingPaymentsCount}
                    pendingDeliverablesCount={0}
                />
            </div>

            {/* SIDEBAR (fixed, desktop only) */}
            <CreatorSidebar
                creatorProfile={{
                    name: displayName,
                    email: user.email,
                    profileImage: creatorProfile?.profileImage,
                }}
                agreementsCount={agreementsCount}
                inboxCount={inboxCount}
                pendingPaymentsCount={pendingPaymentsCount}
                pendingDeliverablesCount={0}
            />

            {/* CONTENT */}
            <main className="lg:ml-64 px-4 sm:px-6">
                {children}
            </main>

        </div>
    );
}