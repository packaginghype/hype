import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Calendar, User, ArrowLeft, SendHorizontal, CheckCircle2 } from "lucide-react";

const VERIFIED_BLOGS_DATA: Record<
  string,
  {
    title: string;
    date: string;
    author: string;
    category: string;
    content: string[];
    keyTakeaways: string[];
  }
> = {
  "how-to-choose-mylar-bags": {
    title: "How To Choose Mylar Bags: A Step-by-Step Guide for Optimal Storage Solutions",
    date: "September 2026",
    author: "Packaging Hype Team",
    category: "Material Guides",
    content: [
      "Mylar bags have established themselves as the industry benchmark for barrier protection across food storage, pharmaceuticals, botanical extracts, and retail packaging. Manufactured from multi-layered biaxially-oriented polyethylene terephthalate (BoPET), these pouches prevent oxygen, moisture, and UV light degradation.",
      "When specifying mylar packaging for retail or shelf storage, thickness is measured in mils (1 mil = 1/1000th of an inch). For retail distribution, 4 to 5 mil pouches offer excellent balance between puncture resistance and flexibility. For long-term preservation, 7 mil heavy-duty barrier film ensures impenetrable protection against pinholes.",
      "Pairing your mylar bags with airtight heat sealing and certified child-resistant zippers guarantees freshness, regulatory compliance, and tamper evidence. At Packaging Hype, all our barrier bags are manufactured from FDA-compliant food grade materials with customizable holographic, matte, and spot UV finishes.",
    ],
    keyTakeaways: [
      "Choose 4.5 to 5 mil thickness for retail goods; 7 mil for extended shelf-life items.",
      "Incorporate oxygen absorbers to maintain moisture and freshness levels.",
      "Custom surface finishes like soft-touch matte elevate brand appeal without compromising seal strength.",
    ],
  },
  "power-of-packaging-design": {
    title: "The Power of Packaging Design in Modern Retail Shelf Positioning",
    date: "September 2026",
    author: "Packaging Hype Team",
    category: "Branding",
    content: [
      "In crowded retail environments, your physical packaging is the first and often only touchpoint between your product and potential buyers. Studies show consumers make purchase decisions in as little as 7 seconds.",
      "Effective box design harmonizes brand color psychology, tactile paperboard textures, and clear typographical hierarchy to communicate value instantly.",
      "Custom finishes such as spot UV gloss, gold foil stamping, and debossed logos create tactile interest that encourages shoppers to pick up your product.",
    ],
    keyTakeaways: [
      "Keep primary brand messaging legible from a 5-foot viewing distance.",
      "Tactile coatings dramatically increase perceived product value.",
      "Structural unboxing mechanics reinforce long-term brand loyalty.",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = VERIFIED_BLOGS_DATA[slug];

  if (!post) {
    return { title: "Blog Article Not Found" };
  }

  return {
    title: `${post.title} | Packaging Hype`,
    description: post.content[0].slice(0, 160),
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = VERIFIED_BLOGS_DATA[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <article className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-12 shadow-sm">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
            <span className="px-3 py-1 rounded bg-[#eaf7f6] text-[#21AAA5] font-bold">
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

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172455] tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Key Takeaways Box */}
          <div className="my-8 p-5 bg-[#F6F8FA] rounded-xl border border-gray-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#172455] mb-3">
              Key Engineering Takeaways
            </h4>
            <ul className="space-y-2">
              {post.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#21AAA5] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Body */}
          <div className="space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Article Footer & CTA */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#172455]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Knowledge Hub</span>
            </Link>

            <Button href="/quote" variant="primary" size="md">
              <SendHorizontal className="w-4 h-4 mr-1.5" />
              <span>Request Quote for Packaging</span>
            </Button>
          </div>
        </article>
      </Container>
    </div>
  );
}
