import mongoose, { Schema, Document } from "mongoose";

export interface PayoutDocument extends Document {
  creatorId: mongoose.Types.ObjectId;
  amount: number;

  status: "REQUESTED" | "PROCESSING" | "COMPLETED" | "FAILED";

  requestedAt: Date;
  processedAt?: Date;
}

const PayoutSchema = new Schema<PayoutDocument>({
  creatorId: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["REQUESTED", "PROCESSING", "COMPLETED", "FAILED"],
    default: "REQUESTED",
  },

  requestedAt: { type: Date, default: Date.now },
  processedAt: Date,
});

export const Payout =
  mongoose.models.Payout ||
  mongoose.model<PayoutDocument>("Payout", PayoutSchema);
