import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Image
        src="/makne-logo.png"
        alt="MAKNE Logo"
        width={120}
        height={120}
        priority
      />

      <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
        Trust. Execute. Get Paid.
      </h1>

      <p className="mt-4 max-w-xl text-sm text-gray-400 md:text-base">
        MAKNE helps brands, creators, and agencies collaborate through structured
        agreements, clear execution, and acceptance-based payments.
      </p>

      <div className="mt-8 flex gap-4">
        <Button href="/auth">Get Started</Button>
        <Button variant="secondary">Learn More</Button>
      </div>
    </section>
  );
}
