import mongoose, { Schema, Document } from "mongoose";

export type ActorType = "SYSTEM" | "BRAND" | "CREATOR";

export interface AuditLogDocument extends Document {
  actorType: ActorType;
  actorId?: mongoose.Types.ObjectId;

  action: string; // e.g. PAYMENT_INITIATED, PAYOUT_REQUESTED
  entityType: string; // e.g. PAYMENT, PAYOUT, AGREEMENT
  entityId: mongoose.Types.ObjectId;

  metadata?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<AuditLogDocument>(
  {
    actorType: {
      type: String,
      enum: ["SYSTEM", "BRAND", "CREATOR"],
      required: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      required: false,
    },

    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },

    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<AuditLogDocument>("AuditLog", AuditLogSchema);
