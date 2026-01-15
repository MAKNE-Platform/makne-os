import AgreementCard from "./AgreementCard";
import { AgreementSummary } from "@/core/agreements/read-model";

/**
 * Order in which agreements appear on dashboard
 */
const STATE_PRIORITY: AgreementSummary["state"][] = [
  "ACTIVE",
  "EXECUTING",
  "NEGOTIATING",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
  "DRAFT",
];

function sortByStatePriority(
  agreements: AgreementSummary[]
): AgreementSummary[] {
  return [...agreements].sort(
    (a, b) =>
      STATE_PRIORITY.indexOf(a.state) -
      STATE_PRIORITY.indexOf(b.state)
  );
}

export default function AgreementsGrid({
  agreements,
}: {
  agreements: AgreementSummary[];
}) {
  const sortedAgreements = sortByStatePriority(agreements);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {sortedAgreements.map((agreement) => (
        <AgreementCard
          key={agreement.agreementId}
          agreement={agreement}
        />
      ))}
    </div>
  );
}
