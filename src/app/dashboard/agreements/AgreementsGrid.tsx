import AgreementCard from "./AgreementCard";

export default function AgreementsGrid({
  agreements,
}: {
  agreements: any[];
}) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {agreements.map((agreement) => (
        <AgreementCard
          key={agreement.agreementId}
          agreement={agreement}
        />
      ))}
    </div>
  );
}
