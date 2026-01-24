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
      <aside className="w-64 border-r border-white/10 p-6">
        <h1 className="text-lg font-semibold text-[#636EE1]">MAKNE</h1>
        <nav className="mt-8 space-y-3 text-sm text-zinc-400">
          <div>Dashboard</div>
          <div>Agreements</div>
          <div>Settings</div>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
