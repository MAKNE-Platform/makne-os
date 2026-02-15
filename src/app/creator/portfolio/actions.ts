"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { connectDB } from "@/lib/db/connect";

export async function upsertPortfolioItem(item: {
  id?: string;
  title: string;
  description?: string;
  link?: string;
  image?: string;
}) {
  const userId = (await cookies()).get("auth_session")?.value;
  if (!userId) throw new Error("Unauthorized");

  await connectDB();

  const profile = await CreatorProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!profile) throw new Error("Profile not found");

  if (item.id) {
    // UPDATE
    const target = profile.portfolio.id(item.id);
    if (!target) throw new Error("Item not found");

    target.title = item.title;
    target.description = item.description;
    target.link = item.link;
    target.image = item.image;
  } else {
    // ADD
    profile.portfolio.push({
      title: item.title,
      description: item.description,
      link: item.link,
      image: item.image,
    });
  }

  await profile.save();
}

export async function deletePortfolioItem(id: string) {
  const userId = (await cookies()).get("auth_session")?.value;
  if (!userId) throw new Error("Unauthorized");

  await connectDB();

  await CreatorProfile.updateOne(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $pull: { portfolio: { _id: id } } }
  );
}
