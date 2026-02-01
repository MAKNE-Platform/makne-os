import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  role: "CREATOR" | "BRAND";

  title: string;
  message: string;

  entityType?: string;
  entityId?: mongoose.Types.ObjectId;

  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    role: {
      type: String,
      enum: ["CREATOR", "BRAND"],
      required: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    entityType: String,
    entityId: Schema.Types.ObjectId,

    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model<NotificationDocument>(
    "Notification",
    NotificationSchema
  );
