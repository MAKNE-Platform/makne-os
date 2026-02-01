import mongoose from "mongoose";
import { Notification } from "@/lib/db/models/Notification";

export async function createNotification({
  userId,
  role,
  title,
  message,
  entityType,
  entityId,
}: {
  userId: mongoose.Types.ObjectId;
  role: "CREATOR" | "BRAND";
  title: string;
  message: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId;
}) {
  await Notification.create({
    userId,
    role,
    title,
    message,
    entityType,
    entityId,
  });
}
