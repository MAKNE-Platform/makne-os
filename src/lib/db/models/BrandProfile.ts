import mongoose from "mongoose";

const BrandProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

export const BrandProfile =
  mongoose.models.BrandProfile ||
  mongoose.model("BrandProfile", BrandProfileSchema);
