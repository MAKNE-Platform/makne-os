import { redirect } from "next/navigation";
import { getBrandAgreements } from "@/core/agreements/read/getBrandAgreements";
import AgreementsGrid from "./AgreementsGrid";
import { getCurrentUser } from "@/core/auth/contract";

export default async function AgreementsPage() {
  const user = await getCurrentUser();

  // ✅ build-safe auth gate
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "BRAND") {
    redirect("/dashboard");
  }

  const agreements = await getBrandAgreements(user.userId);

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
