export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white p-10 animate-pulse">
      <div className="h-8 w-48 bg-white/10 rounded mb-6" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-white/5 rounded-xl border border-white/10"
          />
        ))}
      </div>
    </div>
  );
}