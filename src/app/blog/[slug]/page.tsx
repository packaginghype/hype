import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { BlogReadingProgress } from "@/components/blog/BlogReadingProgress";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { RelatedBlogsCarousel } from "@/components/products/RelatedBlogsCarousel";
import { FaqAccentHeading } from "@/components/ui/FAQAccordion";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { Calendar, Clock, ArrowLeft, BookOpen } from "lucide-react";
import {
  formatBlogDate,
  getBlogBySlug,
  getPublishedBlogs,
  getBlogFallbackImage,
  extractHeadingsFromHtml,
  ensureHeadingIds,
} from "@/lib/blogs";
import { toVideoEmbedUrl } from "@/lib/blog-video";
import type { RelatedBlogItem } from "@/types";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return { title: "Blog Article Not Found" };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || post.title;

  const canonical =
    (post.canonicalUrl || "").trim() ||
    `https://packaginghype.com/blog/${slug}`;

  return {
    title,
    description,
    keywords: post.seoKeywords || undefined,
    alternates: {
      canonical,
    },
    robots: post.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      images: post.bannerImageUrl || post.featuredImage || undefined,
    },
  };
}

/** Rough word-count → reading-time estimate */
function readingTime(html: string): string {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const allBlogs = await getPublishedBlogs();
  const relatedBlogs: RelatedBlogItem[] = allBlogs
    .filter((b) => b.slug !== slug)
    .slice(0, 4)
    .map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      featuredImage: b.featuredImage,
      thumbnailImageUrl: b.thumbnailImageUrl || b.bannerImageUrl,
      publishedDate: b.publishedDate,
      author: b.author,
    }));

  const banner =
    post.bannerImageUrl ||
    post.featuredImage ||
    getBlogFallbackImage(post.slug);
  const estRead =
    post.readTime?.trim() || readingTime(post.content || "");
  const videoEmbed = toVideoEmbedUrl(post.videoUrl);
  const faqItems = (post.faqs || [])
    .map((f) => ({
      question: f.question,
      answer: f.answer,
    }))
    .filter((f) => f.question.trim());

  const rawHtml = post.content || "";
  const toc = extractHeadingsFromHtml(rawHtml);
  const enrichedContent = ensureHeadingIds(rawHtml);

  return (
    <>
      {/* ── Reading Progress Bar ──────────────────────────────────── */}
      <BlogReadingProgress />

      <article className="min-h-screen bg-white text-[#172455]">
        {post.seoScript ? <JsonLdScript source={post.seoScript} /> : null}

        {/* ── Hero Banner: two-column (title + desc + CTA | image) ─── */}
        <div className="border-b border-gray-100 bg-[#FAFAFA]">
          <Container className="max-w-6xl py-10 sm:py-14">
            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />

            <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left column */}
              <div className="flex flex-col gap-5">
                {post.category?.trim() ? (
                  <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#172455] shadow-sm ring-1 ring-[#E8EAEF]">
                    {post.category}
                  </span>
                ) : null}
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#172455] sm:text-4xl lg:text-[2.4rem] lg:leading-[1.2]">
                  {post.title}
                </h1>

                {post.excerpt ? (
                  <p className="text-base leading-relaxed text-[#4A5568] sm:text-lg">
                    {post.excerpt}
                  </p>
                ) : null}

                <Link
                  href="/quote"
                  className="inline-flex w-fit items-center justify-center rounded-lg bg-[#FF5548] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e04337]"
                >
                  Get a Quote
                </Link>
              </div>

              {/* Right column – banner image */}
              {banner ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                  <div className="relative aspect-[4/3] w-full bg-[#F6F8FA]">
                    <Image
                      src={banner}
                      alt={post.bannerImageAlt || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      unoptimized
                    />
                  </div>
                  {post.bannerImageTitle ? (
                    <p className="border-t border-gray-100 bg-[#FAFAFA] px-4 py-2 text-center text-xs text-gray-500">
                      {post.bannerImageTitle}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Meta row below hero */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4A5568]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#172455] text-xs font-bold text-white shadow-sm">
                    PH
                  </div>
                  <span className="font-semibold text-[#172455]">{post.author}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <time dateTime={new Date(post.publishedDate).toISOString()}>
                    {formatBlogDate(post.publishedDate)}
                  </time>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span>{estRead}</span>
                </div>
              </div>
              <BlogShareButtons title={post.title} />
            </div>
          </Container>
        </div>

        {/* ── Main Article Body + Table of Contents Layout ──────────── */}
        <Container className="max-w-6xl pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Article Content Column */}
            <div
              className={
                toc.length > 0
                  ? "order-last min-w-0 lg:order-1 lg:col-span-8"
                  : "min-w-0 lg:col-span-12"
              }
            >
              <article id="blog-article-content" className="w-full">
                <div
                  className="prose prose-slate prose-lg max-w-none text-[#2D3748] leading-[1.85]
                    [&_h2]:scroll-mt-28 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#172455] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pt-4 [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2
                    [&_h3]:scroll-mt-28 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#172455] [&_h3]:mt-8 [&_h3]:mb-3
                    [&_p]:mb-6 [&_p]:leading-[1.85] [&_p]:text-[17px] [&_p]:text-[#334155]
                    [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_li]:leading-[1.7]
                    [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_li]:leading-[1.7]
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#21AAA5] [&_blockquote]:bg-[#F4FAF8] [&_blockquote]:rounded-r-xl [&_blockquote]:p-5 [&_blockquote]:my-6 [&_blockquote]:text-[#334155] [&_blockquote]:italic
                    [&_img]:rounded-2xl [&_img]:my-8 [&_img]:border [&_img]:border-gray-100 [&_img]:shadow-sm
                    [&_a]:text-[#FF5548] [&_a]:underline hover:[&_a]:text-[#e04337]
                    [&_strong]:text-[#0F172A] [&_strong]:font-bold"
                >
                  <RichText html={enrichedContent} />
                </div>
              </article>

              {videoEmbed ? (
                <section className="mt-14">
                  {post.videoTitle?.trim() ? (
                    <h2 className="mb-4 font-heading text-xl font-bold text-[#172455] sm:text-2xl">
                      {post.videoTitle}
                    </h2>
                  ) : null}
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-black shadow-sm">
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={videoEmbed}
                        title={post.videoTitle || post.title}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </section>
              ) : null}

              {/* Author Bio & Actions */}
              <div className="mt-14 border-t border-gray-100 pt-8">
                <div className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#172455] text-sm font-bold text-white shadow-sm">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#172455]">
                        {post.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        Packaging Hype Editorial Team • Industry Packaging
                        Insights &amp; Trends
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/quote"
                      className="inline-flex items-center justify-center rounded-lg bg-[#FF5548] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#e04337]"
                    >
                      Get Custom Quote
                    </Link>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-[#172455] transition-colors hover:border-[#172455]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      All Articles
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Contents Sticky Sidebar */}
            {toc.length > 0 ? (
              <aside className="order-first min-w-0 lg:order-2 lg:col-span-4 lg:self-stretch">
                <BlogTableOfContents items={toc} />
              </aside>
            ) : null}
          </div>
        </Container>

        {faqItems.length > 0 ? (
          <BlogFaqSection
            heading={post.faqsHeading}
            subheading={post.faqsSubheading}
            items={faqItems}
            imageUrl={post.faqsImageUrl}
            imageAlt={post.faqsImageAlt || post.faqsImageTitle}
          />
        ) : null}

        {relatedBlogs.length > 0 ? (
          <section
            className={
              faqItems.length > 0
                ? "border-t border-gray-100 bg-white py-8 sm:py-12 lg:py-16"
                : "bg-[#F6F8FA] py-8 sm:py-12 lg:py-16"
            }
          >
            <Container className="max-w-6xl">
              <div className="max-w-2xl text-left">
                <FaqAccentHeading text="Explore More Packaging Guides" />
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6B7280] sm:text-[15px]">
                  Continue learning with practical packaging guides, material
                  tips, and helpful resources for your next custom box project.
                </p>
              </div>
              <RelatedBlogsCarousel blogs={relatedBlogs} />
            </Container>
          </section>
        ) : null}
      </article>
    </>
  );
}
