"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    Mail,
    Contact,
    ChartSpline,
    HandCoins,
} from "lucide-react";

type Props = {
    // active: "dashboard" | "agreements" | "portfolio" | "profile" | "payments" | "activity" | "inbox" | "analytics";
    creatorProfile: {
        name: string;
        email?: string;
        profileImage?: string;
    };
    agreementsCount: number;
    inboxCount: number;
    pendingPaymentsCount: number;
    pendingDeliverablesCount: number;
};

export default function CreatorSidebar({

    creatorProfile,
    inboxCount = 0,
    pendingDeliverablesCount = 0,
    agreementsCount = 0,
    pendingPaymentsCount = 0,
}: Props) {

    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-white/10 bg-black px-6 py-6 overflow-y-auto">

            {/* Logo */}
            <Link href="/creator/dashboard">
                <Image
                    src="/makne-logo-lg.png"
                    alt="Makne"
                    width={120}
                    height={32}
                    priority
                />
            </Link>

            {/* Nav */}
            <nav className="mt-12 space-y-6 text-sm">

                <div className="space-y-1">
                    <SidebarItem
                        label="Dashboard"
                        href="/creator/dashboard"
                        active={pathname === "/creator/dashboard"}
                        icon={LayoutDashboard}
                    />
                    <SidebarItem
                        label="Agreements"
                        href="/creator/agreements"
                        active={pathname === "/creator/agreements"}
                        badge={agreementsCount}
                        icon={ClipboardList}
                        />

                    <SidebarItem
                        label="Inbox"
                        href="/creator/inbox"
                        active={pathname.startsWith("/creator/inbox")}
                        badge={inboxCount}
                        icon={Mail}
                    />

                </div>

                <div className="space-y-1 border-t border-white/10 pt-4">
                    <SidebarItem
                        label="Portfolio"
                        href="/creator/portfolio"
                        active={pathname.startsWith("/creator/portfolio")}
                        icon={Contact}
                    />

                    <SidebarItem
                        label="Analytics"
                        href="/creator/analytics"
                        active={pathname.startsWith("/creator/analytics")}
                        icon={ChartSpline}
                    />
                    <SidebarItem
                        label="Payments"
                        href="/creator/payments"
                        active={pathname.startsWith("/creator/payments")}
                        badge={pendingPaymentsCount}
                        icon={HandCoins}
                    />
                </div>
            </nav>

            {/* Footer */}
            <div className="mt-auto border-t border-white/10 pt-5">

                <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                        {creatorProfile.profileImage ? (
                            <img
                                src={creatorProfile.profileImage}
                                alt={creatorProfile.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-medium text-white/60">
                                {creatorProfile.name?.charAt(0)?.toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Name + Email */}
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                            {creatorProfile.name}
                        </div>

                        {creatorProfile.email && (
                            <div className="text-xs opacity-60 truncate">
                                {creatorProfile.email}
                            </div>
                        )}
                    </div>
                </div>

                <Link
                    href="/creator/portfolio"
                    className="
            mt-4 inline-flex items-center justify-center
            w-full
            text-xs
            border p-2 rounded-md
            border-[#636EE1]
            text-[#636EE1]
            hover:bg-[#636EE1]/20 hover:text-white
            transition
        "
                >
                    Manage profile
                </Link>
            </div>
        </aside>
    );
}

/* ---------- Sidebar Item ---------- */

function SidebarItem({
    label,
    href,
    active,
    badge,
    icon: Icon,
}: {
    label: string;
    href: string;
    active?: boolean;
    badge?: number;
    icon?: React.ComponentType<{ size?: number }>;
}) {
    return (
        <Link
            href={href}
            className={`
        flex items-center justify-between
        rounded-lg
        px-3 py-2
        text-sm
        transition
        ${active
                    ? "bg-[#636EE1]/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }
      `}
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon size={16} />}
                <span>{label}</span>
            </div>

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
