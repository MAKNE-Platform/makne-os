"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

export default function MobileTopNav() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                open &&
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                !buttonRef.current?.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    useEffect(() => {
        if (!open) return;

        function handleScroll() {
            setOpen(false);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [open]);


    return (
        <div className="lg:hidden sticky top-0 z-40 bg-black border-b border-white/10">

            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3">
                <Image
                    src="/makne-logo-lg.png"
                    alt="Makne"
                    width={96}
                    height={24}
                    priority
                />

                <button
                    onClick={() => setOpen(v => !v)}
                    className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-white"
                    aria-label={open ? "Close menu" : "Open menu"}
                >
                    <motion.span
                        key={open ? "close" : "open"}
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                        {open ? "✕" : "☰"}
                    </motion.span>

                </button>

            </div>

            {/* Dropdown menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="
        absolute
        top-full
        left-0
        right-0
        border-t border-white/10
        bg-[#00000011]
        px-4 py-4
        space-y-2
        backdrop-blur-2xl
      "
                    >
                        <NavItem label="Dashboard" href="/dashboard/brand" />
                        <NavItem label="Agreements" href="/agreements" />
                        <NavItem label="Activity" href="/system/activity" />
                        <NavItem label="Inbox" href="/brand/notifications" />
                        <NavItem label="Analytics" />
                        <NavItem label="Payments" />

                        <div className="pt-4 border-t border-white/10">
                            <Link
                                href="/brand/settings"
                                className="block text-sm text-[#636EE1]"
                            >
                                Manage brand
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
}

function NavItem({
    label,
    href = "#",
}: {
    label: string;
    href?: string;
}) {
    return (
        <Link
            href={href}
            className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5"
        >
            {label}
        </Link>
    );
}
