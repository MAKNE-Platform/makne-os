// src/components/auth/AuthLeft.tsx
import Image from "next/image";

export default function AuthLeft() {
  return (
    <>
      <Image
        src="/makne-logo-lg.png"
        alt="MAKNE"
        width={120}
        height={120}
        className="mb-8"
      />

      <h1 className="text-3xl font-medium leading-snug text-white">
        Collaborations, <br /> without ambiguity.
      </h1>

      <p className="mt-4 max-w-md text-sm text-zinc-400">
        MAKNE helps brands, creators, and agencies collaborate through
        structured agreements, transparent execution, and acceptance-based
        payments.
      </p>
    </>
  );
}
