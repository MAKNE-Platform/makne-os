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


export default async function AgreementDetailsPage({
    params,
}: {
    params: Promise<{ agreementId: string }>;
}) {
    const { agreementId } = await params;

    const events = await loadEvents(agreementId);

    const participantStatuses = deriveParticipantStatuses(events);


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


            <div>
                <h2 className="text-lg font-medium">Event Timeline</h2>
                <EventTimeline events={events} />
            </div>
        </div>
    );
}
