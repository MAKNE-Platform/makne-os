"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();

  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = pathname === "/";
  const isHowItWorks = pathname === "/how-it-works";

  useEffect(() => {
    if (!isLanding) return;

    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isLanding]);

  return (
    <div className="fixed top-0 left-1/2 z-50 w-full -translate-x-1/2">
      <nav
        className="
          flex items-center justify-between
          lg:px-6 px-3 py-4
          backdrop-blur-md
          border-b border-white/10
          bg-black/60
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/makne-logo-lg.png"
              alt="Makne"
              width={68}
              height={68}
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          
          {/* Features */}
          {isLanding ? (
            <a
              href="#features"
              className={`relative transition ${
                activeSection === "features"
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Features
              {activeSection === "features" && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-px bg-[#636EE1]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          ) : (
            <Link
              href="/#features"
              className="text-zinc-400 hover:text-zinc-200 transition"
            >
              Features
            </Link>
          )}

          {/* How It Works */}
          <Link
            href="/how-it-works"
            className={`relative transition ${
              isHowItWorks
                ? "text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            How it works
            {isHowItWorks && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute -bottom-2 left-0 right-0 h-px bg-[#636EE1]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>

          {/* Pricing */}
          {isLanding ? (
            <a
              href="#pricing"
              className={`relative transition ${
                activeSection === "pricing"
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Pricing
              {activeSection === "pricing" && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-px bg-[#636EE1]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          ) : (
            <Link
              href="/#pricing"
              className="text-zinc-400 hover:text-zinc-200 transition"
            >
              Pricing
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/auth/login"
              className="rounded-full border border-white/10 px-5 py-1.5 text-zinc-300 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="
                rounded-full
                bg-[#636EE1]
                px-4 py-1.5
                text-white
                font-medium
                hover:opacity-90
                transition
              "
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:text-white transition"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE NAV ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              md:hidden
              absolute
              top-full
              left-1/2
              -translate-x-1/2
              mt-3
              w-[90%]
              rounded-2xl
              border border-white/10
              bg-black/80
              backdrop-blur
              p-4
            "
          >
            <nav className="flex flex-col gap-4 text-sm">
              <Link
                href="/#features"
                onClick={() => setMobileOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                Features
              </Link>

              <Link
                href="/how-it-works"
                onClick={() => setMobileOpen(false)}
                className={`${
                  isHowItWorks ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                How it works
              </Link>

              <Link
                href="/#pricing"
                onClick={() => setMobileOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                Pricing
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}