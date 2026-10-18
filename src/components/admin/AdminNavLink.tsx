"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function NavLinkContent({
  label,
  icon: Icon,
}: {
  label: string;
  icon: LucideIcon;
}) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
      )}
      <span className="min-w-0 truncate">{label}</span>
    </>
  );
}

export function AdminNavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch="auto"
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors",
        active
          ? "bg-[#FF5548] text-white"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      )}
    >
      <NavLinkContent label={label} icon={icon} />
    </Link>
  );
}
