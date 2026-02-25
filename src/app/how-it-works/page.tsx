"use client";

import Navbar from "@/components/landing/Navbar";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "creator" | "brand" | "agency";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<TabType>("creator");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="px-6 py-40 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
            How MAKNE Works
          </h1>

          <p className="mt-8 text-lg text-white/70 leading-relaxed">
            MAKNE introduces structure to creator collaborations.
            Agreements are defined. Milestones are tracked.
            Payments are transparent.
          </p>

          <div className="mt-8 h-[2px] w-24 mx-auto bg-[#636EE1]" />
        </div>
      </section>

      {/* ================= TABS ================= */}
      <section className="px-6">
        <div className="mx-auto max-w-5xl">

          {/* Animated Filter Tabs */}
          <div className="flex justify-center gap-10 border-b border-white/10 pb-4">
            {(["creator", "brand", "agency"] as TabType[]).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                className={`relative text-sm uppercase tracking-wider transition ${
                  activeTab === tab
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {tab}

                {activeTab === tab && (
                  <motion.span
                    layoutId="filter-indicator"
                    className="absolute -bottom-4 left-0 right-0 h-[2px] bg-[#636EE1]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Animated Content Switch */}
          <div className="mt-24 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-24"
              >
                {activeTab === "creator" && <CreatorContent />}
                {activeTab === "brand" && <BrandContent />}
                {activeTab === "agency" && <AgencyContent />}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 py-40 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">
          Ready to collaborate with clarity?
        </h2>

        <p className="mt-6 mb-6 text-white/60">
          Structured workflows. Transparent payments. Professional execution.
        </p>

        <Link
          href="/auth/signup"
          className="px-8 py-3 bg-[#636EE1] rounded-full hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}

/* ================= SECTION BLOCK ================= */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid md:grid-cols-[120px_1fr] gap-10 items-start"
    >
      <div className="relative">
        <span className="text-6xl font-bold text-white/5 select-none">
          {number}
        </span>
        <div className="absolute top-5 left-10 w-2 h-2 bg-[#636EE1] rounded-full" />
      </div>

      <div>
        <h3 className="text-2xl font-medium">{title}</h3>
        <p className="mt-4 text-white/70 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ================= CREATOR ================= */

function CreatorContent() {
  return (
    <>
      <Step
        number="01"
        title="Build Your Professional Identity"
        description="Create a structured presence that clearly communicates your niche, audience positioning, portfolio, and collaboration preferences. Instead of repeatedly explaining your value in direct messages, your MAKNE profile presents you as a professional partner ready for structured brand work."
      />
      <Step
        number="02"
        title="Start With Defined Agreements"
        description="Every collaboration begins with clarity. Deliverables, milestone breakdowns, timelines, and payment allocations are defined before execution starts. This ensures mutual alignment and removes ambiguity around expectations."
      />
      <Step
        number="03"
        title="Execute Through Milestones"
        description="Projects are divided into structured milestones, allowing you to submit work in stages, receive documented feedback, manage revisions, and track approval status. Each step of the collaboration lifecycle is visible and organized."
      />
      <Step
        number="04"
        title="Receive Milestone-Based Payments"
        description="Payments are directly linked to milestone approvals. Once your work is approved, funds are released and recorded transparently in your Wallet. You maintain full visibility of agreement value, released earnings, and payment history."
      />
    </>
  );
}

/* ================= BRAND ================= */

function BrandContent() {
  return (
    <>
      <Step
        number="01"
        title="Discover and Evaluate Creators"
        description="Explore structured creator profiles that communicate expertise, niche positioning, and collaboration expectations clearly. Evaluate potential partners based on defined information rather than fragmented conversations."
      />
      <Step
        number="02"
        title="Define Deliverables Before Execution"
        description="Create agreements that outline deliverables, milestone structure, payment distribution, and deadlines. By defining scope and financial allocation upfront, you establish accountability before any work begins."
      />
      <Step
        number="03"
        title="Track Collaboration Progress"
        description="Monitor milestone states in real time. View submissions, request revisions, and maintain full oversight of the collaboration lifecycle without relying on scattered communication channels."
      />
      <Step
        number="04"
        title="Approve and Release Payments"
        description="Payments are tied directly to milestone approvals. You release funds only after reviewing completed work, ensuring financial protection, transparency, and performance-based execution."
      />
    </>
  );
}

/* ================= AGENCY ================= */

function AgencyContent() {
  return (
    <>
      <Step
        number="01"
        title="Centralized Collaboration Oversight"
        description="Manage multiple creators and brand partnerships through a unified system. View active agreements, milestone progression, pending approvals, and collaboration status across projects in one structured dashboard."
      />
      <Step
        number="02"
        title="Maintain Operational Clarity"
        description="Monitor workflow movement across teams. Identify delays early, ensure milestone deadlines are met, and maintain structured accountability without relying on manual tracking or disconnected tools."
      />
      <Step
        number="03"
        title="Monitor Financial Flow"
        description="Track agreement values, released payments, and creator earnings within a consolidated financial view. Maintain clarity over revenue distribution and partnership performance at scale."
      />
      <Step
        number="04"
        title="Replace Fragmented Tools"
        description="Eliminate spreadsheets, scattered email threads, and informal coordination. MAKNE provides a defined collaboration lifecycle from agreement creation to final payment release, enabling professional execution across partnerships."
      />
    </>
  );
}