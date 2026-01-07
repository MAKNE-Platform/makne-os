import { loadEvents } from "@/core/events/dispatcher";
import { projectAgreement } from "@/core/agreements/read-model";
import EventTimeline from "./EventTimeline";

export default async function AgreementDetailsPage({
    params,
}: {
    params: Promise<{ agreementId: string }>;
}) {
    const { agreementId } = await params;

    const events = await loadEvents(agreementId);

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


            <div>
                <h2 className="text-lg font-medium">Participants</h2>
                {summary.participants.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No participants assigned yet.
                    </div>
                ) : (
                    <ul className="list-disc pl-5 text-sm">
                        {summary.participants.map((id) => (
                            <li key={id}>{id}</li>
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
