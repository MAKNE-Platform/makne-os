import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { SavedCreator } from "@/lib/db/models/SavedCreator";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";
import SavedCreatorsView from "./_components/SavedCreatorsView";

type LeanUser = {
  _id: mongoose.Types.ObjectId;
  displayName?: string;
  username?: string;
};

export default async function SavedCreatorsPage() {
  const cookieStore = await cookies();
  const brandId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!brandId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  const saved = await SavedCreator.find({
    brandId: new mongoose.Types.ObjectId(brandId),
  }).lean();

  const creatorIds = saved.map((s) => s.creatorId);

  const creators = await CreatorProfile.find({
    _id: { $in: creatorIds },
  }).lean();

  const userIds = creators.map((c) => c.userId);

  const users = await User.find({
    _id: { $in: userIds },
  }).lean<LeanUser[]>();

  const userMap = new Map(
    users.map((u) => [u._id.toString(), u])
  );

  const safeSavedCreators = creators.map((c: any) => {
    const user = userMap.get(c.userId.toString());

    return {
      _id: c._id.toString(),
      displayName:
        c.displayName ||
        user?.displayName ||
        user?.username ||
        "Creator",
      profileImage: c.profileImage ?? "",
      niche: c.niche ?? "General",
      platforms: c.platforms ?? "",
      location: c.location ?? "",
    };
  });

  return (
    <SavedCreatorsView creators={safeSavedCreators} />
  );
}