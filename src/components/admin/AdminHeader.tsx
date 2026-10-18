"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

export function AdminHeader({ adminName }: { adminName: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <h1 className="text-sm font-bold text-[#172455]">
          Content & catalog management
        </h1>
        <p className="truncate text-[12px] font-medium text-[#6B7280]">
          Signed in as {adminName}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-[#E2E4E8] px-3 text-xs font-bold text-[#172455] transition-colors hover:border-[#172455] hover:bg-[#F6F8FA]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">View Site</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-[#172455] px-3 text-xs font-bold text-white transition-colors hover:bg-[#0f1839]"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
