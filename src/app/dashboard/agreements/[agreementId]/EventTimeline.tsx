// /app/dashboard/agreements/[agreementId]/EventTimeline.tsx
export default function EventTimeline({
  events,
}: {
  events: any[];
}) {
  return (
    <div className="border rounded-lg divide-y text-sm">
      {events.map((event) => (
        <div
          key={event.eventId}
          className="p-3 flex justify-between gap-4"
        >
          <div>
            <div className="font-medium">{event.type}</div>
            <div className="text-xs text-muted-foreground">
              Actor: {event.actorRole}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {new Date(event.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
