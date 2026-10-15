import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";

const POSTS = [
  {
    title: "How To Choose Mylar Bags: A Step-by-Step Guide",
    slug: "how-to-choose-mylar-bags",
    excerpt:
      "Select the right barrier thickness, zipper style, and seal setup for long-term product protection.",
    date: "September 2026",
    category: "Material Guides",
  },
  {
    title: "The Power of Packaging Design in Modern Retail",
    slug: "power-of-packaging-design",
    excerpt:
      "How structure, print, and finishes influence shelf impact and purchase decisions.",
    date: "September 2026",
    category: "Branding",
  },
  {
    title: "Guide to International Packaging Symbols",
    slug: "guide-to-international-packaging-symbols",
    excerpt:
      "Understand shipping icons, recycling marks, and compliance labels for domestic and export freight.",
    date: "August 2026",
    category: "Compliance",
  },
] as const;

export function BlogPreviewSection() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
              Insights & Guides
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
              From the Packaging Blog
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-[15px]">
              Practical tips on materials, print, structure, and unboxing that help
              your brand ship smarter.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5548] transition-colors hover:text-[#e04337]"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {POSTS.map((post) => (
            <article key={post.slug} className="flex flex-col bg-[#F6F8FA] p-5 sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#21AAA5]">
                {post.category}
              </p>
              <h3 className="mt-2 text-[15px] font-bold leading-snug text-[#172455] sm:text-base">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors hover:text-[#FF5548]"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-gray-500">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E8EAEF] pt-3">
                <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-400">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {post.date}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[12.5px] font-bold text-[#172455] transition-colors hover:text-[#FF5548]"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
