type AgreementSummary = {
  agreementId: string;
  title: string;
  state: string;
  createdAt: string;
  participants: string[];
};

export default function AgreementCard({
  agreement,
}: {
  agreement: AgreementSummary;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-3 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-sm">
          {agreement.title}
        </h3>

        <span className="text-xs px-2 py-1 rounded-full bg-muted">
          {agreement.state}
        </span>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <div>
          Participants: {agreement.participants.length}
        </div>
        <div>
          Created:{" "}
          {new Date(agreement.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
