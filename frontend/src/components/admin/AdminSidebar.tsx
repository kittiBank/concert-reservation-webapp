"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PublicIcon } from "@/components/ui/PublicIcon";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin/concerts",
    label: "Home",
    icon: "/icon/home.png",
    match: (path: string) =>
      path.startsWith("/admin/concerts") || path === "/admin",
  },
  {
    href: "/admin/audit",
    label: "History",
    icon: "/icon/inbox.png",
    match: (path: string) => path.startsWith("/admin/audit"),
  },
  {
    href: "/concerts",
    label: "Switch to user",
    shortLabel: "User",
    icon: "/icon/refresh-ccw.png",
    match: () => false,
  },
];

function NavLink({
  href,
  label,
  shortLabel,
  icon,
  active,
  compact = false,
  onClick,
}: {
  href?: string;
  label: string;
  shortLabel?: string;
  icon: string;
  active?: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  const displayLabel = compact && shortLabel ? shortLabel : label;
  const className = cn(
    "flex items-center gap-3 rounded-lg text-[#111827] transition-colors",
    compact
      ? "flex-1 flex-col justify-center gap-1 px-1 py-2 text-[10px] font-medium"
      : "w-full px-3 py-2.5 text-sm font-medium",
    active ? "bg-[#E8F4FD]" : compact ? "" : "hover:bg-[#F9FAFB]",
  );

  const content = (
    <>
      <PublicIcon src={icon} alt="" size={compact ? 22 : 20} />
      <span className={cn(compact && "text-center leading-tight")}>
        {displayLabel}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href!} className={className}>
      {content}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <aside className="hidden h-screen w-56 shrink-0 flex-col border-r border-[#E5E7EB] bg-white md:flex lg:w-60">
        <div className="px-5 py-6">
          <h1 className="text-xl font-bold text-[#111827]">Admin</h1>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ href, label, shortLabel, icon, match }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              shortLabel={shortLabel}
              icon={icon}
              active={match(pathname)}
            />
          ))}
        </nav>

        <div className="border-t border-[#E5E7EB] p-3">
          <NavLink
            label="Logout"
            icon="/icon/log-out.png"
            onClick={handleLogout}
          />
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-stretch border-t border-[#E5E7EB] bg-white px-2 py-1 md:hidden">
        {navItems.map(({ href, label, shortLabel, icon, match }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            shortLabel={shortLabel}
            icon={icon}
            active={match(pathname)}
            compact
          />
        ))}
        <NavLink
          label="Logout"
          shortLabel="Logout"
          icon="/icon/log-out.png"
          onClick={handleLogout}
          compact
        />
      </nav>
    </>
  );
}
