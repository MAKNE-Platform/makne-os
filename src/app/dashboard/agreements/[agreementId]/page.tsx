import { loadEvents } from "@/core/events/dispatcher";
import { projectAgreement } from "@/core/agreements/read-model";
import EventTimeline from "./EventTimeline";

type ParticipantStatus =
    | "ASSIGNED"
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED";

function deriveParticipantStatuses(events: any[]) {
    const participants = new Map<
        string,
        { status: ParticipantStatus }
    >();

    for (const event of events) {
        switch (event.type) {
            case "AGREEMENT_PARTY_ASSIGNED": {
                const ids: string[] = [];

                const p = event.payload;
                if (p?.userId) ids.push(p.userId);
                if (p?.creatorId) ids.push(p.creatorId);
                if (Array.isArray(p?.userIds)) ids.push(...p.userIds);
                if (Array.isArray(p?.invitedUserIds))
                    ids.push(...p.invitedUserIds);

                for (const id of ids) {
                    if (!participants.has(id)) {
                        participants.set(id, { status: "PENDING" });
                    }
                }
                break;
            }

            case "AGREEMENT_ACCEPTED_BY_CREATOR": {
                const id = event.actorId;
                if (participants.has(id)) {
                    participants.set(id, { status: "ACCEPTED" });
                }
                break;
            }

            case "AGREEMENT_REJECTED_BY_CREATOR": {
                const id = event.actorId;
                if (participants.has(id)) {
                    participants.set(id, { status: "REJECTED" });
                }
                break;
            }
        }
    }

    return Array.from(participants.entries()).map(
        ([id, data]) => ({
            id,
            status: data.status,
        })
    );
}

type MilestoneStatus =
    | "CREATED"
    | "COMPLETED"
    | "RELEASED"
    | "BLOCKED";

type MilestoneView = {
    id: string;
    title?: string;
    amount?: number;
    status: MilestoneStatus;
};

function deriveMilestones(events: any[]): MilestoneView[] {
    const milestones = new Map<string, MilestoneView>();

    for (const event of events) {
        switch (event.type) {
            case "MILESTONE_CREATED": {
                const payload = event.payload ?? {};
                const milestoneId = payload.milestoneId;

                if (milestoneId) {
                    milestones.set(milestoneId, {
                        id: milestoneId,
                        title:
                            payload.title ??
                            payload.name ??
                            payload.label ??
                            undefined,
                        amount: payload.amount,
                        status: "CREATED",
                    });
                }
                break;
            }

            case "MILESTONE_COMPLETED": {
                const { milestoneId } = event.payload ?? {};
                if (milestoneId && milestones.has(milestoneId)) {
                    milestones.get(milestoneId)!.status = "COMPLETED";
                }
                break;
            }

            case "MILESTONE_RELEASED": {
                const { milestoneId } = event.payload ?? {};
                if (milestoneId && milestones.has(milestoneId)) {
                    milestones.get(milestoneId)!.status = "RELEASED";
                }
                break;
            }

            case "MILESTONE_BLOCKED": {
                const { milestoneId } = event.payload ?? {};
                if (milestoneId && milestones.has(milestoneId)) {
                    milestones.get(milestoneId)!.status = "BLOCKED";
                }
                break;
            }
        }
    }

    return Array.from(milestones.values());
}


type PaymentSummary = {
    currency?: "INR" | "USD";
    totalAmount?: number;
    releaseMode?: "MANUAL" | "AUTO";
    escrowRequired?: boolean;

    releasedAmount: number;
    pendingAmount: number;

    splits: {
        milestoneId: string;
        milestoneTitle?: string;
        amount: number;
        released: boolean;
    }[];

};

function derivePayments(events: any[]): PaymentSummary {
    let currency: PaymentSummary["currency"];
    let totalAmount: number | undefined;
    let releaseMode: PaymentSummary["releaseMode"];
    let escrowRequired: boolean | undefined;

    const splits = new Map<
        string,
        { milestoneId: string; amount: number; released: boolean }
    >();

    let releasedAmount = 0;

    for (const event of events) {
        switch (event.type) {
            case "PAYMENT_DEFINED": {
                const p = event.payload ?? {};
                currency = p.currency;
                totalAmount = p.totalAmount;
                releaseMode = p.releaseMode;
                escrowRequired = p.escrowRequired;
                break;
            }

            case "PAYMENT_SPLIT_DEFINED": {
                const { milestoneId, amount } = event.payload ?? {};
                if (milestoneId && amount) {
                    splits.set(milestoneId, {
                        milestoneId,
                        amount,
                        released: false,
                    });
                }
                break;
            }

            case "PAYMENT_RELEASED":
            case "PAYMENT_AUTO_RELEASED": {
                const { milestoneId, amount } = event.payload ?? {};

                if (milestoneId && splits.has(milestoneId)) {
                    splits.get(milestoneId)!.released = true;
                }

                if (amount) {
                    releasedAmount += amount;
                }
                break;
            }
        }
    }

    const pendingAmount =
        typeof totalAmount === "number"
            ? totalAmount - releasedAmount
            : 0;

    return {
        currency,
        totalAmount,
        releaseMode,
        escrowRequired,
        releasedAmount,
        pendingAmount,
        splits: Array.from(splits.values()),
    };
}


export default async function AgreementDetailsPage({
    params,
}: {
    params: Promise<{ agreementId: string }>;
}) {
    const { agreementId } = await params;

    const events = await loadEvents(agreementId);

    const participantStatuses = deriveParticipantStatuses(events);
    const milestones = deriveMilestones(events);
    const payments = derivePayments(events);

    const milestoneTitleMap = new Map(
        milestones.map((m) => [m.id, m.title])
    );

    payments.splits = payments.splits.map((s) => ({
        ...s,
        milestoneTitle: milestoneTitleMap.get(s.milestoneId),
    }));



    if (!events || events.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-semibold">
                    Agreement not found
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                    No events exist for this agreement.
                </p>
            </div>
        );
    }

    const summary = projectAgreement(events);

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">
                    {summary.title}
                </h1>

                <div className="text-sm text-muted-foreground">
                    Status: <span className="font-medium">{summary.state}</span>
                </div>
            </div>


            {/* participants */}
            <div className="space-y-2">
                <h2 className="text-lg font-medium">Participants</h2>

                {participantStatuses.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No participants assigned yet.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {participantStatuses.map((p) => (
                            <li
                                key={p.id}
                                className="flex items-center justify-between border rounded-md px-3 py-2 text-sm"
                            >
                                <span>{p.id}</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                    {p.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* MILESTONES */}
            <div className="space-y-2">
                <h2 className="text-lg font-medium">Milestones</h2>

                {milestones.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No milestones defined yet.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {milestones.map((m) => (
                            <li
                                key={m.id}
                                className="flex items-center justify-between border rounded-md px-3 py-2 text-sm"
                            >
                                <div>
                                    <div className="font-medium">
                                        {m.title ?? "Untitled milestone"}
                                    </div>
                                    {m.amount !== undefined && (
                                        <div className="text-xs text-muted-foreground">
                                            Amount: {m.amount}
                                        </div>
                                    )}
                                </div>

                                <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                    {m.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* payments */}
            <div className="space-y-3">
                <h2 className="text-lg font-medium">Payments</h2>

                {!payments.totalAmount ? (
                    <div className="text-sm text-muted-foreground">
                        No payment terms defined yet.
                    </div>
                ) : (
                    <div className="space-y-3 border rounded-lg p-4 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div>Total Amount</div>
                            <div>
                                {payments.currency} {payments.totalAmount}
                            </div>

                            <div>Released</div>
                            <div>
                                {payments.currency} {payments.releasedAmount}
                            </div>

                            <div>Pending</div>
                            <div>
                                {payments.currency} {payments.pendingAmount}
                            </div>

                            <div>Release Mode</div>
                            <div>{payments.releaseMode}</div>
                        </div>

                        {payments.splits.length > 0 && (
                            <div className="pt-3 space-y-2">
                                <div className="font-medium">Milestone Split</div>

                                <ul className="space-y-1">
                                    {payments.splits.map((s) => (
                                        <li
                                            key={s.milestoneId}
                                            className="flex justify-between text-xs border rounded px-2 py-1"
                                        >
                                            <span>
                                                {s.milestoneTitle ?? "Untitled milestone"}
                                            </span>

                                            <span>
                                                {payments.currency} {s.amount}{" "}
                                                {s.released ? "(released)" : "(pending)"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>


            {/* event timeline */}
            <div>
                <h2 className="text-lg font-medium">Event Timeline</h2>
                <EventTimeline events={events} />
            </div>
        </div>
    );
}
