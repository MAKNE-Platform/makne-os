// lib/db/models/Otp.ts
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Otp =
  mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
