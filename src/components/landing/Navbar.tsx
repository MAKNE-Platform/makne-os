"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {

    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
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
    }, []);

    const [mobileOpen, setMobileOpen] = useState(false);


    return (
        <div className="fixed top-0 left-1/2 z-50 w-full -translate-x-1/2">
            <nav
                className="
          flex items-center justify-between
          lg:px-6 px-3 py-4
          backdrop-blur-md
          border-b border-white/10
        "
            >
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <a href="/">
                        <Image
                        src="/makne-logo-lg.png"
                        alt="Makne"
                        width={68}
                        height={68}
                        priority
                    />
                    </a>
                </div>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
                    <a
                        href="#features"
                        className={`relative text-sm transition ${activeSection === "features"
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

                    <a
                        href="#how-it-works"
                        className={`relative text-sm transition ${activeSection === "features"
                            ? "text-white"
                            : "text-zinc-400 hover:text-zinc-200"
                            }`}
                    >
                        How it works

                        {activeSection === "how-it-works" && (
                            <motion.span
                                layoutId="nav-indicator"
                                className="absolute -bottom-2 left-0 right-0 h-px bg-[#636EE1]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </a>

                    <a
                        href="#pricing"
                        className={`relative text-sm transition ${activeSection === "features"
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

                </div>


                <div className="flex gap-2">
                    {/* Actions */}
                    <div className="flex items-center gap-2 text-sm">
                        <Link
                            href="/auth/login"
                            className="rounded-full border border-white/10 px-5 py-1.5 text-sm text-zinc-300 hover:text-white transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="
              rounded-full
              bg-white
              px-4 py-1.5
              text-black
              font-medium
              hover:brightness-95
              transition
            "
                        >
                            Sign up
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:text-white transition"
                        aria-label="Toggle menu"
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
        bg-[#0E1117]/95
        backdrop-blur
        p-4
      "
                    >
                        <nav className="flex flex-col gap-4 text-sm">
                            {[
                                { id: "features", label: "Features" },
                                { id: "timeline", label: "How it works" },
                                { id: "pricing", label: "Pricing" },
                            ].map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
              flex items-center justify-between
              px-3 py-2 rounded-lg transition
              ${activeSection === item.id
                                            ? "text-white bg-white/5"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        }
            `}
                                >
                                    {item.label}
                                    {activeSection === item.id && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#636EE1]" />
                                    )}
                                </a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
