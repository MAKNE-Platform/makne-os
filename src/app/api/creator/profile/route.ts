import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  await connectDB();

  await CreatorProfile.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    {
      bio: body.bio,
      location: body.location,
      niche: body.niche,
      platforms: body.platforms,
      profileImage: body.profileImage,
    },
    { new: true }
  );

  return Response.json({ success: true });
}
