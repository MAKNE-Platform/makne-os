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

export default async function BrandCreatorsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  const creators = await CreatorProfile.find()
    .populate("userId", "email")
    .lean();

  const safeCreators = creators.map((c: any) => ({
    _id: c._id.toString(),
    username: c.username,
    niche: c.niche,
    platforms: c.platforms,
    location: c.location || "",
    profileImage: c.profileImage || "",
    bio: c.bio || "",
    contentFormats: c.skills?.contentFormats || [],
    portfolioCount: c.portfolio?.length || 0,
    email: c.userId?.email || "",
  }));

  return (
    <div className="min-h-screen bg-black text-white lg:px-0 px-2">
      <div className="flex">
        <BrandSidebar active="creators" brandProfile={{} as any} />

        <main className="flex-1 px-6 py-8 space-y-10">

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/20 via-[#1a1a1a] to-black p-8 lg:p-12">

            <div className="text-sm text-white/60">
              Discover Talent
            </div>

            <div className="mt-3 text-4xl font-semibold">
              {safeCreators.length} Creators on MAKNE
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