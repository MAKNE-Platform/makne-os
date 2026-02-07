import Image from "next/image";
import Link from "next/link";

type Props = {
  active: "dashboard" | "agreements" | "activity" | "notifications" | "analytics" | "payments";
  brandProfile: {
    brandName: string;
    industry: string;
    location?: string;
  };
  notificationCount?: number;
};

export default function BrandSidebar({
  active,
  brandProfile,
  notificationCount = 0,
}: Props) {
  return (
    <aside className="hidden lg:flex h-screen sticky top-0 w-64 flex-col border-r border-white/10 bg-black px-6 py-6 shrink-0">

      {/* Logo */}
      <a href="/dashboard/brand">
        <Image
          src="/makne-logo-lg.png"
          alt="Makne"
          width={120}
          height={32}
          priority
        /></a>

      {/* Nav */}
      <nav className="mt-12 space-y-6 text-sm">

        <div className="space-y-1">
          <SidebarItem label="Dashboard" href="/dashboard/brand" active={active === "dashboard"} />
          <SidebarItem label="Agreements" href="/agreements" active={active === "agreements"} />
          <SidebarItem label="Activity" href="/system/activity" active={active === "activity"} />
        </div>

        <div className="space-y-1 border-t border-white/10 pt-4">
          <SidebarItem
            label="Inbox"
            href="/brand/notifications"
            active={active === "notifications"}
            badge={notificationCount}
          />
          <SidebarItem label="Analytics" href="/brand/analytics" active={active === "analytics"} />
          <SidebarItem label="Payments" href="/brand/payments" active={active === "payments"} />
        </div>
      </nav>

      {/* Brand footer */}
      <div className="mt-auto border-t border-white/10 pt-4 space-y-1">
        <div className="text-sm font-medium">
          {brandProfile.brandName}
        </div>

        <div className="text-xs opacity-70">
          {brandProfile.industry}
        </div>

        {brandProfile.location && (
          <div className="text-xs opacity-50">
            {brandProfile.location}
          </div>
        )}

        <Link
          href="/brand/settings"
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
          Manage Brand
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
}: {
  label: string;
  href?: string;
  active?: boolean;
}) {
  const Comp = href ? Link : "div";

  return (
    <Comp
      href={href as any}
      className={`
        flex items-center
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
      {label}
    </Comp>
  );
}
