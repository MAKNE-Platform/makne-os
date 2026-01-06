interface AgreementDetailsPageProps {
  params: {
    agreementId: string;
  };
}

export default function AgreementDetailsPage({
  params,
}: AgreementDetailsPageProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">
        Agreement Created
      </h1>

      <p className="text-neutral-600">
        Agreement ID:
        <span className="ml-2 font-mono text-sm">
          {params.agreementId}
        </span>
      </p>

      <p className="mt-4 text-sm text-neutral-500">
        This page will show full agreement details.
      </p>
    </div>
  );
}
