export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0B0B0C] grid md:grid-cols-2">
      {/* Left panel */}
      <section className="hidden md:flex items-center justify-center border-r border-white/5">
        <div className="max-w-md px-12">
          <img src="/makne_logo.jpg" alt="Makne" className="h-10 mb-10" />

          <h2 className="text-3xl font-medium text-zinc-100">
            Structured agreements.
            <br />
            Deterministic execution.
          </h2>

          <p className="mt-6 text-zinc-400">
            Makne helps brands and creators collaborate with clarity —
            from agreement creation to automatic payout.
          </p>
        </div>
      </section>

      {/* Right panel */}
      <section className="flex items-center justify-center px-6">
        {children}
      </section>
    </main>
  );
}
