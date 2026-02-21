import mongoose from "mongoose";

const CreatorProfileSchema = new mongoose.Schema(
  {

    username: { type: String, unique: true, required: true },

    displayName: {
      type: String,
      required: true,
    },

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

    skills: {
      contentFormats: [{ type: String }],
      tools: [{ type: String }],
      languages: [{ type: String }],
      strengths: [{ type: String }],
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
      new mongoose.Schema(
        {
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
              _id: false,
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
                _id: false,
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
        { _id: true } // 🔥 ENABLE PROJECT ID
      ),
    ],


  },
  { timestamps: true }
);

export const CreatorProfile =
  mongoose.models.CreatorProfile ||
  mongoose.model("CreatorProfile", CreatorProfileSchema);
