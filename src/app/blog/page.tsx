import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Packaging Design & Manufacturing Blog | Packaging Hype",
  description:
    "Practical packaging insights, dieline guides, material comparisons, and brand design ideas curated by the Packaging Hype engineering team.",
};

// Verified sample blog articles inspected from live post-sitemap.xml
const VERIFIED_BLOG_POSTS = [
  {
    id: "post-1",
    title: "How To Choose Mylar Bags: A Step-by-Step Guide for Optimal Storage",
    slug: "how-to-choose-mylar-bags",
    excerpt:
      "A comprehensive guide on selecting barrier pouch thicknesses, oxygen absorbers, heat-seal temperatures, and resealable zippers for long-term product protection.",
    date: "September 2026",
    author: "Packaging Hype Team",
    category: "Material Guides",
  },
  {
    id: "post-2",
    title: "The Power of Packaging Design in Modern Retail Shelf Positioning",
    slug: "power-of-packaging-design",
    excerpt:
      "How custom folding cartons, vibrant CMYK printing, tactile finishes, and structural window cutouts influence consumer purchase decisions in retail aisles.",
    date: "September 2026",
    author: "Packaging Hype Team",
    category: "Branding",
  },
  {
    id: "post-3",
    title: "Complete Guide to International Packaging Symbols & Compliance",
    slug: "guide-to-international-packaging-symbols",
    excerpt:
      "Decipher universal shipping icons, recycling arrows, fragile indicators, and humidity warnings required for domestic and export freight handling.",
    date: "August 2026",
    author: "Packaging Hype Team",
    category: "Compliance",
  },
  {
    id: "post-4",
    title: "Consumer Psychology in Luxury Candle Packaging & Unboxing",
    slug: "consumer-psychology-in-candle-box-design",
    excerpt:
      "Exploring rigid board density, soft-touch matte lamination, and structural crash-lock bases to safely house heavy glass candle vessels while delivering luxury.",
    date: "August 2026",
    author: "Packaging Hype Team",
    category: "Luxury Boxes",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: "Packaging Blog" }]} />

        <div className="mt-6 mb-12">
          <SectionHeading
            badge="Insights & Technical Guides"
            title="Packaging Hype Knowledge Hub"
            description="Explore in-depth articles on box structural dielines, paperboard stocks, sustainable printing techniques, and consumer unboxing trends."
            align="left"
            className="mb-0 max-w-3xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VERIFIED_BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden p-6 sm:p-8 card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="px-2.5 py-1 rounded bg-[#eaf7f6] text-[#21AAA5] font-semibold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#172455] hover:text-[#FF5548] transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#21AAA5] hover:text-[#172455] transition-colors"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  5 min read
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
