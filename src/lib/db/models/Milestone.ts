import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema(
  {
    agreementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agreement",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "PAID"],
      default: "PENDING",
    },

    deliveryNote: {
      type: String,
    },

    deliveredAt: {
      type: Date,
    },

    approvedAt: {
      type: Date,
    },

    dueDate: {
      type: Date,
    },

    deliverableIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },

    submission: {
  note: String,

  files: [
    {
      name: String,
      url: String,
      type: String,
      size: Number,
    },
  ],

  links: [String],
},


  },
  { timestamps: true }
);

export const Milestone =
  mongoose.models.Milestone ||
  mongoose.model("Milestone", MilestoneSchema);
