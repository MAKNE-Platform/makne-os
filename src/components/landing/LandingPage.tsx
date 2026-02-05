import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Timeline from "@/components/landing/Timeline";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-black text-zinc-100 overflow-hidden">

      {/* ================= FLOATING NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen px-6 pt-48 flex items-start justify-center overflow-hidden">

        {/* Background vignette */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Soft dark vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,110,225,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0B0E14] to-black" />
        </div>

        <div className="max-w-3xl text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#636EE1]" />
            Structured collaboration platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-medium leading-tight tracking-tight text-zinc-100">
            Trust, execute, and get paid{" "}
            <span
              className="
      bg-gradient-to-r
      from-[#A5B4FC]
      via-[#636EE1]
      to-[#22D3EE]
      bg-clip-text
      text-transparent
      opacity-90
    "
            >
              without ambiguity
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 max-w-[42rem] mx-auto text-base md:text-lg text-zinc-400 leading-relaxed">
            MAKNE helps brands, creators, and agencies collaborate through structured
            agreements, tracked execution, and acceptance-based payments — built for
            clarity, not chaos.
          </p>

          {/* CTA */}
          <div className="mt-12 flex justify-center gap-4">
            <a
              href="/signup"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:brightness-95 transition"
            >
              Get started
            </a>

            <a
              href="/login"
              className="rounded-full border border-white/10 px-6 py-3 text-sm text-zinc-300 hover:text-white transition"
            >
              Login
            </a>
          </div>
        </div>
      </section>

      {/* ================= FEATURES — BENTO STYLE ================= */}
      <section id="features" className="relative px-6 py-40 border-t border-white/5">
        <div className="mx-auto max-w-7xl">

          {/* Section intro */}
          <div className="mb-20 max-w-2xl">
            <div className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-medium text-zinc-100">
              Built for clarity, not chaos
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              MAKNE turns collaborations into deterministic systems — agreements,
              execution, and payments working as one.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Anchor feature */}
            <div className="
  lg:col-span-2 lg:row-span-2
  rounded-2xl
  border border-white/10
  bg-[#0E1117]
  p-8
  flex flex-col justify-between
  transition duration-300 ease-out
  lg:hover:-translate-y-[2px]
  lg:hover:border-white/20
">

              <div>
                <h3 className="text-2xl font-medium text-zinc-100">
                  Structured agreements
                </h3>
                <p className="mt-4 max-w-xl text-zinc-400 leading-relaxed">
                  Every collaboration starts with a clearly defined agreement.
                  Deliverables, milestones, timelines, and payment terms are explicit
                  from day one — so expectations are aligned before any work begins.
                </p>
              </div>

              {/* Future real UI */}
              <div className="
  rounded-2xl
  border border-white/10
  bg-[#0E1117]
  p-6
  transition duration-300 ease-out
  lg:hover:-translate-y-[2px]
  lg:hover:border-white/20
" />

            </div>

            {/* Feature 2 */}
            <div className="
  rounded-2xl
  border border-white/10
  bg-[#0E1117]
  p-6
  transition duration-300 ease-out
  lg:hover:-translate-y-[2px]
  lg:hover:border-white/20
">

              <h3 className="text-lg font-medium text-zinc-100">
                Event-based timeline
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Every action is recorded as a permanent event — assignments,
                approvals, submissions, and payments.
              </p>

              <div className="mt-6 h-24 rounded-lg border border-white/5 bg-black/30" />
            </div>

            {/* Feature 3 */}
            <div className="
  rounded-2xl
  border border-white/10
  bg-[#0E1117]
  p-6
  transition duration-300 ease-out
  lg:hover:-translate-y-[2px]
  lg:hover:border-white/20
">

              <h3 className="text-lg font-medium text-zinc-100">
                Acceptance-based payments
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Payments are released only when milestones are completed and approved.
                No ambiguity. No chasing.
              </p>

              <div className="mt-6 h-24 rounded-lg border border-white/5 bg-black/30" />
            </div>

            {/* Feature 4 */}
            <div className="
  rounded-2xl
  border border-white/10
  bg-[#0E1117]
  p-6
  transition duration-300 ease-out
  lg:hover:-translate-y-[2px]
  lg:hover:border-white/20
">

              <h3 className="text-lg font-medium text-zinc-100">
                Deterministic execution
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                State transitions and payouts follow predefined rules.
                Nothing moves forward unless conditions are met.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="
  rounded-2xl
  border border-white/10
  bg-[#0E1117]
  p-6
  transition duration-300 ease-out
  lg:hover:-translate-y-[2px]
  lg:hover:border-white/20
">

              <h3 className="text-lg font-medium text-zinc-100">
                Built for scale
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Manage multiple creators, campaigns, and agreements
                without losing structure or clarity.
              </p>
            </div>

            {/* Feature 6 — closes the rectangle */}
            <div className="
  rounded-2xl
  border border-white/10
  bg-[#0E1117]
  p-6
  transition duration-300 ease-out
  lg:hover:-translate-y-[2px]
  lg:hover:border-white/20
">

              <h3 className="text-lg font-medium text-zinc-100">
                Audit-ready history
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Every decision, submission, and approval is permanently recorded,
                making agreements transparent, traceable, and dispute-resistant.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ================= TIMELINE ================= */}
      <Timeline />

      {/* ================= PRICING (OBVIOUS DIFFERENCE) ================= */}
      <section id="pricing" className="py-32 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium">Pricing</h2>

          <div className="mt-20 grid gap-10 md:grid-cols-3 text-left">

            {/* Creator */}
            <PricingCard
              title="Creator"
              price="No subscription"
              meta="Platform commission on payouts"
            />

            {/* Brand (PRIMARY) */}
            <PricingCard
              title="Brand"
              price="Quarterly / Annual"
              meta="Billed per agreement or campaign"
              highlight
            />

            {/* Agency */}
            <PricingCard
              title="Agency"
              price="Monthly"
              meta="Based on active clients & volume"
            />


          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t mt-10 border-white/5 px-6 py-10">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-[2fr_3fr_2fr]">

            {/* Brand */}
            <div>
              <img
                src="/makne-logo-lg.png"
                alt="MAKNE"
                className="h-7 mb-4"
              />
              <p className="max-w-xs text-sm text-zinc-400 leading-relaxed">
                MAKNE helps brands, creators, and agencies collaborate through
                structured agreements and acceptance-based payments.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

              {/* Product */}
              <div>
                <div className="mb-3 text-zinc-200 font-medium">
                  Product
                </div>
                <ul className="space-y-2 text-zinc-400">
                  <li><a href="#features" className="hover:text-white transition">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#timeline" className="hover:text-white transition">Timeline</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <div className="mb-3 text-zinc-200 font-medium">
                  Company
                </div>
                <ul className="space-y-2 text-zinc-400">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <div className="mb-3 text-zinc-200 font-medium">
                  Legal
                </div>
                <ul className="space-y-2 text-zinc-400">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">Security</a></li>
                </ul>
              </div>

            </div>

            {/* CTA */}
            <div className="flex flex-col justify-between gap-6">
              <p className="text-sm text-zinc-400">
                Ready to bring clarity to your collaborations?
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="/auth/signup"
                  className="inline-flex justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:brightness-95 transition"
                >
                  Get started
                </a>
                <a
                  href="/contact"
                  className="inline-flex justify-center rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:text-white transition"
                >
                  Contact sales
                </a>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col gap-4 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row sm:justify-between">
            <div>
              © {new Date().getFullYear()} MAKNE. All rights reserved.
            </div>
            <div>
              Built for trust, clarity, and execution.
            </div>
          </div>

        </div>
      </footer>

    </main>
  );
}

/* ================= PRICING CARD ================= */

function PricingCard({
  title,
  price,
  meta,
  highlight,
}: {
  title: string;
  price: string;
  meta?: string;
  highlight?: boolean;
}) {

  return (
    <div
      className={`
        rounded-3xl p-8 flex flex-col
        ${highlight
          ? `
              bg-gradient-to-b from-[#636de16b] to-[#636de105]
              border border-[#9ca2e171]
              shadow-[0_10px_100px_rgba(99,110,225,0.6)]
              scale-[1.05]
            `
          : `
              bg-[#0f172a49]
              border border-[#636de161]
              shadow-[0_20px_60px_rgba(0,0,0,0.9)]
            `
        }
      `}
    >
      <h3 className="text-xl font-medium">{title}</h3>
      <div className="mt-6 text-3xl font-medium">{price}</div>
      {meta && (
        <div className="mt-2 text-sm text-zinc-400">
          {meta}
        </div>
      )}


      <ul className="mt-6 space-y-3 text-sm text-zinc-400">
        <li>• Structured agreements</li>
        <li>• Milestone tracking</li>
        <li>• Event-based timeline</li>

        {title === "Creator" && (
          <li>• Get paid on milestone approval</li>
        )}

        {title === "Brand" && (
          <li>• Acceptance-based payouts</li>
        )}

        {title === "Agency" && (
          <li>• Manage multiple brands & creators</li>
        )}
      </ul>


      <Link
        href="/auth/signup"
        className="mt-8 inline-flex justify-center px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
      >
        Get started
      </Link>
    </div>
  );
}

