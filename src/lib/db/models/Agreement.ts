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
            enum: ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "ACTIVE", "COMPLETED"],
            default: "DRAFT",
        },

        creatorEmail: {
            type: String,
        },

        activity: {
            type: [
                {
                    message: String,
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            default: [],
        },

    },
    { timestamps: true }
);

export const Agreement =
    mongoose.models.Agreement ||
    mongoose.model("Agreement", AgreementSchema);
