import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { faqs: { orderBy: { sortOrder: "asc" } } },
  });

  if (!post) notFound();

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5548] hover:text-[#e04337]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blogs
          </Link>
          <h2 className="mt-1 text-2xl font-bold text-[#172455]">
            Edit Blog Post
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Slug:{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-[#172455]">
              {post.slug}
            </code>
          </p>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#172455] bg-white px-3.5 py-2 text-xs font-bold text-[#172455] transition-colors hover:bg-[#172455] hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Live Post
        </Link>
      </div>
      <BlogForm
        postId={post.id}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredEnabled: post.featuredEnabled,
          bannerImageUrl: post.bannerImageUrl || post.featuredImage,
          bannerImageAlt: post.bannerImageAlt,
          bannerImageTitle: post.bannerImageTitle,
          thumbnailImageUrl:
            post.thumbnailImageUrl ||
            post.featuredImage ||
            post.bannerImageUrl,
          thumbnailImageAlt: post.thumbnailImageAlt,
          thumbnailImageTitle: post.thumbnailImageTitle,
          author: post.author,
          category: post.category,
          readTime: post.readTime,
          publishedDate: post.publishedDate.toISOString(),
          videoUrl: post.videoUrl,
          videoTitle: post.videoTitle,
          faqsHeading: post.faqsHeading,
          faqsSubheading: post.faqsSubheading,
          faqsImageUrl: post.faqsImageUrl,
          faqsImageAlt: post.faqsImageAlt,
          faqsImageTitle: post.faqsImageTitle,
          faqs: post.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          })),
          seoTitle: post.seoTitle,
          seoKeywords: post.seoKeywords,
          seoDescription: post.seoDescription,
          seoScript: post.seoScript,
          canonicalUrl: post.canonicalUrl,
          noIndex: post.noIndex,
          isPublished: post.isPublished,
        }}
      />
    </div>
  );
}
