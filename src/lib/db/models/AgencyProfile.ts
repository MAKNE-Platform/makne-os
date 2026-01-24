import mongoose from "mongoose";

const AgencyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    agencyName: {
      type: String,
      required: true,
    },
    teamSize: {
      type: String,
    },
    contactEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AgencyProfile =
  mongoose.models.AgencyProfile ||
  mongoose.model("AgencyProfile", AgencyProfileSchema);
