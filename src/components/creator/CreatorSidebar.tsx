import Image from "next/image";
import Link from "next/link";

type Props = {
    active: "dashboard" | "agreements" | "portfolio" | "profile" | "payments" | "activity" | "inbox" | "analytics";
    creatorProfile: {
        name: string;
        email?: string;
    };
    agreementsCount: number;
    inboxCount: number;
    pendingPaymentsCount: number;
    pendingDeliverablesCount: number;
};


export default function CreatorSidebar({
    active,
    creatorProfile,
    inboxCount = 0,
    pendingDeliverablesCount = 0,
    agreementsCount = 0,
    pendingPaymentsCount = 0,
}: Props) {
    return (
        <aside className="hidden lg:flex h-screen sticky top-0 w-64 flex-col border-r border-white/10 bg-black px-6 py-6 shrink-0">

            {/* Logo */}
            <Link href="/dashboard/creator">
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
                        href="/dashboard/creator"
                        active={active === "dashboard"}
                    />
                    <SidebarItem
                        label="Agreements"
                        href="/creator/agreements"
                        active={active === "agreements"}
                        badge={agreementsCount}
                    />

                    <SidebarItem
                        label="Inbox"
                        href="/creator/inbox"
                        active={active === "inbox"}
                        badge={inboxCount}
                    />

                </div>

                <div className="space-y-1 border-t border-white/10 pt-4">
                    <SidebarItem
                        label="Portfolio"
                        href="/creator/portfolio"
                        active={active === "portfolio"}
                    />

                    <SidebarItem
                        label="Analytics"
                        href="/creator/analytics"
                        active={active === "analytics"}
                    />
                    <SidebarItem
                        label="Payments"
                        href="/creator/payments"
                        active={active === "payments"}
                        badge={pendingPaymentsCount}
                    />
                </div>
            </nav>

            {/* Footer */}
            <div className="mt-auto border-t border-white/10 pt-4 space-y-1">
                <div className="text-sm font-medium">
                    {creatorProfile.name}
                </div>

                {creatorProfile.email && (
                    <div className="text-xs opacity-70">
                        {creatorProfile.email}
                    </div>
                )}

                <Link
                    href="/creator/portfolio"
                    className="
            mt-2 inline-flex items-center gap-1
            text-xs
            border p-2 rounded-md
            border-[#636EE1]
            text-[#636EE1]
            hover:bg-[#636de142] hover:text-white
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
}: {
    label: string;
    href: string;
    active?: boolean;
    badge?: number;
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
