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

        deliverables: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                },
            },
        ],

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

        activity: [
            {
                message: { type: String },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        policies: {
            paymentTerms: {
                type: String,
            },
            cancellationPolicy: {
                type: String,
            },
            revisionPolicy: {
                type: String,
            },
            usageRights: {
                type: String,
            },
        },

        portfolioSummary: {
            type: String,
        },

        creatorAiSummary: {
            type: String,
        },

        creatorTasks: [
            {
                title: { type: String },
                type: {
                    type: String,
                    default: "GENERAL",
                },
                completed: {
                    type: Boolean,
                    default: false,
                },
                autoTrack: {
                    type: Boolean,
                    default: true,
                },
                sourceType: { type: String },
                sourceId: { type: String },
            },
        ],

        creatorAiTasks: [
            {
                title: { type: String },
                type: {
                    type: String,
                    default: "GENERAL",
                },
                completed: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Agreement =
    mongoose.models.Agreement ||
    mongoose.model("Agreement", AgreementSchema);
