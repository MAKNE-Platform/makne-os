import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";
import BrandSidebar from "@/components/brand/BrandSidebar";
import MobileTopNav from "@/components/dashboard/MobileTopNav";
import BrandCreatorsGrid from "@/components/brand/BrandCreatorsGrid";
import "@/lib/db/models/User";
import Link from "next/link";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { Agreement } from "@/lib/db/models/Agreement";
import { Payment } from "@/lib/db/models/Payment";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Notification } from "@/lib/db/models/Notification";

type BrandProfileType = {
    brandName: string;
    industry: string;
    location?: string;
};

export default async function BrandCreatorsPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "BRAND") {
        redirect("/auth/login");
    }

    await connectDB();

    const creators = await CreatorProfile.find()
        .populate("userId", "email name")
        .lean();

    const brandProfile = (await BrandProfile.findOne({
        userId: new mongoose.Types.ObjectId(userId),
    }).lean()) as BrandProfileType | null;

    if (!brandProfile) redirect("/onboarding/brand");

    const brandObjectId = new mongoose.Types.ObjectId(userId);


    const safeCreators = creators.map((c: any) => ({
        _id: c._id.toString(),
        username: c.displayName || c.username || "Creator",
        niche: c.niche || "General",
        platforms: c.platforms || "",
        location: c.location || "",
        profileImage: c.profileImage || "",
        bio: c.bio || "",
        contentFormats: c.skills?.contentFormats || [],
        portfolioCount: c.portfolio?.length || 0,
        email: c.userId?.email || "",
    }));

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
        <div className="min-h-screen bg-black text-white lg:px-0 px-2">
            <div className="flex">
                <BrandSidebar
                    active="creators"
                    brandProfile={brandProfile}
                    inboxCount={inboxCount}
                    draftAgreementsCount={draftAgreementsCount}
                    pendingPaymentsCount={pendingPaymentsCount}
                />

                <main className="flex-1 px-6 py-8 space-y-10">
                    {/* Hero */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#1a1a1a] to-black p-8 lg:p-12">

                        <div className="text-md text-white/60">
                            {safeCreators.length} Creators on MAKNE
                        </div>

                        <div className="mt-3 text-4xl font-semibold">
                            Discover Talent
                        </div>

                        <div className="mt-3 text-sm text-white/60">
                            Explore verified creators and their portfolios
                        </div>
                    </div>

                    {/* Grid */}
                    <BrandCreatorsGrid creators={safeCreators} />
                </main>
            </div>
        </div>
    );
}

