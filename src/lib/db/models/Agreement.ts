import mongoose from "mongoose";

const AgreementSchema = new mongoose.Schema(
    {
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },

        deliverables: {
            type: String,
        },

        amount: {
            type: Number,
        },

        status: {
            type: String,
            enum: ["DRAFT", "SENT", "ACCEPTED", "ACTIVE", "COMPLETED"],
            default: "DRAFT",
        },

        creatorEmail: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Agreement =
    mongoose.models.Agreement ||
    mongoose.model("Agreement", AgreementSchema);
