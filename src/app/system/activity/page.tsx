import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/lib/db/models/AuditLog";
import SystemActivityClient from "./SystemActivityClient";
import mongoose from "mongoose";

export default async function SystemActivityPage() {
  await connectDB();

  const logs = await AuditLog.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean<{
      _id: mongoose.Types.ObjectId;
      action: string;
      actorType: string;
      actorId?: mongoose.Types.ObjectId;
      entityType: string;
      entityId: mongoose.Types.ObjectId;
      metadata?: any;
      createdAt: Date;
    }[]>();


  // 🔥 Serialize EVERYTHING
  const serializedLogs = logs.map((log) => ({
    id: log._id.toString(),
    action: log.action,
    actorType: log.actorType,
    actorId: log.actorId ? log.actorId.toString() : null,
    entityType: log.entityType,
    entityId: log.entityId.toString(),
    metadata: log.metadata ?? null,
    createdAt: log.createdAt.toISOString(),
  }));

  return <SystemActivityClient logs={serializedLogs} />;
}
