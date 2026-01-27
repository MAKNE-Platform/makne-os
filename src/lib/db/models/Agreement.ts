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


    },
    { timestamps: true }
);

export const Agreement =
    mongoose.models.Agreement ||
    mongoose.model("Agreement", AgreementSchema);
