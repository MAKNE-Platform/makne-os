"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import LogoutButton from "../LogoutButton";

type Props = {
  active?:
  | "dashboard"
  | "agreements"
  | "portfolio"
  | "inbox"
  | "payments"
  | "analytics";

  displayName?: string;
  profileImage?: string;

  agreementsCount?: number;
  inboxCount: number;
  pendingDeliverablesCount?: number;
  pendingPaymentsCount?: number;
};

export default function CreatorMobileTopNav({
  displayName,
  profileImage,
  agreementsCount,
  inboxCount,
  pendingPaymentsCount,
  pendingDeliverablesCount,
}: Props) {

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  return (
    <div className="lg:hidden sticky top-0 z-[100] bg-black border-b border-white/10">

      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-4 bg-[#00000032] backdrop-blur-lg">

        <Link href="/creator/dashboard">
          <Image
            src="/makne-logo-lg.png"
            alt="Makne"
            width={96}
            height={24}
            priority
          />
        </Link>

        <div className="flex items-center gap-3">

          {/* Inbox */}
          <Link
            href="/creator/inbox"
            className="relative h-9 w-9 rounded-full border border-white/10 flex items-center justify-center"
          >
            <Bell />
            {inboxCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-[#636EE1] text-black text-[11px] font-medium flex items-center justify-center px-1">
                {inboxCount}
              </span>
            )}
          </Link>

          {/* Menu */}
          <button
            ref={buttonRef}
            onClick={() => setOpen(v => !v)}
            className="h-9 w-9 rounded-full border border-white/10 overflow-hidden bg-white/10 flex items-center justify-center"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-white/70">
                {displayName?.[0]?.toUpperCase() ?? "C"}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-3 w-[95%] left-[50%] translate-x-[-50%] rounded-2xl border border-white/10 bg-[#0e111770] px-4 py-4 space-y-2 backdrop-blur-2xl"
          >
            <NavItem label="Dashboard" href="/creator/dashboard" />
            <NavItem label="Agreements" href="/creator/agreements" badge={agreementsCount} />
            <NavItem label="Inbox" href="/creator/inbox" badge={inboxCount} />
            <NavItem label="Portfolio" href="/creator/portfolio" />
            <NavItem label="Analytics" href="/creator/analytics" />
            <NavItem label="Payments" href="/creator/payments" badge={pendingPaymentsCount} />
            <LogoutButton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5 transition"
    >
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="min-w-[18px] h-4 rounded-full bg-[#636EE1] text-black text-[10px] font-medium flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </Link>
  );
}
