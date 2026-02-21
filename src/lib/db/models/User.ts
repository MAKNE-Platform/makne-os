// lib/db/models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  role: {
    type: String,
    enum: ["CREATOR", "BRAND", "AGENCY"],
  },

  profileImage: {
    type: String, 
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
});

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
