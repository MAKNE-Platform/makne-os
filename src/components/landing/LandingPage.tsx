"use client";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Timeline from "@/components/landing/Timeline";
import Image from "next/image";
import { useState } from "react";

export default function LandingPage() {


  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <main className="relative min-h-screen bg-black text-zinc-100 overflow-hidden">

      {/* ================= FLOATING NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen px-6 pt-40 flex items-start justify-center overflow-hidden">

        <div className="flex-col items-center justify-center ">
          <div className="flex justify-center items-center">
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
                <p>Structured collaboration platform</p>
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
              <p className="mt-6 max-w-[42rem] mx-auto text-base md:text-lg text-zinc-400 leading-relaxed">
                MAKNE helps brands, creators, and agencies collaborate through structured
                agreements, tracked execution, and acceptance-based payments — built for
                clarity, not chaos.
              </p>

              {/* CTA */}
              <div className="mt-10 flex justify-center gap-4">
                <a
                  href="/auth/signup"
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:brightness-95 transition"
                >
                  Get started
                </a>

                <a
                  href="/auth/login"
                  className="rounded-full border border-white/10 px-6 py-3 text-sm text-zinc-300 hover:text-white transition"
                >
                  Login
                </a>
              </div>
            </div>
          </div>

          <img className="lg:w-[95%] md:w-[95%] w-[90%] ml-[50%] mt-10 lg:mt-14 translate-x-[-50%] border border-[#636de173] lg:rounded-[50px] md:rounded-2xl rounded-2xl mb-20 " src="brand-dashboard.png" alt="Brand Dashboard" />
        </div>
      </section>


      {/* ================= FEATURES — BENTO STYLE ================= */}
      <section id="features" className="px-6 py-30 border-t border-white/20">
        <div className="mx-auto max-w-7xl">

          {/* Section Intro */}
          <div className="mb-20 max-w-2xl">
            <div className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-medium text-zinc-100">
              Built for clarity, not chaos
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              MAKNE turns collaborations into deterministic systems —
              agreements, execution, and payments working as one.
            </p>
          </div>

          {/* Bento Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-black p-4 lg:auto-rows-[220px]">

            {/* ================= STRUCTURED AGREEMENTS ================= */}
            <div
              onMouseMove={handleMouseMove}
              className="lg:col-span-1 lg:row-span-2
    rounded-3xl bg-[#0f141bce]
    p-6 sm:p-8
    group relative overflow-hidden
    transition-all duration-300"
            >
              {/* Glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,110,225,0.15), transparent 40%)`,
                }}
              />

              {/* Text */}
              <div className="relative lg:absolute lg:bottom-6 lg:left-6 lg:w-2/3 z-10">
                <h3 className="text-xl sm:text-2xl text-zinc-100 font-medium">
                  Structured Agreements
                </h3>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-400">
                  Deliverables, milestones and payment terms clearly defined from day one.
                </p>
              </div>

              {/* Image */}
              <div className="
      relative mt-6
      w-32 h-32 sm:w-40 sm:h-40
      lg:absolute lg:top-0 lg:left-2 lg:w-56 lg:h-56
      opacity-90">
                <Image
                  src="/images/structured_agreements.png"
                  fill
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>

            {/* ================= EVENT TIMELINE ================= */}
            <div
              onMouseMove={handleMouseMove}
              className="lg:col-span-3
    rounded-3xl bg-[#0f141bce]
    p-6 sm:p-8
    group relative overflow-hidden
    transition-all duration-300"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,110,225,0.15), transparent 40%)`,
                }}
              />

              <div className="lg:mt-15">
                <h3 className="text-xl sm:text-2xl text-zinc-100 font-medium">
                  Event-Based Timeline
                </h3>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-400 max-w-md">
                  Every action recorded permanently and chronologically structured.
                </p>

              </div>

              <div className="
      relative mt-6 lg:h-58 lg:w-58 
     sm:w-36 sm:h-36
      lg:absolute lg:bottom-6 lg:right-6 
      opacity-90">
                <Image
                  src="/images/event_based_timeline.png"
                  fill
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>

            {/* ================= DETERMINISTIC EXECUTION ================= */}
            <div
              onMouseMove={handleMouseMove}
              className="lg:col-span-2
    rounded-3xl bg-[#0f141bce]
    p-6
    group relative overflow-hidden
    transition-all duration-300"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,110,225,0.15), transparent 40%)`,
                }}
              />

              <h3 className="text-lg lg:text-2xl sm:text-xl text-zinc-100 font-medium">
                Deterministic Execution
              </h3>
              <p className="mt-3 lg:text-md text-sm text-zinc-400">
                No state moves forward without conditions met.
              </p>

              <div className="
      relative mt-6
      w-20 h-20 sm:w-24 sm:h-24
      lg:absolute lg:bottom-4 lg:right-4 lg:w-48 lg:h-48 lg:mr-10
      opacity-90">
                <Image
                  src="/images/deterministic_execution.png"
                  fill
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>

            {/* ================= ACCEPTANCE PAYMENTS ================= */}
            <div
              onMouseMove={handleMouseMove}
              className="rounded-3xl bg-[#0f141bce]
    p-6
    group relative overflow-hidden
    transition-all duration-300"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,110,225,0.15), transparent 40%)`,
                }}
              />

              <h3 className="text-lg sm:text-xl text-zinc-100 font-medium">
                Acceptance-Based Payments
              </h3>
              <p className="mt-3 text-sm text-zinc-400 lg:w-30">
                Release only after milestone approval.
              </p>

              <div className="
      relative mt-6 sm:right-2
      lg:w-40 lg:h-40 sm:w-24 sm:h-24
      lg:absolute lg:bottom-4 lg:-right-2
      opacity-90">
                <Image
                  src="/images/acceptance_based_payments.png"
                  fill
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>

            {/* ================= AUDIT HISTORY ================= */}
            <div
              onMouseMove={handleMouseMove}
              className="rounded-3xl bg-[#0f141bce]
    p-6
    group relative overflow-hidden
    transition-all duration-300"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,110,225,0.15), transparent 40%)`,
                }}
              />

              <div className="lg:mt-22">
                <h3 className="text-lg sm:text-xl lg:w-1/2 text-zinc-100 font-medium">
                  Audit-Ready History
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Every decision permanently recorded.
                </p>
              </div>

              <div className="
      relative mt-6
      lg:w-40 lg:h-40 sm:w-24 sm:h-24
      lg:absolute lg:-top-2 lg:-right-2
      opacity-90">
                <Image
                  src="/images/audit_ready_history.png"
                  fill
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>

            {/* ================= BUILT FOR SCALE ================= */}
            <div
              onMouseMove={handleMouseMove}
              className="lg:col-span-3
    rounded-3xl bg-[#0f141bce]
    p-6 sm:p-8
    group relative overflow-hidden
    transition-all duration-300"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,110,225,0.15), transparent 40%)`,
                }}
              />

              <h3 className="text-xl sm:text-2xl text-zinc-100 font-medium">
                Built for Scale
              </h3>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-400 max-w-md">
                Manage multiple creators, campaigns and agreements without losing clarity.
              </p>

              <div className="
      relative mt-6 lg:h-55 lg:w-55
      w-28 h-28 sm:w-36 sm:h-36
      lg:absolute lg:-bottom-5 lg:right-6 
      opacity-90">
                <Image
                  src="/images/built_for_scale.png"
                  fill
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= TIMELINE ================= */}
      <Timeline />

      {/* ================= PRICING ================= */}
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
      <footer className="border-t mt-10 border-white/20 px-6 py-10">
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
          <div className="mt-16 flex flex-col gap-4 border-t border-white/20 pt-6 text-xs text-zinc-500 sm:flex-row sm:justify-between">
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

