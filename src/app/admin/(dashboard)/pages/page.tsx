import Link from "next/link";
import {
  Home,
  FileText,
  Building2,
  Phone,
  Shield,
  Truck,
  ScrollText,
  RotateCcw,
  MessageSquareQuote,
} from "lucide-react";
import { STATIC_PAGES } from "@/lib/static-pages";

const ICONS = {
  home: Home,
  "about-us": Building2,
  "contact-us": Phone,
  "privacy-policy": Shield,
  "shipping-delivery-policy": Truck,
  "terms-and-conditions": ScrollText,
  "refund-return-policy": RotateCcw,
  quote: MessageSquareQuote,
} as const;

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
          Edit static pages. Public URLs match the previous WordPress site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATIC_PAGES.map((page) => {
          const Icon = ICONS[page.key as keyof typeof ICONS] || FileText;
          return (
            <Link
              key={page.key}
              href={`/admin/pages/${page.key}`}
              className="group flex items-start gap-4 rounded-[12px] border border-[#E5E7EB] bg-white p-5 transition-all hover:border-[#172455] hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF2FF] text-[#172455] transition-colors group-hover:bg-[#172455] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#172455]">{page.title}</p>
                <p className="mt-0.5 font-mono text-[11px] text-[#21AAA5]">
                  {page.path}
                </p>
                <p className="mt-1 text-xs leading-snug text-[#6B7280]">
                  {page.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
