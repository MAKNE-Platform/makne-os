export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";

import CreatorSidebar from "@/components/creator/CreatorSidebar";
import CreatorMobileTopNav from "@/components/creator/CreatorMobileTopNav";
import EditProfileClient from "./EditProfileClient";

export default async function CreatorProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  const user = await User.findById(userId).lean<{ email: string }>();
  if (!user) redirect("/auth/login");

  const profile = await CreatorProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean<any>();

  if (!profile) redirect("/onboarding/creator");

  const initialProfile = {
    displayName: user.email.split("@")[0],
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    niche: profile.niche ?? "",
    platforms: profile.platforms ?? "",
    profileImage: profile.profileImage ?? "",
    skills: profile.skills ?? {
      contentFormats: [],
      tools: [],
      languages: [],
      strengths: [],
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <EditProfileClient initialProfile={initialProfile} />
      </main>
    </div>
  );
}
