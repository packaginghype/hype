import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { formatBlogDate, getPublishedBlogs } from "@/lib/blogs";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Packaging Design & Manufacturing Blog | Packaging Hype",
  description:
    "Practical packaging insights, dieline guides, material comparisons, and brand design ideas curated by the Packaging Hype engineering team.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogs();

  return (
    <div className="min-h-screen bg-[#F6F8FA] py-10 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: "Packaging Blog" }]} />

        <div className="mb-12 mt-6">
          <SectionHeading
            badge="Insights & Technical Guides"
            title="Packaging Hype Knowledge Hub"
            description="Explore in-depth articles on box structural dielines, paperboard stocks, sustainable printing techniques, and consumer unboxing trends."
            align="left"
            className="mb-0 max-w-3xl"
          />
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-[#21AAA5]" />
            <p className="mt-4 text-lg font-bold text-[#172455]">
              No published posts yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Check back soon for packaging guides and insights.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post) => {
              const image =
                post.thumbnailImageUrl ||
                post.bannerImageUrl ||
                post.featuredImage;
              return (
                <article
                  key={post.id}
                  className="card-hover-effect flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  {image ? (
                    <div className="relative aspect-[16/9] w-full bg-[#F6F8FA]">
                      <Image
                        src={image}
                        alt={
                          post.thumbnailImageAlt ||
                          post.bannerImageAlt ||
                          post.title
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatBlogDate(post.publishedDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {post.author}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-extrabold leading-snug tracking-tight text-[#172455]">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors hover:text-[#FF5548]"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                        {post.excerpt}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5548] hover:text-[#e04337]"
                    >
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
