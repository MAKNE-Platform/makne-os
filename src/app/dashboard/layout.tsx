import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;

  // If somehow middleware missed it
  if (!role) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      <main className="flex-1">{children}</main>
    </div>
  );
}
