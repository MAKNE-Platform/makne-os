"use client";

/* ================= HELPERS ================= */

function prettyAction(action: string) {
    return action
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/^\w/, (c) => c.toUpperCase());
}

function actorLabel(log: ActivityLog) {
    if (log.metadata?.creatorEmail) return log.metadata.creatorEmail;
    if (log.actorType === "CREATOR") return "Creator";
    if (log.actorType === "BRAND") return "Brand";
    return "System";
}

/* ================= TYPES ================= */

type ActivityLog = {
    id: string;
    action: string;
    actorType: string;
    actorId: string | null;
    entityType: string;
    entityId: string;
    metadata?: {
        agreementId: any;
        milestoneTitle?: string;
        agreementTitle?: string;
        amount?: number;
        creatorEmail?: string;
    };
    createdAt: string;
};

type AuditMetadata = {
    creatorEmail?: string;
    milestoneTitle?: string;
    amount?: number;
};


/* ================= COMPONENT ================= */

export default function SystemActivityClient({
    logs,
}: {
    logs: ActivityLog[];
}) {
    return (
        <div className="mx-auto w-[98%] px-4 sm:px-6 py-6">
            <h1 className="mb-6 text-4xl font-medium">
                Activity
            </h1>

            {logs.length === 0 ? (
                <p className="text-sm opacity-70">
                    No activity recorded yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="
                rounded-xl
                border border-white/10
                bg-[#ffffff05]
                p-4 sm:p-5
              "
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                <div className="space-y-1">

                                    {/* Main line */}
                                    <p className="text-sm sm:text-base font-medium">
                                        {activitySentence(log)}
                                    </p>

                                    {/* Context */}
                                    <p className="text-xs sm:text-sm opacity-70">
                                        {log.metadata?.milestoneTitle && (
                                            <>
                                                Milestone:{" "}
                                                <span className="font-medium">
                                                    {log.metadata.milestoneTitle}
                                                </span>
                                                {" · "}
                                            </>
                                        )}

                                        {log.metadata?.agreementTitle ? (
                                            <>
                                                Agreement:{" "}
                                                <span className="font-medium">
                                                    {log.metadata.agreementTitle}
                                                </span>
                                            </>
                                        ) : (
                                            <span>Agreement</span>
                                        )}
                                    </p>

                                    {/* Amount */}
                                    {typeof log.metadata?.amount === "number" && (
                                        <p className="text-xs opacity-60">
                                            Amount: ₹{log.metadata.amount}
                                        </p>
                                    )}
                                </div>

                                {/* Timestamp */}
                                <span className="text-xs opacity-50 whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function activitySentence(log: ActivityLog) {
    const m = (log.metadata ?? {}) as AuditMetadata;


    switch (log.action) {
        case "AGREEMENT_SENT":
            return `Agreement sent to ${m.creatorEmail ?? "creator"}`;

        case "AGREEMENT_ACCEPTED":
            return `Agreement accepted by ${m.creatorEmail ?? "creator"}`;

        case "AGREEMENT_REJECTED":
            return `Agreement rejected by ${m.creatorEmail ?? "creator"}`;

        case "DELIVERABLE_SUBMITTED":
            return `Deliverable submitted for ${m.milestoneTitle ?? "a milestone"}`;

        case "DELIVERABLE_APPROVED":
            return `Deliverable approved for ${m.milestoneTitle ?? "a milestone"}`;

        case "PAYMENT_INITIATED":
            return `Payment of ₹${m.amount ?? "—"} has been initiated`;

        case "PAYMENT_RELEASED":
            return `Payment of ₹${m.amount ?? "—"} has been released`;

        case "AGREEMENT_COMPLETED":
            return `Agreement completed successfully`;

        default:
            return prettyAction(log.action);
    }
}

function getAgreementLink(log: ActivityLog) {
    return log.metadata?.agreementId
        ? `/agreements/${log.metadata.agreementId}`
        : null;
}
