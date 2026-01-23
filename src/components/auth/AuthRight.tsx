// src/components/auth/AuthRight.tsx
export default function AuthRight({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {children}
      </div>
    </section>
  );
}
