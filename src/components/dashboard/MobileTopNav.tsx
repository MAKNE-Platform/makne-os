"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "../LogoutButton";

type Props = {
  brandName?: string;
  industry?: string;

  inboxCount?: number;
  draftAgreementsCount?: number;
  pendingPaymentsCount?: number;
  creatorsCount?:number;
};


export default function MobileTopNav({
  brandName,
  industry,
  inboxCount = 0,
  draftAgreementsCount = 0,
  pendingPaymentsCount = 0,
  creatorsCount,
}: Props) {

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    /* Close on outside click */
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

    /* Close on scroll */
    useEffect(() => {
        if (!open) return;

        function handleScroll() {
            setOpen(false);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [open]);

    return (
        <div className="lg:hidden sticky top-0 z-[100] bg-black border-b border-white/10">


            {/* ================= TOP BAR ================= */}
            <div className="flex items-center justify-between px-3 py-4 bg-[#00000032] backdrop-blur-lg">

                {/* Logo */}
                <a href="/brand/dashboard">
                    <Image
                    src="/makne-logo-lg.png"
                    alt="Makne"
                    width={96}
                    height={24}
                    priority
                />
                </a>

                {/* Right actions */}
                <div className="flex items-center gap-3">

                    {/* Notification bell */}
                    <Link
                        href="/brand/notifications"
                        className="
              relative
              h-9 w-9
              rounded-full
              border border-white/10
              flex items-center justify-center
              text-white
            "
                        aria-label="Notifications"
                    >
                        🔔
                        {inboxCount > 0 && (
                            <span className="
                absolute -top-1 -right-1
                h-5 min-w-[20px]
                rounded-full
                bg-[#636EE1]
                text-black
                text-[11px]
                font-medium
                flex items-center justify-center
                px-1
              ">
                                {inboxCount}
                            </span>
                        )}
                    </Link>

                    {/* Profile / Menu trigger */}
                    <button
                        ref={buttonRef}
                        onClick={() => setOpen(v => !v)}
                        className="
              h-9 w-9
              rounded-full
              border border-white/10
              bg-[#636EE1]/20
              flex items-center justify-center
              text-sm font-medium
            "
                        aria-label={open ? "Close menu" : "Open menu"}
                    >
                        {brandName?.[0]?.toUpperCase() ?? "B"}
                    </button>

                </div>
            </div>

            {/* ================= DROPDOWN MENU ================= */}
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
        mt-3
        w-full
        rounded-2xl
        border border-white/10
        bg-[#0e111770]
              px-4 py-4
              space-y-2
              backdrop-blur-2xl
            "
                    >

                        {/* Navigation */}
                        <NavItem label="Dashboard" href="/brand/dashboard" />
                        <NavItem label="Agreements" href="/agreements" badge={draftAgreementsCount} />
                        <NavItem label="Activity" href="/system/activity" />
                        <NavItem label="Inbox" href="/brand/notifications" badge={inboxCount} />
                        <NavItem label="Analytics" href="/brand/analytics" />
                        <NavItem label="Payments" href="/brand/payments" badge={pendingPaymentsCount} />
                        <NavItem label="Creators" href="/brand/creators" badge={creatorsCount} />

                        {/* Divider */}
                        <div className="pt-3 border-t border-white/10 space-y-2">

                            {/* Brand info */}
                            {brandName && (
                                <div className="text-sm font-medium">
                                    {brandName}
                                </div>
                            )}

                            {industry && (
                                <div className="text-xs opacity-60">
                                    {industry}
                                </div>
                            )}

                            <Link
                                href="/brand/settings"
                                className="block text-sm text-[#636EE1]"
                            >
                                Manage brand
                            </Link>
                            <LogoutButton />
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

/* ================= NAV ITEM ================= */

function NavItem({
  label,
  href,
  badge,
}: {
  label: string;
  href: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="
        flex items-center justify-between
        rounded-lg
        px-3 py-2
        text-sm
        hover:bg-white/5
        transition
      "
    >
      <span>{label}</span>

      {badge !== undefined && badge > 0 && (
        <span className="
          min-w-[18px]
          h-4
          rounded-full
          bg-[#636EE1]
          text-black
          text-[10px]
          font-medium
          flex items-center justify-center
          px-1
        ">
          {badge}
        </span>
      )}
    </Link>
  );
}

