import Link from "next/link";
import { Home, FileText } from "lucide-react";

const PAGES = [
  {
    href: "/admin/pages/home",
    icon: Home,
    title: "Home Page",
    description: "Edit hero, about, reliable packaging, FAQ, inquiry form and SEO for the home page.",
  },
];

export default function AdminPagesPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <FileText className="h-3.5 w-3.5" />
          <span>Admin</span>
          <span>/</span>
          <span className="font-semibold text-[#172455]">Pages</span>
        </div>
        <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455]">
          Page Management
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Select a page to edit its content and settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((page) => {
          const Icon = page.icon;
          return (
            <Link
              key={page.href}
              href={page.href}
              className="group flex items-start gap-4 rounded-[12px] border border-[#E5E7EB] bg-white p-5 transition-all hover:border-[#172455] hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF2FF] text-[#172455] transition-colors group-hover:bg-[#172455] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#172455]">{page.title}</p>
                <p className="mt-1 text-xs leading-snug text-[#6B7280]">{page.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
