import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { formatBlogDate, getBlogBySlug, getPublishedBlogs, getBlogFallbackImage } from "@/lib/blogs";

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

  return {
    title,
    description,
    keywords: post.seoKeywords || undefined,
    openGraph: {
      title,
      description,
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

  return (
    <article className="min-h-screen bg-white text-[#172455]">
      {post.seoScript ? (
        <div dangerouslySetInnerHTML={{ __html: post.seoScript }} />
      ) : null}

      {/* ── Breadcrumbs Bar ───────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-[#FAFAFA]/80">
        <Container className="max-w-4xl py-3.5">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
        </Container>
      </div>

      {/* ── Editorial Header ──────────────────────────────────────── */}
      <Container className="max-w-4xl pt-8 sm:pt-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1F0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FF5548]">
              <Sparkles className="h-3 w-3" />
              Packaging Insights & Guides
            </span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.18]">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 pt-2">
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
        </div>

        {/* ── Featured Image (Clean & Unobscured) ──────────────────── */}
        {banner ? (
          <div className="my-8 overflow-hidden rounded-2xl border border-gray-100 shadow-sm sm:my-10">
            <div className="relative aspect-[16/9] w-full bg-[#F6F8FA] sm:aspect-[21/9]">
              <Image
                src={banner}
                alt={post.bannerImageAlt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
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

        {/* ── Excerpt Lead ──────────────────────────────────────────── */}
        {post.excerpt ? (
          <div className="mb-8 rounded-r-xl border-l-4 border-[#FF5548] bg-[#FFF9F8] p-5 text-base font-medium leading-relaxed text-[#2D3748] sm:text-lg sm:leading-8">
            {post.excerpt}
          </div>
        ) : null}

        {/* ── Main Article Body (No Card Box) ───────────────────────── */}
        <div className="prose prose-slate prose-lg max-w-none text-[#2D3748] leading-[1.8]
          [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#172455] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pt-4
          [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#172455] [&_h3]:mt-8 [&_h3]:mb-3
          [&_p]:mb-6 [&_p]:leading-[1.8]
          [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_li]:leading-[1.7]
          [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_li]:leading-[1.7]
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#21AAA5] [&_blockquote]:bg-[#F4FAF8] [&_blockquote]:rounded-r-lg [&_blockquote]:p-4 [&_blockquote]:my-6 [&_blockquote]:text-[#334155] [&_blockquote]:italic
          [&_img]:rounded-xl [&_img]:my-8 [&_img]:border [&_img]:border-gray-100 [&_img]:shadow-sm
          [&_a]:text-[#FF5548] [&_a]:underline hover:[&_a]:text-[#e04337]
          [&_strong]:text-[#0F172A] [&_strong]:font-bold"
        >
          <RichText html={post.content} />
        </div>

        {/* ── Author Bio & Actions ──────────────────────────────────── */}
        <div className="mt-14 border-t border-gray-100 pt-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#172455] text-sm font-bold text-white shadow-sm">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#172455]">{post.author}</p>
                <p className="text-xs text-gray-500">
                  Packaging Hype Editorial Team • Industry Packaging Insights & Trends
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

        {/* ── Related Articles ──────────────────────────────────────── */}
        {relatedBlogs.length > 0 ? (
          <section className="border-t border-gray-100 mt-16 pt-12 pb-16">
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
        ) : (
          <div className="pb-16" />
        )}
      </Container>
    </article>
  );
}
