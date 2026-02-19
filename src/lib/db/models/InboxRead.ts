import mongoose, { Schema, model, models } from "mongoose";

const InboxReadSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    itemId: { type: String, required: true },
  },
  { timestamps: true }
);

InboxReadSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export const InboxRead =
  models.InboxRead || model("InboxRead", InboxReadSchema);
