import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  getSitemapEntries,
  type SitemapEntry,
  type SitemapSection,
} from "@/lib/sitemap-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Browse all products, categories, industries, and articles on Packaging Hype.",
  alternates: { canonical: "https://packaginghype.com/sitemap" },
};

const SECTION_META: {
  key: SitemapSection;
  title: string;
  spanClass?: string;
}[] = [
  { key: "main", title: "Main Pages" },
  { key: "categories", title: "Categories" },
  { key: "industries", title: "Industries" },
  { key: "materials", title: "Box by Material" },
  { key: "shapes", title: "Shapes & Styles" },
  { key: "pages", title: "Policies" },
  {
    key: "products",
    title: "Products",
    spanClass: "md:col-span-2 xl:col-span-3",
  },
  {
    key: "blogs",
    title: "Blog Articles",
    spanClass: "md:col-span-2 xl:col-span-3",
  },
];

function groupBySection(entries: SitemapEntry[]) {
  const groups = new Map<SitemapSection, SitemapEntry[]>();
  for (const entry of entries) {
    if (entry.path === "/sitemap") continue;
    const list = groups.get(entry.section) || [];
    list.push(entry);
    groups.set(entry.section, list);
  }
  return groups;
}

export default async function SitemapPage() {
  const entries = await getSitemapEntries();
  const groups = groupBySection(entries);

  return (
    <div className="min-h-screen bg-[#F6F8FA] py-12 sm:py-16">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full bg-[#eaf7f6] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#21AAA5]">
            Navigation
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172455] sm:text-5xl">
            Sitemap
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#4B5563] sm:text-lg">
            A complete index of pages, products, categories, and articles on Packaging Hype.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SECTION_META.map((section) => {
            const items = groups.get(section.key) || [];
            if (items.length === 0) return null;
            const wide = section.key === "products" || section.key === "blogs";

            return (
              <section
                key={section.key}
                className={`rounded-2xl border border-[#E8EAEF] bg-white p-6 shadow-sm sm:p-7 ${section.spanClass || ""}`}
              >
                <h2 className="mb-5 text-lg font-bold text-[#172455]">
                  {section.title}
                  {wide ? (
                    <span className="ml-2 text-sm font-semibold text-[#6B7280]">
                      ({items.length})
                    </span>
                  ) : null}
                </h2>
                <ul
                  className={
                    wide
                      ? "grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3"
                      : "space-y-2.5"
                  }
                >
                  {items.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`text-sm text-[#4B5563] transition-colors hover:text-[#FF5548] ${
                          wide ? "line-clamp-1" : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
