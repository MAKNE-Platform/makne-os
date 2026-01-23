// lib/db/models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["CREATOR", "BRAND", "AGENCY"] },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
