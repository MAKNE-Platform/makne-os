import mongoose from "mongoose";

const CreatorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ===== BASIC PROFILE INFO ===== */

    niche: {
      type: String,
      required: true,
    },

    platforms: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    /* ===== PORTFOLIO ===== */

    portfolio: [
      {
        _id: false, // 🔥 Prevent nested ObjectId

        title: { type: String, required: true },
        brandName: { type: String },
        thumbnail: { type: String },

        description: { type: String },

        duration: {
          _id: false,
          start: { type: String },
          end: { type: String },
        },

        deliverables: [{ type: String }],

        links: [
          {
            _id: false,
            label: { type: String },
            url: { type: String },
          },
        ],

        media: [
          {
            _id: false, // 🔥 prevents media _id issue
            type: {
              type: String,
              enum: ["image", "video"],
            },
            url: { type: String },
          },
        ],

        outcome: {
          _id: false,
          summary: { type: String },
          metrics: [
            {
              _id: false, // 🔥 prevents metrics _id issue
              label: { type: String },
              value: { type: String },
            },
          ],
        },

        meta: {
          _id: false,
          draft: { type: Boolean, default: true },
          featured: { type: Boolean, default: false },
          verifiedByBrand: { type: Boolean, default: false },
          createdAt: { type: String },
          updatedAt: { type: String },
        },
      },
    ],
  },
  { timestamps: true }
);

export const CreatorProfile =
  mongoose.models.CreatorProfile ||
  mongoose.model("CreatorProfile", CreatorProfileSchema);
