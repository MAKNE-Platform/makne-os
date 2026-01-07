import { getBrandAgreements } from "@/core/agreements/read/getBrandAgreements";
import AgreementsGrid from "./AgreementsGrid";

export default async function AgreementsPage() {
  const brandId = "brand_1"; // TEMP auth
  const agreements = await getBrandAgreements(brandId);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Agreements</h1>
        <p className="text-sm text-muted-foreground">
          All agreements created by your brand
        </p>
      </div>

      {agreements.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          You haven’t created any agreements yet.
        </div>
      ) : (
        <AgreementsGrid agreements={agreements} />
      )}
    </div>
  );
}
