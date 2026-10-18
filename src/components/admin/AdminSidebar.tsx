"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  Factory,
  Boxes,
  Shapes,
  FileText,
  Newspaper,
  Globe2,
  Star,
  Settings,
  Mail,
  Inbox,
  History,
  Users,
} from "lucide-react";
import { AdminNavLink } from "@/components/admin/AdminNavLink";

type LinkItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  superAdminOnly?: boolean;
};

const LINKS: LinkItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/industries", label: "Industries", icon: Factory },
  { href: "/admin/box-by-material", label: "Box by Materials", icon: Boxes },
  { href: "/admin/shapes-styles", label: "Shapes & Styles", icon: Shapes },
  { href: "/admin/products", label: "Packaging Products", icon: Package },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/global-variables", label: "Global Variables", icon: Globe2 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/general-settings", label: "General Setting", icon: Settings },
  { href: "/admin/email-templates", label: "Email Templates", icon: Mail },
  {
    href: "/admin/quotes",
    label: "Manage Inquiries",
    icon: Inbox,
    superAdminOnly: true,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    superAdminOnly: true,
  },
  {
    href: "/admin/activity-logs",
    label: "Activity Logs",
    icon: History,
    superAdminOnly: true,
  },
];

function isLinkActive(
  pathname: string,
  href: string,
  exact?: boolean
): boolean {
  if (exact || href === "/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  adminName,
  role,
}: {
  adminName: string;
  role: "SUPER_ADMIN" | "STAFF";
}) {
  const pathname = usePathname() || "";
  const isSuper = role === "SUPER_ADMIN";
  const links = LINKS.filter((link) => !link.superAdminOnly || isSuper);

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#0f1839] text-white">
      <div className="shrink-0 border-b border-white/10 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Packaging Hype
        </p>
        <p className="mt-1 text-lg font-bold text-white">Admin Panel</p>
        <p className="mt-1 truncate text-xs text-slate-400">{adminName}</p>
        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {isSuper ? "Super Admin" : "Staff"}
        </p>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-3">
        {links.map((link) => (
          <AdminNavLink
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            active={isLinkActive(pathname, link.href, link.exact)}
          />
        ))}
      </nav>
    </aside>
  );
}
