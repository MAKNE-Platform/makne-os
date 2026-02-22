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
      <section
        className="hidden rounded-tr-2xl rounded-br-2xl m-2 md:flex relative flex-col justify-center px-16 py-20 overflow-hidden
             bg-gradient-to-br from-[#0F1222] via-[#151A2E] to-[#1B2040]"
      >
        {/* Accent Glow Layer */}
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px]
                  bg-[#636EE1]/25 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute -top-20 -left-20 w-[400px] h-[400px]
           bg-[#636EE1]/85 blur-[140px] rounded-full
           animate-pulse pointer-events-none" />

        <div className="relative z-10">
          <AuthLeft />
        </div>
      </section>

      {/* Right: Auth content */}
      <AuthRight>
        {children}
      </AuthRight>
    </main>
  );
}
