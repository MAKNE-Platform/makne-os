"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { Notification } from "@/lib/db/models/Notification";

export async function deleteNotification(notificationId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) return;

  await connectDB();

  await Notification.deleteOne({
    _id: new mongoose.Types.ObjectId(notificationId),
    userId: new mongoose.Types.ObjectId(userId),
  });
}
