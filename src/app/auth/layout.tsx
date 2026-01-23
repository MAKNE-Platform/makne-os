import AuthLeft from "@/components/auth/AuthLeft";
import AuthRight from "@/components/auth/AuthRight";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Branding */}
      <section className="hidden md:flex flex-col justify-center px-16 bg-black">
        <AuthLeft />
      </section>

      {/* Right: Auth content */}
      <AuthRight>
        {children}
      </AuthRight>
    </main>
  );
}
