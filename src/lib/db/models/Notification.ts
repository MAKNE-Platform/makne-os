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

  readAt: {
  type: Date,
  default: null,
},

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
    
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model<NotificationDocument>(
    "Notification",
    NotificationSchema
  );


  // Auto-delete notifications 30 days after they are read
NotificationSchema.index(
  { readAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 30, // 30 days
    partialFilterExpression: {
      readAt: { $exists: true, $ne: null },
    },
  }
);
