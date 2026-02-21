import mongoose from "mongoose";

const SavedCreatorSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreatorProfile",
      required: true,
    },
  },
  { timestamps: true }
);

SavedCreatorSchema.index({ brandId: 1, creatorId: 1 }, { unique: true });

export const SavedCreator =
  mongoose.models.SavedCreator ||
  mongoose.model("SavedCreator", SavedCreatorSchema);