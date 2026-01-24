import mongoose from "mongoose";

const CreatorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    niche: {
      type: String,
      required: true,
    },
    platforms: {
      type: String,
      required: true,
    },
    portfolio: {
      type: String,
    },
  },
  { timestamps: true }
);

export const CreatorProfile =
  mongoose.models.CreatorProfile ||
  mongoose.model("CreatorProfile", CreatorProfileSchema);
