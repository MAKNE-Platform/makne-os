import mongoose from "mongoose";
import { AuditLog, ActorType } from "@/lib/db/models/AuditLog";

export async function logAudit({
  actorType,
  actorId,
  action,
  entityType,
  entityId,
  metadata,
}: {
  actorType: ActorType;
  actorId?: mongoose.Types.ObjectId;
  action: string;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
}) {
  await AuditLog.create({
    actorType,
    actorId,
    action,
    entityType,
    entityId,
    metadata,
  });
}
