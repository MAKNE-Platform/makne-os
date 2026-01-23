// app/page.tsx
import Hero from "@/components/landing/Hero";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CTASection />
    </main>
  );
}
