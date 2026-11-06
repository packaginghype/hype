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
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import {
  formatBlogDate,
  getBlogBySlug,
  getPublishedBlogs,
  getBlogFallbackImage,
  extractHeadingsFromHtml,
  ensureHeadingIds,
} from "@/lib/blogs";

export const revalidate = 120;

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
    ((post as { canonicalUrl?: string | null }).canonicalUrl || "").trim() ||
    `https://packaginghype.com/blog/${slug}`;

  return {
    title,
    description,
    keywords: post.seoKeywords || undefined,
    alternates: {
      canonical,
    },
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
  const relatedBlogs = allBlogs.filter((b) => b.slug !== slug).slice(0, 3);

  const banner =
    post.bannerImageUrl ||
    post.featuredImage ||
    getBlogFallbackImage(post.slug);
  const estRead = readingTime(post.content || "");

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
        <Container className="max-w-6xl pt-10 sm:pt-14 pb-16">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Article Content Column */}
            <div className={toc.length > 0 ? "order-last min-w-0 lg:order-1 lg:col-span-8" : "min-w-0 lg:col-span-12"}>
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

              {/* Author Bio & Actions */}
              <div className="mt-14 border-t border-gray-100 pt-8">
                <div className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#172455] text-sm font-bold text-white shadow-sm">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#172455]">{post.author}</p>
                      <p className="text-xs text-gray-500">
                        Packaging Hype Editorial Team • Industry Packaging Insights &amp; Trends
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

          {/* ── Related Articles ────────────────────────────────────── */}
          {relatedBlogs.length > 0 ? (
            <section className="border-t border-gray-100 mt-16 pt-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-heading text-2xl font-extrabold text-[#111111]">
                    More from the Packaging Hype Blog
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Explore recent trends, guides, and tips for custom packaging.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#FF5548] hover:text-[#e04337]"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {relatedBlogs.map((item) => {
                  const img = item.thumbnailImageUrl || item.featuredImage || item.bannerImageUrl;
                  return (
                    <Link
                      key={item.id}
                      href={`/blog/${item.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F6F8FA]">
                        {img ? (
                          <Image
                            src={img}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-300">
                            <BookOpen className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#FF5548]">
                          {formatBlogDate(item.publishedDate)}
                        </p>
                        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-[#172455] group-hover:text-[#FF5548]">
                          {item.title}
                        </h3>
                        {item.excerpt ? (
                          <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">
                            {item.excerpt}
                          </p>
                        ) : null}
                        <span className="mt-auto pt-3 text-xs font-bold text-[#172455] group-hover:text-[#FF5548] inline-flex items-center gap-1">
                          Read Article <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </Container>
      </article>
    </>
  );
}
