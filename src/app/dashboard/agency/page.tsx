import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AgencyDashboard() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;

  if (role !== "AGENCY") {
    redirect(`/dashboard/${role?.toLowerCase()}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">Agency Dashboard</h1>
    </div>
  );
}
