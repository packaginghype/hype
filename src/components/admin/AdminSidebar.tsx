"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  MessageSquareQuote,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/quotes", label: "Quotes", icon: MessageSquareQuote },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-[#0f1839] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Packaging Hype
        </p>
        <p className="mt-1 text-lg font-bold">Admin Panel</p>
        <p className="mt-1 truncate text-xs text-slate-400">{adminName}</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-[#FF5548] text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
