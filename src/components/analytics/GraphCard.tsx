export default function GraphCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-6">
      <div className="mb-4 text-sm font-medium opacity-80">
        {title}
      </div>
      {children}
    </div>
  );
}
