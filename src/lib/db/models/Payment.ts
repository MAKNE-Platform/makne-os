import mongoose, { Schema, Document } from "mongoose";

export interface PaymentDocument extends Document {
  agreementId: mongoose.Types.ObjectId;
  milestoneId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  amount: number;
  status: "PENDING" | "INITIATED" | "RELEASED" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    agreementId: { type: Schema.Types.ObjectId, required: true },
    milestoneId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true, // 🔒 one payment per milestone
    },
    brandId: { type: Schema.Types.ObjectId, required: true },
    creatorId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "INITIATED", "RELEASED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment ||
  mongoose.model<PaymentDocument>("Payment", PaymentSchema);
