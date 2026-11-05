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
  Plus,
  ExternalLink,
} from "lucide-react";
import { DeleteCustomPageButton } from "@/components/admin/DeleteCustomPageButton";
import { STATIC_PAGES } from "@/lib/static-pages";
import { listCustomPagesAdmin } from "@/lib/custom-pages";

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

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const customPages = await listCustomPagesAdmin();

  return (
    <div className="min-h-screen bg-[#F6F8FA] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
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
            Edit system pages, or create your own and place them in the header /
            footer menu.
          </p>
        </div>
        <Link
          href="/admin/pages/custom/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-[6px] bg-[#FF5548] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e04337]"
        >
          <Plus className="h-4 w-4" />
          Add new page
        </Link>
      </div>

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#172455]">
            Custom pages
          </h2>
          <span className="text-xs text-[#6B7280]">
            {customPages.length} page{customPages.length === 1 ? "" : "s"}
          </span>
        </div>

        {customPages.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#D1D5DB] bg-white px-5 py-10 text-center">
            <p className="text-sm font-semibold text-[#172455]">
              No custom pages yet
            </p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Create a page and toggle header/footer menu from the editor.
            </p>
            <Link
              href="/admin/pages/custom/new"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5548] hover:underline"
            >
              <Plus className="h-4 w-4" />
              Create your first page
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[#E8EAEF] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Menu</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customPages.map((page) => {
                  const menuBits = [
                    page.showInHeader ? "Header" : null,
                    page.showInFooter ? "Footer" : null,
                  ].filter(Boolean);
                  return (
                    <tr
                      key={page.id}
                      className="border-b border-[#F1F3F5] last:border-0"
                    >
                      <td className="px-4 py-3 font-semibold text-[#172455]">
                        {page.title}
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-[#21AAA5]">
                        /{page.slug}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {menuBits.length ? menuBits.join(" · ") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            page.published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {page.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {page.published ? (
                            <Link
                              href={`/${page.slug}`}
                              target="_blank"
                              className="rounded p-1.5 text-[#6B7280] hover:bg-[#F6F8FA] hover:text-[#172455]"
                              aria-label="View page"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          ) : null}
                          <Link
                            href={`/admin/pages/custom/${page.id}`}
                            className="rounded-[5px] bg-[#172455] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0f1839]"
                          >
                            Edit
                          </Link>
                          <DeleteCustomPageButton
                            id={page.id}
                            title={page.title}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#172455]">
          System pages
        </h2>
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
      </section>
    </div>
  );
}
