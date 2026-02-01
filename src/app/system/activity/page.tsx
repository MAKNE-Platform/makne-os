import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { AuditLog, AuditLogDocument } from "@/lib/db/models/AuditLog";

/**
 * Small helper to humanize audit actions
 * PAYOUT_COMPLETED -> Payout completed
 */
function prettyAction(action: string) {
  return action
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default async function SystemActivityPage() {
  await connectDB();

  const logs = await AuditLog.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean<AuditLogDocument[]>();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold">
        Activity Timeline
      </h1>

      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No activity recorded yet.
        </p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id.toString()}
              className="rounded-xl border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  {/* Action */}
                  <p className="text-sm font-medium">
                    {prettyAction(log.action)}
                  </p>

                  {/* Entity */}
                  <p className="text-xs text-muted-foreground">
                    {log.entityType} ·{" "}
                    <span className="font-mono">
                      {log.entityId.toString()}
                    </span>
                  </p>

                  {/* Metadata */}
                  {log.metadata && (
                    <pre className="mt-2 max-w-full overflow-x-auto rounded bg-muted/40 p-2 text-xs">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  )}
                </div>

                {/* Timestamp */}
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Actor */}
              <p className="mt-2 text-xs text-muted-foreground">
                Actor: {log.actorType}
                {log.actorId && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-mono">
                      {log.actorId.toString()}
                    </span>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
