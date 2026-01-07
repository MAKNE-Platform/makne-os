// /app/dashboard/agreements/AgreementsTable.tsx
type AgreementSummary = {
  agreementId: string;
  title: string;
  state: string;
  createdAt: string;
  participants: string[];
};

export default function AgreementsTable({
  agreements,
}: {
  agreements: AgreementSummary[];
}) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">State</th>
            <th className="px-4 py-2 text-left">Participants</th>
            <th className="px-4 py-2 text-left">Created</th>
          </tr>
        </thead>

        <tbody>
          {agreements.map((agreement) => (
            <tr
              key={agreement.agreementId}
              className="border-t"
            >
              <td className="px-4 py-2">
                {agreement.title}
              </td>

              <td className="px-4 py-2">
                {agreement.state}
              </td>

              <td className="px-4 py-2">
                {agreement.participants.length}
              </td>

              <td className="px-4 py-2">
                {new Date(
                  agreement.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
