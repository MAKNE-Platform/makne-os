import mongoose from "mongoose";
import { Notification } from "@/lib/db/models/Notification";

export async function getUnreadNotificationCount(
  userId: mongoose.Types.ObjectId,
  role: "CREATOR" | "BRAND"
) {
  const count = await Notification.countDocuments({
    userId,
    role,
    read: false,
  });

  return count;
}
