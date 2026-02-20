import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  Mail,
  NotebookTabs,
  ChartSpline,
  HandCoins,
} from "lucide-react";

type Props = {
  active:
  | "dashboard"
  | "agreements"
  | "activity"
  | "notifications"
  | "analytics"
  | "payments";

  brandProfile: {
    brandName: string;
    industry: string;
    location?: string;
  };

  inboxCount?: number;
  draftAgreementsCount?: number;
  pendingPaymentsCount?: number;
};


export default function BrandSidebar({
  active,
  brandProfile,
  inboxCount = 0,
  draftAgreementsCount = 0,
  pendingPaymentsCount = 0,
}: Props) {

  return (
    <aside className="hidden lg:flex h-screen sticky top-0 w-64 flex-col border-r border-white/10 bg-black px-6 py-6 shrink-0">

      {/* Logo */}
      <a href="/brand/dashboard">
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
          <SidebarItem
            label="Dashboard"
            href="/brand/dashboard"
            active={active === "dashboard"}
            icon={LayoutDashboard}
          />

          <SidebarItem
            label="Agreements"
            href="/agreements"
            active={active === "agreements"}
            badge={draftAgreementsCount}
            icon={ClipboardList}
          />

          <SidebarItem
            label="Inbox"
            href="/brand/notifications"
            active={active === "notifications"}
            badge={inboxCount}
            icon={Mail}
          />

        </div>

        <div className="space-y-1 border-t border-white/10 pt-4">
          <SidebarItem
            label="Activity"
            href="/system/activity"
            active={active === "activity"}
            icon={NotebookTabs}
          />

          <SidebarItem
            label="Analytics"
            href="/brand/analytics"
            active={active === "analytics"}
            icon={ChartSpline}
          />

          <SidebarItem
            label="Payments"
            href="/brand/payments"
            active={active === "payments"}
            badge={pendingPaymentsCount}
            icon={HandCoins}
          />
        </div>
      </nav>


      {/* Brand footer */}
      <div className="mt-auto border-t capitalize border-white/10 pt-4 space-y-1">
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
  badge,
  icon: Icon,
}: {
  label: string;
  href?: string;
  active?: boolean;
  badge?: number;
  icon?: React.ComponentType<{ size?: number }>;
}) {
  const Comp = href ? Link : "div";

  return (
    <Comp
      href={href as any}
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
        <span
          className="
            ml-2
            min-w-[20px]
            h-5
            px-1
            rounded-full
            bg-[#636EE1]
            text-black
            text-[11px]
            font-medium
            flex items-center justify-center
          "
        >
          {badge}
        </span>
      )}
    </Comp>
  );
}
